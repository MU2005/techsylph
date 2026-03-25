# PROJECT OVERVIEW — TechSylph (techsylph)
Generated: 2026-03-25  
Scanner: Cursor AI

---

## 1. PROJECT IDENTITY

| Item | Detail |
|------|--------|
| **Name** | `techsylph` (package name in `package.json`) |
| **Type** | B2B **marketing + product catalog** site for an apparel export / manufacturing business (positioned as wholesale / private label). |
| **Purpose** | Showcase products and company value props, drive **Request for Quote (RFQ)** and **contact** inquiries, and serve localized content (EN/FR/DE). |
| **What the app does (plain English)** | Public visitors browse a Sanity-backed catalog (no prices), read static/marketing pages, blog posts, FAQ, and submit forms that create **Inquiry** documents in Sanity and optionally email the team via **Resend**. Editors manage content in **Sanity Studio** at `/studio`. |
| **Users** | **Anonymous visitors** (prospective wholesale buyers), **internal admins/content editors** (via Sanity Studio and Sanity project access). There is **no** registered buyer accounts, **no** vendor portal, and **no** first-party admin UI in this Next.js app beyond Sanity Studio. |

**Note:** This is **not** a transactional B2B storefront (no cart, checkout, payments, or order entities in this codebase).

---

## 2. TECH STACK

| Layer | Technology | Evidence |
|-------|------------|----------|
| **Frontend** | **Next.js 16.1.6** (App Router), **React 19.2.3** | `package.json`, `app/` structure |
| **Styling** | **Tailwind CSS v4** (`@tailwindcss/postcss`), custom theme in `app/globals.css` + `tailwind.config.ts` | `package.json`, `postcss.config.mjs` |
| **i18n** | **next-intl** `^4.8.3` — locales `en`, `fr`, `de`; `localePrefix: "always"` | `i18n/routing.ts`, `i18n/request.ts`, `messages/*.json` |
| **CMS / “database”** | **Sanity** (`sanity` `^5.14.1`, `next-sanity` `^12.1.1`, `@sanity/client`, GROQ queries) | `sanity/`, `sanity/lib/client.ts`, `sanity/lib/queries.ts` |
| **ORM / SQL DB** | **None in repo** — no Prisma, Drizzle, or SQL migrations | Glob scan |
| **API style** | **Next.js Route Handlers** (`app/api/*/route.ts`) — REST-like POST endpoints | `app/api/contact/route.ts`, `app/api/rfq/route.ts` |
| **Server Actions** | **None found** — no `use server` usage in scanned sources | `grep` over workspace |
| **Auth** | **None** for the public app; **Sanity** handles Studio authentication through Sanity’s own mechanisms when using `NextStudio` | `app/studio/[[...index]]/page.tsx`, `sanity/sanity.config.ts` |
| **Payments** | **None** | — |
| **Email** | **Resend** (`resend` `^6.9.3`) | API routes, `package.json` |
| **Storage** | **Sanity assets** (images, hero video file) + **Next.js** `public/` static files | Product images via `cdn.sanity.io` in `next.config.ts` |
| **Hosting** | **Vercel** implied by `vercel.json` (not locked to a single region in config) | `vercel.json` |
| **Queues / jobs** | **None** in app code | — |
| **Other notable libs** | **react-hook-form**, **zod**, **@hookform/resolvers**, **framer-motion**, **lucide-react**, **sonner**, **@portabletext/react**, **@base-ui/react** (UI primitives), **shadcn** package (CLI tooling in deps) | `package.json` |
| **Edge / routing middleware** | **next-intl** middleware via **`proxy.ts`** (Next.js 16 convention; `middleware.ts` not present) | `proxy.ts` (lines 1–8), Next.js internal message re: `PROXY_FILENAME` |

---

## 3. FOLDER STRUCTURE

### Tree (depth ~3, high-signal paths; `node_modules` / `.next` omitted)

