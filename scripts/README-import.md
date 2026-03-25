# TechSylph — Bulk Product Import Guide

Import many products into Sanity at once using a CSV file and local images or image URLs. No changes to the website — this is a developer tooling workflow.

## Prerequisites

- **Sanity CLI** installed globally: `npm install -g @sanity/cli`
- **Logged into Sanity:** `sanity login`
- Your `.env.local` has `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
- **Bulk delete script** also needs `SANITY_API_TOKEN` (token with **Editor** or higher — same as in `.env.example`)

## Step 1 — Prepare your product data

1. Open `scripts/import/products.csv` in Excel or Google Sheets.
2. Fill in **one row per product**. Use the column definitions below.
3. Save as **CSV (comma-separated)** — overwrite the existing file.

Keep the header row unchanged. For fields with commas (e.g. description), wrap the value in double quotes in the CSV.

## Step 2 — Add your product images

You can use either of these approaches:

- **Local files (recommended):** put files in `scripts/import/images/` and use filenames in `image1` / `image2` / `image3`.
- **Remote URLs:** put full `http://` or `https://` URLs directly in `image1` / `image2` / `image3`.

1. Copy all your product image files (JPG or PNG) into:
   ```
   scripts/import/images/
   ```
2. Name them **exactly** as written in the `image1` / `image2` / `image3` columns.
   - Example: if the CSV has `classic-tee-front.jpg`, put that exact file in `scripts/import/images/`.
   - Or use a full URL like `https://cdn.example.com/products/classic-tee-front.jpg`.

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
2. **Create image assets** and link them to products.
   - Local files use Sanity’s `_sanityAsset` format (`image@file:///...`) with **absolute** paths.
   - Remote images use URL assets (`image@https://...`).

Wait for **"Import complete"** in the terminal.

> **Note:** For local images, the conversion script writes absolute `file://` paths into the NDJSON so that `sanity dataset import` can find and upload the files. Run the import from the same machine (and same paths) where the images live. For remote URL images, Sanity imports directly from the URL.

## Step 5 — Verify in Studio

1. Open **http://localhost:3000/studio** (or your deployed Studio URL).
2. Go to **Products**.
3. Confirm that products and images imported correctly.
4. Set **Featured** to `true` on any product to show it on the homepage.

## Step 6 — Re-importing / Updating products

You can safely re-run **Step 3** and **Step 4** at any time.

- The `--replace` flag means existing products (same `_id`) are **updated**, not duplicated.
- Products **not** in the CSV are **not** deleted — only rows in the CSV are created or updated.

## Bulk delete products (optional)

Use `scripts/delete-products.mjs` to remove many product documents at once. **Default is dry-run** — nothing is deleted until you pass `--execute`.

Requires `SANITY_API_TOKEN` in `.env.local`.

```bash
# Preview: only products whose _id matches product-* (same pattern as CSV import)
npm run delete:products

# Actually delete those documents
npm run delete:products -- --execute

# Preview ALL product documents (_type == product), including Studio-created ones
npm run delete:products -- --all

# Delete ALL product documents (destructive)
npm run delete:products -- --all --execute
```

Deleting documents does **not** always remove image assets from the dataset if they are still referenced elsewhere.

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
| **image1**        | No       | Local filename (e.g. `classic-tee-front.jpg`) or full image URL (`https://...`). |
| **image2**        | No       | Second local filename or full URL. |
| **image3**        | No       | Third local filename or full URL. |
| **metaTitle**     | No       | SEO title; falls back to **name** if empty. |
| **metaDescription** | No    | SEO description; falls back to **description** if empty. |

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| **"Image not found" warning** | For local images: check that the filename in the CSV matches exactly the file in `scripts/import/images/` (case and extension). For URL images: make sure the value starts with `http://` or `https://`. |
| **"Invalid category" warning** | Category must be one of: `tshirts`, `hoodies`, `activewear`, `custom`. |
| **Duplicate slug error** | Each product must have a unique slug. Change the slug in the CSV for one of the rows. |
| **Sanity auth error** | Run `sanity login` and complete the browser login. |
| **CSV parse error** | Ensure the file is saved as CSV (comma-separated). Fields containing commas must be wrapped in double quotes. |
| **"File does not exist" on import** | This applies to local images only (`file://` paths). Run the import from the same machine where you ran `npm run import:products` so paths point to your real `scripts/import/images/` folder. Use `--allow-failing-assets` only to skip missing images and still import documents. |

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
