/**
 * TechSylph — CSV to Sanity NDJSON converter for bulk product import.
 * Run: npm run import:products
 * Reads scripts/import/products.csv → writes scripts/import/products.ndjson
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { parse } = require("csv-parse/sync");

const IMPORT_DIR = path.join(__dirname, "import");
const CSV_PATH = path.join(IMPORT_DIR, "products.csv");
const IMAGES_DIR = path.join(IMPORT_DIR, "images");
const NDJSON_PATH = path.join(IMPORT_DIR, "products.ndjson");

const KNOWN_CATEGORY_TITLES = {
  tshirts: "T-Shirts & Basics",
  hoodies: "Hoodies & Sweatshirts",
  activewear: "Activewear",
  custom: "Custom / Private Label",
  jackets: "Jackets",
};

/** Sanity custom document IDs.
 * Sanity drafts use the system prefix `drafts.` + the published `_id`, so we must keep
 * the published `_id` short enough for *both* versions to stay within Sanity's 128 char limit.
 */
const DOC_ID_PREFIX = "product-";
const DRAFT_ID_PREFIX = "drafts.";
const SANITY_DOC_ID_MAX_LEN = 128;

const MAX_PUBLISHED_ID_LEN = SANITY_DOC_ID_MAX_LEN - DRAFT_ID_PREFIX.length; // 121
// Keep slug within both:
// 1) Sanity document-id length constraints (drafts.<_id> + published _id must be <= 128)
// 2) your schema constraint: sanity/schemas/product.ts sets slug options maxLength to 96
const MAX_SLUG_LEN_FROM_ID = MAX_PUBLISHED_ID_LEN - DOC_ID_PREFIX.length; // 113 (slug suffix length)
const MAX_SLUG_LEN = Math.min(96, MAX_SLUG_LEN_FROM_ID); // 96

/**
 * Shorten slug so `product-${slug}` is valid for Sanity and stable across re-imports.
 * @see https://www.sanity.io/docs/ids
 */
function shortenSlugForSanity(slug) {
  if (slug.length <= MAX_SLUG_LEN) return { slug, truncated: false };
  const hash = crypto.createHash("sha1").update(slug).digest("hex").slice(0, 8);
  const maxBase = MAX_SLUG_LEN - 1 - hash.length;
  const base = slug.slice(0, Math.max(1, maxBase));
  return { slug: `${base}-${hash}`, truncated: true };
}

/**
 * Build a _sanityAsset value for dataset import so Sanity CLI uploads the file.
 * Must be absolute file:// URL (see https://www.sanity.io/docs/content-lake/importing-data).
 */
function toSanityAssetUri(imagePath) {
  const absolute = path.resolve(imagePath);
  const withSlashes = absolute.split(path.sep).join("/");
  return `image@file:///${withSlashes}`;
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

function toRemoteSanityAssetUri(url) {
  return `image@${String(url || "").trim()}`;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function titleFromCategorySlug(slug) {
  if (KNOWN_CATEGORY_TITLES[slug]) return KNOWN_CATEGORY_TITLES[slug];
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function main() {
  let warnings = 0;
  let skipped = 0;

  if (!fs.existsSync(CSV_PATH)) {
    console.error("❌ Not found:", CSV_PATH);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  let rows;
  try {
    rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    });
  } catch (err) {
    console.error("❌ CSV parse error:", err.message);
    process.exit(1);
  }

  const categorySet = new Set(
    rows.map((row) => slugify(row.category)).filter(Boolean)
  );
  const categorySlugs = Array.from(categorySet);
  const categoryDocs = categorySlugs.map((slug, idx) => ({
    _id: `category-${slug}`,
    _type: "category",
    title: titleFromCategorySlug(slug),
    slug: {
      _type: "slug",
      current: slug,
    },
    order: idx + 1,
  }));
  const documents = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowLabel = `row ${i + 2} (${(row.name || "").toString().slice(0, 30)}...)`;

    const rawSlug = slugify(row.slug);
    if (!rawSlug) {
      console.error(`❌ Skipping ${rowLabel}: slug is empty`);
      skipped++;
      continue;
    }

    const { slug, truncated } = shortenSlugForSanity(rawSlug);
    if (truncated) {
      console.warn(
        `⚠️  Slug longer than ${MAX_SLUG_LEN} chars in ${rowLabel} — shortened + hash so product draft + published _id stay <= ${SANITY_DOC_ID_MAX_LEN} chars`
      );
      warnings++;
    }

    const safeCategory = slugify(row.category);
    if (!safeCategory) {
      console.error(`❌ Skipping ${rowLabel}: category is empty`);
      skipped++;
      continue;
    }

    let moq = 50;
    const moqNum = parseInt(row.moq, 10);
    if (Number.isNaN(moqNum) || moqNum < 1) {
      console.warn(`⚠️  Invalid MOQ "${row.moq}" in ${rowLabel} — defaulting to 50`);
      warnings++;
    } else {
      moq = moqNum;
    }

    const doc = {
      _id: `${DOC_ID_PREFIX}${slug}`,
      _type: "product",
      name: (row.name || "").trim(),
      slug: {
        _type: "slug",
        current: slug,
      },
      category: {
        _type: "reference",
        _ref: `category-${safeCategory}`,
      },
      description: (row.description || "").trim() || "",
      moq,
      badge: (row.badge || "").trim() || undefined,
      fabricDetails: (row.fabricDetails || "").trim() || undefined,
      availableColors: (row.availableColors || "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      availableSizes: (row.availableSizes || "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      customizable: (row.customizable || "").trim().toLowerCase() === "true",
      featured: (row.featured || "").trim().toLowerCase() === "true",
      seo: {
        _type: "object",
        metaTitle: (row.metaTitle || "").trim() || (row.name || "").trim(),
        metaDescription:
          (row.metaDescription || "").trim() || (row.description || "").trim() || "",
      },
    };

    const imageColumns = ["image1", "image2", "image3"];
    doc.images = [];

    for (let idx = 0; idx < imageColumns.length; idx++) {
      const imageValue = (row[imageColumns[idx]] || "").trim();
      if (!imageValue) continue;

      if (isHttpUrl(imageValue)) {
        doc.images.push({
          _type: "image",
          _key: `img-${idx}`,
          _sanityAsset: toRemoteSanityAssetUri(imageValue),
        });
        continue;
      }

      const imagePath = path.join(IMAGES_DIR, imageValue);
      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️  Image not found: ${imageValue} (row: ${row.name})`);
        warnings++;
        continue;
      }

      doc.images.push({
        _type: "image",
        _key: `img-${idx}`,
        _sanityAsset: toSanityAssetUri(imagePath),
      });
    }

    if (doc.images.length === 0) delete doc.images;
    documents.push(doc);
  }

  const ndjsonLines = [...categoryDocs, ...documents]
    .map((doc) => JSON.stringify(doc))
    .join("\n");
  fs.writeFileSync(NDJSON_PATH, ndjsonLines, "utf-8");

  console.log(`\n✅ Converted ${documents.length} products → scripts/import/products.ndjson`);
  if (warnings) console.log(`⚠️  ${warnings} warnings — check above before importing`);
  if (skipped) console.log(`❌ ${skipped} rows skipped due to errors`);
  console.log("\n✅ " + documents.length + " products ready to import\n");
}

main();