```text
techsylph/
├── app/
│   ├── layout.tsx                 # Root HTML, fonts, Toaster
│   ├── globals.css
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── [locale]/                  # All localized marketing + catalog pages
│   │   ├── layout.tsx             # Metadata, Navbar, Footer, WhatsApp, JsonLd
│   │   ├── page.tsx               # Home
│   │   ├── about/
│   │   ├── blog/ + blog/[slug]/
│   │   ├── catalog/ + catalog/[slug]/
│   │   ├── contact/
│   │   ├── custom-label/
│   │   ├── faq/
│   │   ├── how-it-works/
│   │   ├── lookbook/
│   │   ├── rfq/
│   │   └── why-us/
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── rfq/route.ts
│   └── studio/[[...index]]/
│       └── page.tsx               # Embedded Sanity Studio
├── components/
│   ├── catalog/                   # Catalog grid, filters, product card, PDP
│   ├── custom-label/              # CMS-driven custom label sections
│   ├── faq/
│   ├── forms/                     # ContactForm, RFQForm
│   ├── home/                      # Hero, featured sections, testimonials, etc.
│   ├── layout/                    # Navbar, Footer, WhatsAppButton
│   ├── shared/                    # SectionHeading, CTAButton, JsonLd, Portable Text
│   └── ui/                        # shadcn-style primitives (sheet, dialog, …)
├── i18n/
│   ├── navigation.ts              # Localized Link, router hooks
│   ├── request.ts                 # next-intl request config
│   └── routing.ts                 # Locale list + prefix behavior
├── lib/
│   ├── utils.ts
│   └── validations.ts             # Zod schemas for API/forms
├── messages/                      # en.json, fr.json, de.json
├── public/                        # Static assets (logos, video, etc.)
├── sanity/
│   ├── sanity.config.ts
│   ├── lib/                       # client, writeClient, queries, image URL builder
│   └── schemas/                   # Sanity document types
├── scripts/                       # CSV→NDJSON, import helpers, delete-products, test-resend
├── types/
│   └── sanity.ts                  # TS interfaces for fetched documents
├── proxy.ts                       # next-intl middleware (Next 16 proxy convention)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── vercel.json
├── package.json
└── .env.example
```

### Major folders (roles)

| Path | Role |
|------|------|
| `app/[locale]/` | **Pages/routes** for all user-facing localized URLs. |
| `app/api/` | **API route handlers** (POST only for contact + RFQ). |
| `app/studio/` | **Sanity Studio** embed. |
| `components/` | **UI components**; most interactive sections are **Client Components** (`"use client"`). |
| `sanity/schemas/` | **Content model** (Sanity documents / fields) — closest thing to a DB schema in-repo. |
| `sanity/lib/queries.ts` | **GROQ** read queries; `writeClient` used for creates from API routes. |
| `lib/` | **Utilities** and **Zod** validation shared by forms and API. |
| `i18n/` + `messages/` | **Routing and translations** for next-intl. |
| `scripts/` | **Operational scripts** (import/delete products, email test) — not part of runtime app. |
| `types/sanity.ts` | **TypeScript types** for Sanity-shaped data. |

### Not present (confirmed by scan)

- No `middleware.ts` (uses `proxy.ts` instead for this Next version).
- No `stores/`, no Redux/Zustand modules.
- No `prisma/` or `drizzle/`.

---

## 4. DATABASE SCHEMA

There is **no relational database** in this repository. **Sanity Content Lake** stores **documents**. Below is the **document model** defined in `sanity/schemas/` (plus standard Sanity system fields: `_id`, `_type`, `_createdAt`, `_updatedAt`, `_rev`, etc.).

### `product` (`sanity/schemas/product.ts`)

