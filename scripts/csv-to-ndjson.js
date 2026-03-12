/**
 * TechSylph — CSV to Sanity NDJSON converter for bulk product import.
 * Run: npm run import:products
 * Reads scripts/import/products.csv → writes scripts/import/products.ndjson
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const IMPORT_DIR = path.join(__dirname, "import");
const CSV_PATH = path.join(IMPORT_DIR, "products.csv");
const IMAGES_DIR = path.join(IMPORT_DIR, "images");
const NDJSON_PATH = path.join(IMPORT_DIR, "products.ndjson");

const VALID_CATEGORIES = ["tshirts", "hoodies", "activewear", "custom"];

/**
 * Build a _sanityAsset value for dataset import so Sanity CLI uploads the file.
 * Must be absolute file:// URL (see https://www.sanity.io/docs/content-lake/importing-data).
 */
function toSanityAssetUri(imagePath) {
  const absolute = path.resolve(imagePath);
  const withSlashes = absolute.split(path.sep).join("/");
  return `image@file:///${withSlashes}`;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
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

  const documents = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowLabel = `row ${i + 2} (${(row.name || "").toString().slice(0, 30)}...)`;

    const slug = slugify(row.slug);
    if (!slug) {
      console.error(`❌ Skipping ${rowLabel}: slug is empty`);
      skipped++;
      continue;
    }

    const category = (row.category || "").trim().toLowerCase();
    if (!VALID_CATEGORIES.includes(category)) {
      console.warn(`⚠️  Invalid category "${row.category}" in ${rowLabel} — using "tshirts"`);
      warnings++;
    }
    const safeCategory = VALID_CATEGORIES.includes(category) ? category : "tshirts";

    let moq = 50;
    const moqNum = parseInt(row.moq, 10);
    if (Number.isNaN(moqNum) || moqNum < 1) {
      console.warn(`⚠️  Invalid MOQ "${row.moq}" in ${rowLabel} — defaulting to 50`);
      warnings++;
    } else {
      moq = moqNum;
    }

    const doc = {
      _id: `product-${slug}`,
      _type: "product",
      name: (row.name || "").trim(),
      slug: {
        _type: "slug",
        current: slug,
      },
      category: safeCategory,
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
      const filename = (row[imageColumns[idx]] || "").trim();
      if (!filename) continue;

      const imagePath = path.join(IMAGES_DIR, filename);
      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️  Image not found: ${filename} (row: ${row.name})`);
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

  const ndjsonLines = documents.map((doc) => JSON.stringify(doc)).join("\n");
  fs.writeFileSync(NDJSON_PATH, ndjsonLines, "utf-8");

  console.log(`\n✅ Converted ${documents.length} products → scripts/import/products.ndjson`);
  if (warnings) console.log(`⚠️  ${warnings} warnings — check above before importing`);
  if (skipped) console.log(`❌ ${skipped} rows skipped due to errors`);
  console.log("\n✅ " + documents.length + " products ready to import\n");
}

main();
