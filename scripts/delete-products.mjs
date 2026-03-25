/**
 * Bulk-delete product documents from Sanity.
 *
 * Default: dry-run only (lists IDs, no deletes).
 * Requires SANITY_API_TOKEN (Editor or higher) in .env.local.
 *
 * Examples:
 *   npm run delete:products
 *   npm run delete:products -- --execute
 *   npm run delete:products -- --all
 *   npm run delete:products -- --all --execute
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@sanity/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
  console.log("[delete-products] Loaded .env.local\n");
} else {
  console.warn("[delete-products] No .env.local — using process.env only.\n");
}

const args = process.argv.slice(2);
const execute = args.includes("--execute");
const deleteAll = args.includes("--all");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("❌ Missing SANITY_API_TOKEN (needs write access)");
  process.exit(1);
}

const groq = deleteAll
  ? `*[_type == "product"]._id`
  : `*[_type == "product" && _id match "product-*"]._id`;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

async function main() {
  const ids = await client.fetch(groq);

  if (!ids.length) {
    console.log("No matching product documents found.");
    process.exit(0);
  }

  const mode = deleteAll ? "ALL products (_type == \"product\")" : "products with _id matching product-*";
  console.log(`Filter: ${mode}`);
  console.log(`Found: ${ids.length} document(s)\n`);

  const preview = ids.slice(0, 20);
  preview.forEach((id) => console.log(`  - ${id}`));
  if (ids.length > 20) console.log(`  ... and ${ids.length - 20} more\n`);
  else console.log("");

  if (!execute) {
    console.log("Dry run only — no documents deleted.");
    console.log("To delete, run: npm run delete:products -- --execute");
    if (!deleteAll) {
      console.log("To include every product (not only product-*), add: --all");
    }
    process.exit(0);
  }

  console.log("Deleting…");
  const tx = client.transaction();
  for (const id of ids) {
    tx.delete(id);
  }
  await tx.commit();
  console.log(`✅ Deleted ${ids.length} product document(s).`);
  console.log(
    "Note: Image assets may remain in the dataset if still referenced elsewhere."
  );
}

main().catch((err) => {
  console.error("❌", err.message || err);
  process.exit(1);
});