| Field | Type / shape |
|-------|----------------|
| `name` | string (required) |
| `slug` | slug → `slug.current` (required) |
| `category` | string enum: `tshirts`, `hoodies`, `activewear`, `custom` |
| `description` | text |
| `moq` | number |
| `badge` | string |
| `images` | array of image (hotspot) |
| `fabricDetails` | string |
| `availableColors` | array of string |
| `availableSizes` | array of string |
| `customizable` | boolean (default false) |
| `featured` | boolean (default false) |
| `seo` | object: `metaTitle`, `metaDescription` |

**Keys:** `_id` is the document id; **`slug.current`** is the natural key for URLs (`/catalog/[slug]`).

### `blogPost` (`sanity/schemas/blogPost.ts`)

| Field | Type |
|-------|------|
| `title`, `slug` | string / slug (required) |
| `author` | string |
| `publishedAt` | datetime |
| `category` | string (controlled list) |
| `coverImage` | image |
| `excerpt` | text |
| `body` | portable text (blocks + images) |
| `seo` | object |

### `testimonial` (`sanity/schemas/testimonial.ts`)

| Field | Type |
|-------|------|
| `name`, `quote` | required string / text |
| `role`, `company`, `country` | string |
| `text` | text (legacy, hidden) |
| `rating` | number 1–5 |
| `avatar` | image |

### `faqItem` (`sanity/schemas/faqItem.ts`)

| Field | Type |
|-------|------|
| `question`, `answer` | string / text (required) |
| `order` | number (display order) |

### `inquiry` (`sanity/schemas/inquiry.ts`)

| Field | Type |
|-------|------|
| `name`, `company`, `country`, `email`, `phone` | string |
| `message` | text |
| `type` | `contact` \| `rfq` |
| `status` | `new` \| `in-progress` \| `resolved` |
| `products` | array of string (RFQ categories) |
| `quantity` | string |
| `hasAttachment`, `customLabelRequest` | boolean |
| `attachmentName` | string |

### `siteSettings` (singleton) (`sanity/schemas/siteSettings.ts`)

| Field | Type |
|-------|------|
| `statsProducts`, `statsCountries`, `statsMoq`, `statsTurnaround` | string |
| `heroVideo` | file (mp4/webm) |
| `categories` | array of objects: `title`, `slug`, `description`, `icon`, `color`, `image` |

**Singleton id:** configured in `sanity/sanity.config.ts` as document id `siteSettings`.

### `customLabel` (singleton) (`sanity/schemas/customLabel.ts`)

| Field | Type |
|-------|------|
| `heroHeadline`, `heroSubtitle` | string / text |
| `customizations` | array of objects (title, description, icon, image, details[]) |
| `process` | array of steps (stepNumber, title, description, duration) |
| `moqNote`, `turnaroundNote` | string |

**Singleton id:** `customLabel`.

### Indexes, FKs, RLS

- **Relational indexes/FKs/RLS:** **N/A** — not a Postgres/Supabase schema.
- **Sanity:** indexing and access control are **Sanity project / dataset / API token** concerns, not defined in these TS files. Auditors should review the **Sanity project** CORS, token scopes, and whether the **read** API is public (it is via `useCdn: true` in `sanity/lib/client.ts`).

### Schema / query notes for auditors

- `sanity/lib/queries.ts` exports **`INQUIRIES_QUERY`** (lines 39–42) listing inquiries with PII — **not referenced** elsewhere in the scanned TS/TSX tree. If wired to a page without protection, it would be a **high-severity** issue; currently it is **unused dead export** (verify with `grep`).
- RFQ **`customization`** field is validated in Zod but **not** stored as a separate Sanity field; it is folded into `message` string in `app/api/rfq/route.ts` (lines 91–91, 106).

---

## 5. API ROUTES

