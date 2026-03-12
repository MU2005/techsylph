# TechSylph — Bulk Product Import Guide

Import many products into Sanity at once using a CSV file and local images. No changes to the website — this is a developer tooling workflow.

## Prerequisites

- **Sanity CLI** installed globally: `npm install -g @sanity/cli`
- **Logged into Sanity:** `sanity login`
- Your `.env.local` has `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`

## Step 1 — Prepare your product data

1. Open `scripts/import/products.csv` in Excel or Google Sheets.
2. Fill in **one row per product**. Use the column definitions below.
3. Save as **CSV (comma-separated)** — overwrite the existing file.

Keep the header row unchanged. For fields with commas (e.g. description), wrap the value in double quotes in the CSV.

## Step 2 — Add your product images

1. Copy all your product image files (JPG or PNG) into:
   ```
   scripts/import/images/
   ```
2. Name them **exactly** as written in the `image1` / `image2` / `image3` columns.
   - Example: if the CSV has `classic-tee-front.jpg`, put that exact file in `scripts/import/images/`.

**Recommended image specs:**

- **Format:** JPG or PNG
- **Size:** minimum 800×800px; square or portrait preferred
- **Max file size:** 5MB per image

## Step 3 — Convert CSV to NDJSON

Run:

```bash
npm run import:products
```

This reads `scripts/import/products.csv` and generates `scripts/import/products.ndjson`.

Check the terminal output for any **warnings** or **errors** before continuing. Fix missing images or invalid categories and re-run if needed.

## Step 4 — Import into Sanity

From the **project root** (where `sanity.config.ts` lives), run:

```bash
sanity dataset import ./scripts/import/products.ndjson production --replace
```

**Flags:**

- `--replace` — updates existing products with the same `_id` (safe to re-run)
- `production` — your dataset name (change if you use a different dataset, e.g. `development`)

Sanity will:

1. Process the NDJSON and create/update product documents.
2. **Upload image files** and link them to products. Image paths in the NDJSON use Sanity’s `_sanityAsset` format (`image@file:///...`) with **absolute** paths, so the CLI reads files from `scripts/import/images/` and creates assets automatically.

Wait for **"Import complete"** in the terminal.

> **Note:** The conversion script writes absolute `file://` paths into the NDJSON so that `sanity dataset import` can find and upload the images. Run the import from the same machine (and same paths) where the images live.

## Step 5 — Verify in Studio

1. Open **http://localhost:3000/studio** (or your deployed Studio URL).
2. Go to **Products**.
3. Confirm that products and images imported correctly.
4. Set **Featured** to `true` on any product to show it on the homepage.

## Step 6 — Re-importing / Updating products

You can safely re-run **Step 3** and **Step 4** at any time.

- The `--replace` flag means existing products (same `_id`) are **updated**, not duplicated.
- Products **not** in the CSV are **not** deleted — only rows in the CSV are created or updated.

---

## Column reference

| Column            | Required | Description |
|-------------------|----------|-------------|
| **name**          | Yes      | Product name. |
| **slug**          | Yes      | URL slug, e.g. `classic-crew-tee`. Must be unique; no spaces. |
| **category**      | Yes      | One of: `tshirts`, `hoodies`, `activewear`, `custom`. |
| **description**   | Yes      | Product description paragraph. |
| **moq**           | Yes      | Minimum order quantity (number), e.g. `50`. |
| **badge**         | No       | Badge text, e.g. `Bestseller` or `New`. |
| **fabricDetails** | No       | Fabric info, e.g. `100% combed cotton, 180gsm`. |
| **availableColors** | No    | Pipe-separated colors inside one cell, e.g. `Black\|White\|Navy`. |
| **availableSizes**  | No    | Pipe-separated sizes, e.g. `XS\|S\|M\|L\|XL\|XXL`. |
| **customizable** | Yes      | `true` or `false`. |
| **featured**      | Yes      | `true` or `false`. Set `true` to show on homepage. |
| **image1**        | No       | Filename only, e.g. `classic-tee-front.jpg`. File must be in `scripts/import/images/`. |
| **image2**        | No       | Second image filename. |
| **image3**        | No       | Third image filename. |
| **metaTitle**     | No       | SEO title; falls back to **name** if empty. |
| **metaDescription** | No    | SEO description; falls back to **description** if empty. |

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| **"Image not found" warning** | Check that the filename in the CSV matches exactly the file in `scripts/import/images/` (case and extension). |
| **"Invalid category" warning** | Category must be one of: `tshirts`, `hoodies`, `activewear`, `custom`. |
| **Duplicate slug error** | Each product must have a unique slug. Change the slug in the CSV for one of the rows. |
| **Sanity auth error** | Run `sanity login` and complete the browser login. |
| **CSV parse error** | Ensure the file is saved as CSV (comma-separated). Fields containing commas must be wrapped in double quotes. |
| **"File does not exist" on import** | The NDJSON uses absolute `file://` paths. Run the import from the same machine where you ran `npm run import:products` so paths point to your real `scripts/import/images/` folder. Use `--allow-failing-assets` only to skip missing images and still import documents. |

---

## File structure

```
scripts/
  import/
    images/           ← put your JPG/PNG files here
      .gitkeep
    products.csv      ← template: fill and save
    products.ndjson   ← generated by npm run import:products (gitignored)
  csv-to-ndjson.js    ← conversion script
  README-import.md    ← this file
```