| Method | Path | Purpose | Auth | Input validation |
|--------|------|---------|------|-------------------|
| **POST** | `/api/contact` | Accepts contact form JSON; creates `inquiry` (`type: contact`) in Sanity; sends admin email via Resend if key present. | **NO** | **YES** — `contactSchema.safeParse` in `app/api/contact/route.ts` (lines 41–47) |
| **POST** | `/api/rfq` | Accepts JSON or `multipart/form-data` (JSON in `data` field + optional file); creates `inquiry` (`type: rfq`) in Sanity; emails admin with optional attachment via Resend. | **NO** | **Partial** — main fields validated with `schemaWithoutAttachment.safeParse` (lines 50–88 in `app/api/rfq/route.ts`); **file is not re-validated on server** (see §13) |

**Other HTTP methods:** Not implemented for these routes (no GET/PUT/DELETE handlers in files).

**Server Actions:** None found.

---

## 6. CORE USER FLOWS

### Guest browsing → registration → login

- **Browsing:** User visits `/{locale}/...` (middleware/proxy enforces locale prefix).
- **Registration / login:** **Not implemented** — no auth providers, sessions, or account pages.

### Product catalog browsing & search

1. **Server:** `app/[locale]/catalog/page.tsx` fetches all products via GROQ (`PRODUCTS_QUERY`).
2. **Client:** `components/catalog/CatalogClient.tsx` filters by **search string** (name/description), **category** (from URL `?category=` or UI), and **customizable** toggle.
3. **No server-side search** — all products are loaded then filtered in the browser.

### Product detail page

1. `app/[locale]/catalog/[slug]/page.tsx` fetches product by slug; `notFound()` if missing.
2. `generateStaticParams` prebuilds paths for **hardcoded** `["en","fr","de"]` × product slugs (lines 48–58) — should stay aligned with `i18n/routing.ts`.
3. **Related products:** same category, excluding current slug (up to 3).
4. **CTAs:** Link to `/rfq` and `/contact` (localized via `next-intl` navigation).

### Add to cart / wishlist

- **Not implemented.**

### Checkout / payment / orders

- **Not implemented** — no cart, Stripe, invoices, or order models in Sanity schemas scanned.

### B2B-specific flows (as implemented)

- **RFQ:** `app/[locale]/rfq/page.tsx` + `components/forms/RFQForm.tsx` → `POST /api/rfq` → Sanity `inquiry` + email.
- **Bulk / MOQ messaging:** Conveyed via product `moq` field and marketing copy, not a configurable pricing engine.
- **Tiered pricing, net terms, company accounts, approvals, vendor portal:** **Not in codebase.**

### Admin flows

- **Content:** Sanity Studio at `/studio` (`app/studio/[[...index]]/page.tsx`) — products, blog, FAQ, testimonials, inquiries (schema includes `inquiry`), settings, custom label page.
- **No** in-app Next.js admin for users/orders (orders don’t exist here).

### Contact

- `app/[locale]/contact/page.tsx` + `ContactForm` → `POST /api/contact`.

### Other pages (marketing / content)

- Home (`app/[locale]/page.tsx`) — featured products, testimonials, site settings, revalidate 60s.
- Static-ish pages: about, why-us, how-it-works, custom-label (CMS-driven sections), FAQ, lookbook, blog list + post.

### WhatsApp

- `components/layout/WhatsAppButton.tsx` — floating button after delay; uses `NEXT_PUBLIC_WHATSAPP_NUMBER` with fallback.

---

## 7. STATE MANAGEMENT

| Topic | Finding |
|-------|---------|
| **Global state library** | **None** — no Redux, Zustand, Jotai, or app-wide Context store for data. |
| **Server data** | Fetched in **Server Components** with `sanity/lib/client.ts` (`fetch`). |
| **Local UI state** | `useState` / `useRef` in client components (forms, navbar scroll, carousels, filters, image gallery). |
| **URL state** | Catalog uses `useSearchParams` for category (`CatalogClient.tsx`, `RFQForm.tsx` for `?type=custom`). |
| **Forms** | **react-hook-form** + **zod** resolvers on the client. |
| **TanStack Query / SWR** | **Not used** (not in `package.json`). |

---

## 8. COMPONENT INVENTORY

Line counts are **physical lines** (`Measure-Object -Line` in PowerShell), approximate; flags: **C** = Client (`"use client"`), **S** = Server (no directive).

**No component exceeds 400 lines**; largest is `RFQForm.tsx` (~380 lines).

| Path | Purpose | ~Lines | C/S |
|------|---------|--------|-----|
| `components/forms/RFQForm.tsx` | Full RFQ form, file upload, submit to `/api/rfq` | 380 | C |
| `components/ui/dropdown-menu.tsx` | Radix-style dropdown primitives | 250 | C |
| `components/catalog/ProductDetailContent.tsx` | PDP layout, gallery, specs, CTAs | 221 | C |
| `components/layout/Navbar.tsx` | Main nav, locale switcher, mobile sheet | 212 | C |
| `components/ui/select.tsx` | Select UI primitive | 188 | C |
| `components/home/HeroSection.tsx` | Homepage hero (video/image from settings) | 180 | C |
| `components/layout/Footer.tsx` | Site footer | 175 | S |
| `components/forms/ContactForm.tsx` | Contact form → `/api/contact` | 168 | C |
| `components/home/FeaturedCategories.tsx` | Category grid from site settings | 161 | C |
| `components/catalog/ProductFilters.tsx` | Search (debounced), category, customizable filter | 145 | C |
| `components/ui/dialog.tsx` | Dialog primitive | 144 | C |
| `components/home/HowItWorksMini.tsx` | Rotating “how it works” highlights | 139 | C |
| `components/home/FeaturedProducts.tsx` | Featured product grid | 138 | C |
| `components/home/WhyUsMini.tsx` | Rotating value props | 129 | C |
| `components/ui/sheet.tsx` | Sheet / drawer | 122 | C |
| `components/home/CTABanner.tsx` | Closing CTA section | 91 | C |
| `components/catalog/ProductCard.tsx` | Product card for grids | 86 | C |
| `components/custom-label/CustomLabelCustomizations.tsx` | Renders CMS customizations | 86 | C |
| `components/catalog/CatalogClient.tsx` | Catalog filtering + grid | 86 | C |
| `components/home/Testimonials.tsx` | Testimonial display | 82 | C |
| `components/home/StatsBar.tsx` | Stats from site settings | 81 | C |
| `components/home/WhyUsFeatureCard.tsx` | Feature card | 71 | C |
| `components/shared/SectionHeading.tsx` | Repeated section titles | 68 | S |
| `components/shared/CTAButton.tsx` | Link or button CTA | 65 | C |
| `components/layout/WhatsAppButton.tsx` | WhatsApp FAB | 61 | C |
| `components/faq/FAQAccordion.tsx` | FAQ accordion | 56 | C |
| `components/shared/PortableTextContent.tsx` | Renders Sanity portable text | 48 | C |
| `components/ui/badge.tsx` | Badge primitive | 48 | S* |
| `components/home/HowItWorksStepRow.tsx` | Step row UI | 43 | C |
| `components/ui/sonner.tsx` | Toast wrapper | 43 | C |
| `components/shared/ScrollAnimations.tsx` | Scroll-linked animations | 41 | C |
| `components/home/HomeAnimationWrapper.tsx` | Home page motion wrapper | 17 | C |
| `components/ui/button.tsx` | Button | 55 | C |
| `components/ui/accordion.tsx` | Accordion | 67 | C |
| `components/ui/card.tsx` | Card layout | 94 | S |
| `components/ui/input.tsx` | Input | 17 | S |
| `components/ui/textarea.tsx` | Textarea | 15 | S |
| `components/ui/separator.tsx` | Separator | 21 | C |
| `components/shared/JsonLd.tsx` | JSON-LD script tag | 11 | S |

\* `badge.tsx` uses `@base-ui/react` hooks but has **no** `"use client"` directive — **verify** it is only ever imported from Client boundaries; otherwise this may deserve a `"use client"` fix.

**Unused / low-referenced UI (scan note):** `grep` found **no** imports of `@/components/ui/input`, `textarea`, `select`, `card`, `badge`, `separator` from app code (only `sheet`, `dropdown-menu`, `accordion`, `button`, `sonner`). These files may be **scaffolded for future use**.

**App route modules (representative):**  
`app/[locale]/layout.tsx` (~105), `app/[locale]/page.tsx` (~37), `app/[locale]/catalog/[slug]/page.tsx` (~146), `app/api/rfq/route.ts` (~150), `app/api/contact/route.ts` (~92), `app/studio/[[...index]]/page.tsx` (~7, client).

---

## 9. ENVIRONMENT VARIABLES

**Names only** (from `.env.example` and code references; **do not commit real values**).

| Variable | Seen in |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `.env.example`, `sanity/lib/client.ts`, `sanity/lib/writeClient.ts`, `sanity/sanity.config.ts`, `sanity.cli.js` |
| `NEXT_PUBLIC_SANITY_DATASET` | `.env.example`, same as above |
| `SANITY_API_TOKEN` | `.env.example`, `sanity/lib/writeClient.ts` |
| `RESEND_API_KEY` | `.env.example`, `app/api/contact/route.ts`, `app/api/rfq/route.ts` |
| `RESEND_FROM` | `.env.example`, both API routes |
| `ADMIN_EMAIL` | `.env.example`, both API routes |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `.env.example`, `components/layout/WhatsAppButton.tsx` |

**`.env.example`:** **Yes** — `techsylph/.env.example` lists the above with placeholders.

**Documentation gaps:** `.env.example` does not state which vars are **required for build** vs **runtime features** (e.g. site can build with missing Resend key but emails won’t send). `SANITY_API_TOKEN` is **required** for API routes that call `writeClient.create` (token is passed to Sanity client in `sanity/lib/writeClient.ts`).

**Note:** `.env.local` exists in the workspace per glob search; it is **not** read or documented here (secrets). Auditors should confirm it is gitignored — see `techsylph/.gitignore`.

---

## 10. KNOWN ISSUES / TODOs

### TODO / FIXME / HACK / @ts-ignore / eslint-disable

| File | Line | Text |
|------|------|------|
| `app/[locale]/layout.tsx` | 7–9 | Comment `TODO`: add real `public/og-image.jpg` for OG/Twitter (1200×630) |

- **`FIXME`, `HACK`, `@ts-ignore`, `eslint-disable`:** **No matches** in `*.ts` / `*.tsx` (grep).

### `console.log`

| File | Line(s) | Notes |
|------|---------|-------|
| `scripts/csv-to-ndjson.js` | 189–192 | CLI progress output |
| `scripts/delete-products.mjs` | 40, 78–83, 87–88, 92–93, 95, 100, 106–107 | CLI tool output |
| `scripts/test-resend.mjs` | 34, 47–48, 71–72 | Test script; line 47 logs recipient email |

**Application `*.ts` / `*.tsx`:** **No `console.log`** — API routes use **`console.error`** only:

| File | Lines |
|------|-------|
| `app/api/rfq/route.ts` | 113, 142, 144, 156 |
| `app/api/contact/route.ts` | 66, 79, 81, 93 |

### TypeScript `any`

- **`as any` / `: any`:** **No matches** in `*.ts` / `*.tsx` (grep).

### Other repo markers (not code TODOs)

- `public/techsylph-qa-audit.mdc`, `QA_REPORT.md` reference TODO/checklist items — separate from inline code tags.

---

## 11. DEPENDENCIES

### `dependencies` (from `package.json`, production)

`@base-ui/react`, `@hookform/resolvers`, `@portabletext/react`, `@sanity/client`, `@sanity/image-url`, `@sanity/vision`, `class-variance-authority`, `clsx`, `framer-motion`, `lucide-react`, `next`, `next-intl`, `next-sanity`, `next-themes`, `react`, `react-dom`, `react-hook-form`, `resend`, `sanity`, `shadcn`, `sonner`, `tailwind-merge`, `tw-animate-css`, `zod`

### `devDependencies`

`@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom`, `csv-parse`, `eslint`, `eslint-config-next`, `prettier`, `tailwindcss`, `typescript`

### Audit flags (non-exhaustive)

| Flag | Detail |
|------|--------|
| **Unused or questionable** | **`next-themes`** — listed in `dependencies` but **no** `ThemeProvider` / usage in `*.tsx` (grep). Consider removal or implementation. |
| **CLI in runtime deps** | **`shadcn`** — typically a dev CLI; having it in `dependencies` may be intentional for CI or accidental; worth classifying. |
| **Security-sensitive** | **`resend`** (email), **`@sanity/client`** with **write token** on server, **`SANITY_API_TOKEN`** exposure risk if leaked. |
| **Version note** | **Next 16** + **React 19** are very current; auditors should confirm ecosystem compatibility (eslint-config-next pinned to 16.1.6 matches `next`). |
| **Zod 4** | `zod` `^4.3.6` — ensure team understands v4 vs v3 API (project already uses it in `lib/validations.ts`). |

Outdated / deprecated / CVE scan: **not run** in this pass — recommend `npm audit` and dependency policy separately.

---

## 12. BUILD & CONFIG

### Next.js (`next.config.ts`)

- **next-intl plugin** wired with `./i18n/request.ts`.
- **`images.remotePatterns`:** `https://cdn.sanity.io` only.
- **No** `redirects` / `rewrites` in config file.

### TypeScript (`tsconfig.json`)

- **`strict`: true**
- **Path alias:** `@/*` → `./*`
- **`jsx`:** `react-jsx`

### ESLint / Prettier

- **ESLint:** `eslint.config.mjs` — `eslint-config-next` (core-web-vitals + typescript); ignores `scripts/**`, `sanity.cli.js`, build output.
- **Prettier:** in `devDependencies` and `npm run format`; **no** `.prettierrc` / `prettier.config.*` found in glob (may rely on defaults).

### CI/CD

- **No** `.github/workflows` found in scan.
- **`vercel.json`:** sets `framework`, `buildCommand`, `installCommand` only.

### Sanity CLI

- `sanity.cli.js` loads `.env.local` manually for CLI commands (`projectId` / `dataset`).

### Internationalization

- **`proxy.ts`** matcher excludes `api`, `studio`, `_next`, static files — aligns with next-intl docs pattern (see file lines 6–8).

---

## 13. SECURITY FLAGS 🚨

Findings are **from static review** of this repository only.

| Severity | Finding | Location |
|----------|---------|----------|
| **High (if misconfigured)** | **Public write API to Sanity** via `writeClient` using `SANITY_API_TOKEN` in server routes — token must be **server-only**, minimal scope, and Sanity project must restrict CORS/allowed origins. | `sanity/lib/writeClient.ts`, `app/api/contact/route.ts`, `app/api/rfq/route.ts` |
| **Medium** | **RFQ file uploads not validated on server** — Zod file rules exist client-side (`lib/validations.ts`) but API uses `schemaWithoutAttachment`; any size/type may be accepted and forwarded to Resend. | `app/api/rfq/route.ts` (omit attachment from schema; lines 50–76) |
| **Medium** | **`JSON.parse(dataStr)`** on multipart `data` field — malformed JSON throws and becomes 500; potential **DoS / probing** vector without try/catch. | `app/api/rfq/route.ts` line 69 |
| **Low** | **No rate limiting / CAPTCHA** on `POST /api/contact` or `/api/rfq` — spam and abuse risk. | API routes |
| **Low** | **Public endpoints** return generic errors but still accept unauthenticated writes to CMS (as designed) — depends entirely on Sanity + infra hardening. | — |
| **Review** | **`INQUIRIES_QUERY`** exports full inquiry PII — **unused** now; future use without auth would leak data. | `sanity/lib/queries.ts` lines 39–42 |
| **Review** | **Sanity Studio** at `/studio` — confirm Sanity project security (who can log in, 2FA, dataset visibility). | `app/studio/[[...index]]/page.tsx` |
| **None found** | Hardcoded **live** API keys in source (only `process.env` + placeholders in `.env.example`) | grep for common secret patterns |

**`console.log` / sensitive data:** App TSX has no `console.log`; API `console.error` may log provider errors (could include details — review in production logging policy).

---

## 14. PERFORMANCE FLAGS ⚡

| Flag | Finding | Location |
|------|---------|----------|
| **Catalog scale** | All products loaded on server then **client-filtered** — fine for small catalogs; **no pagination / virtualization** if product count grows large. | `app/[locale]/catalog/page.tsx`, `components/catalog/CatalogClient.tsx` |
| **Home / related** | Featured products capped in GROQ (`[0...6]`); related products `[0...3]` — reasonable. | `sanity/lib/queries.ts`, `app/[locale]/catalog/[slug]/page.tsx` |
| **Images** | **next/image** used with Sanity CDN URLs; remote pattern configured. PDP main image uses `priority`. | `components/catalog/ProductDetailContent.tsx`, `next.config.ts` |
| **useEffect** | **Navbar** scroll listener — deps `[]`, cleanup present — OK. **ProductFilters** debounce effect depends on `onFilterChange` (may re-run if parent passes unstable callback — worth watching). | `components/layout/Navbar.tsx` 46–51; `components/catalog/ProductFilters.tsx` 45–53 |
| **RFQForm useEffect** | Syncs search params to form — deps `[searchParams, setValue]`; `setValue` is stable from RHF — generally OK. | `components/forms/RFQForm.tsx` 67–72 |
| **Animations** | Framer Motion `whileInView` on catalog grid — can add work for long lists; acceptable at current scale. | `components/catalog/CatalogClient.tsx` |
| **Caching** | Home `revalidate = 60`; catalog page **no** explicit `revalidate` (follows default). | `app/[locale]/page.tsx` line 19 |
| **Synchronous blocking** | No obvious heavy sync work on main thread beyond standard React; **not profiled**. | — |

---

## SUMMARY FOR AUDITOR

TechSylph is a **Next.js 16** App Router site aimed at **B2B apparel export lead generation**: a **Sanity-backed catalog** and marketing pages in **three locales**, with **no customer accounts, cart, checkout, or payments**. The only mutations from the public web app are **`POST /api/contact`** and **`POST /api/rfq`**, which **create `inquiry` documents** in Sanity and **notify admins by email** through **Resend**. Content editors use the embedded **Sanity Studio** at `/studio`. Architecture is straightforward: **Server Components** fetch via **`next-sanity`** read client; **Route Handlers** use a **write token** for creates.

The **highest-risk areas** for a production audit are: **Sanity token handling and project ACLs** (server-only `SANITY_API_TOKEN`, dataset visibility, CORS), **abuse resistance** of the two public POST endpoints (spam, large uploads, JSON bombs on multipart RFQ), and **attachment handling** on the RFQ route (server-side type/size limits missing). Also confirm **`proxy.ts`** is the intended Next 16 replacement for `middleware.ts` and that locale routing behaves as expected on Vercel.

**Unused or sharp edges** to verify: the exported **`INQUIRIES_QUERY`** (PII), the **`next-themes`** dependency with no usage, and **partial success** semantics (API returns success if **either** Sanity **or** email succeeds — silent partial failure). **SEO:** metadata references **`/og-image.jpg`** while a **TODO** notes the asset may still be missing — confirm `public/` and social previews.

**Not applicable** to this repo: relational schema migrations, payment PCI scope, and traditional ecommerce order pipelines — unless the business expects them soon, in which case this overview documents the **current gap** explicitly.
