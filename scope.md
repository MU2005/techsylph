# TechSylph — Full Project Scope & Planning Document
**Domain:** techsylph.shop  
**Project Type:** B2B Global Apparel Export Website  
**Stack:** Next.js 14 (App Router) + Sanity CMS + Vercel  
**Document Version:** 1.0  

---

## 1. Project Overview

TechSylph is a Pakistan-based global apparel export brand targeting international B2B buyers — retailers, boutiques, wholesale distributors, and fashion brands seeking manufacturing or private label partnerships. The website's primary goal is to establish credibility, showcase the product catalog, and convert visitors into qualified leads via inquiry forms.

**No prices are shown on the website.** All buyers must submit an inquiry or RFQ to receive pricing — this is intentional to allow custom quotes per buyer.

---

## 2. Brand Identity

| Attribute | Details |
|---|---|
| Brand Name | TechSylph |
| Domain | techsylph.shop |
| Manufacturing Base | Pakistan (Sialkot region) |
| Visual Style | Vibrant & modern — bold colors, gradients, strong typography |
| Design Tone | Premium B2B export brand — not a marketplace, not a basic catalog |
| Logo | Ready (provided by client) |
| Photography | Stock/placeholder for initial build |

### Color Direction
- Bold, vibrant primary palette (gradient-forward)
- High contrast typography
- Clean whitespace balanced with strong visual moments
- Professional enough for international B2B buyers

---

## 3. Target Audience

- International retailers & boutiques (US, EU, Middle East, etc.)
- Wholesale buyers & distributors
- End consumers (secondary — future phase)
- Fashion brands sourcing private label or custom manufacturing

---

## 4. Product Categories (Phase 1)

1. T-shirts & Basics
2. Hoodies & Sweatshirts
3. Activewear / Sportswear
4. Custom / Private Label

> Future categories may be added via the CMS without code changes.

---

## 5. Full Page Structure & Sitemap

```
/                          → Home (Landing Page)
/about                     → About Us
/catalog                   → Product Catalog (browsable)
/catalog/[slug]            → Single Product Page
/custom-label              → Custom / Private Label Service Page
/how-it-works              → Ordering Process Page
/why-us                    → Why Choose TechSylph
/contact                   → Contact & Inquiry Form
/rfq                       → Request for Quote Form (dedicated)
/blog                      → Blog Index
/blog/[slug]               → Single Blog Post
/faq                       → FAQ Page
/lookbook                  → Lookbook (PDF download)
```

### Admin / CMS Routes (Sanity Studio)
```
/studio                    → Sanity CMS dashboard (password protected)
```

---

## 6. Page-by-Page Breakdown

### 6.1 Home Page `/`
**Goal:** Immediate credibility + guide B2B visitors toward the catalog or inquiry.

Sections:
- **Hero:** Full-width bold headline + gradient background + CTA buttons ("Browse Catalog" & "Request a Quote")
- **Stats Bar:** Key numbers — e.g., Years in Business, Products, Countries Shipped, MOQ info
- **Featured Categories:** 4 product category cards with hover effects
- **Why TechSylph (mini):** 3–4 icon-based trust points (Quality, MOQ, Custom Label, Fast Turnaround)
- **Featured Products:** 6–8 product cards (no price shown — "Inquire" CTA)
- **How It Works (mini):** 3-step visual (Browse → Inquire → Order)
- **Testimonials / Social Proof:** 2–3 client cards or logo strip
- **CTA Banner:** Bold gradient section — "Ready to Source? Get a Quote Today"
- **Footer**

---

### 6.2 About Us `/about`
**Goal:** Build trust with international buyers — humanize the brand and highlight Pakistan manufacturing.

Sections:
- Brand story (founding, mission, vision)
- Pakistan textile industry credibility paragraph
- Manufacturing capabilities
- Quality assurance process
- Team / Founder section
- Certifications (placeholder — add real ones when available)
- CTA: "Get in Touch"

---

### 6.3 Product Catalog `/catalog`
**Goal:** Browsable, filterable product showcase — no prices shown.

Features:
- Filter by: Category, Fabric Type, Gender, Minimum Order Quantity
- Search bar (by product name/keyword)
- Grid layout — product cards (image, name, category, MOQ indicator, "Inquire" button)
- Pagination or infinite scroll
- Each product links to its own detail page

---

### 6.4 Single Product Page `/catalog/[slug]`
Sections:
- Product image gallery (multiple angles)
- Product name, category, description
- Available colors/sizes (visual swatches — no price)
- Fabric & material details
- MOQ (Minimum Order Quantity)
- Customization options (if applicable)
- "Add to Inquiry Cart" button (see Feature 6.9)
- Related products

---

### 6.5 Custom / Private Label `/custom-label`
**Goal:** Attract buyers who want their own branded garments manufactured.

Sections:
- Service overview & value proposition
- What TechSylph offers (OEM, ODM, full private label)
- Step-by-step custom order process
- Fabric options & printing/embroidery capabilities
- MOQ for custom orders
- CTA: "Start Your Custom Order" → links to RFQ form

---

### 6.6 How It Works `/how-it-works`
Visual step-by-step page for new buyers:
1. Browse the catalog
2. Submit an inquiry or RFQ
3. Receive a custom quote within 48 hours
4. Approve sample / confirm order
5. Production begins
6. Shipment & delivery

---

### 6.7 Why Choose Us `/why-us`
Trust-building page with:
- Low MOQ vs competitors
- Pakistan manufacturing advantage (cost, quality, heritage)
- Quality control process
- Custom branding & label services
- Fast turnaround times
- Global shipping capabilities
- Certifications (OEKO-TEX, ISO, etc. — placeholder)
- Infographic-style layout

---

### 6.8 Contact Page `/contact`
- Contact form (Name, Company, Country, Email, Phone, Message)
- WhatsApp Business button (click-to-chat)
- Email address
- LinkedIn link
- Instagram link
- Map or location visual (optional)
- Response time expectation ("We reply within 24–48 hours")

---

### 6.9 RFQ Page `/rfq`
Dedicated Request for Quote form — more detailed than contact:
- Fields: Name, Company Name, Country, Email, Phone
- Product interest (dropdown or multi-select from categories)
- Estimated quantity / order size
- Customization needed? (Yes/No)
- Additional notes / specifications
- File upload (for design files, reference images)
- Submit → email notification to admin

---

### 6.10 Blog `/blog` & `/blog/[slug]`
- Blog index with category filters (Industry News, Guides, Manufacturing, etc.)
- Individual blog posts managed via Sanity CMS
- SEO optimized (meta title, description per post)
- Social share buttons
- Related posts

---

### 6.11 FAQ `/faq`
Accordion-style FAQ covering:
- What is the MOQ?
- Do you offer private label?
- What countries do you ship to?
- How long does production take?
- Can I get samples before bulk order?
- What payment methods do you accept?
- How do I get pricing?

---

### 6.12 Lookbook `/lookbook`
- Visual lookbook page with preview images
- Single CTA to download the full catalog as PDF
- Optional: gate the download behind an email capture form (lead gen)

---

## 7. Key Features

### 7.1 Inquiry Cart
A lightweight "cart" that lets buyers select multiple products and submit one combined RFQ. No checkout — just a list of interested products that gets sent to the admin.

### 7.2 RFQ / Contact Form
- Email notification on submission (via Resend or Nodemailer)
- Data saved in Sanity or a simple database
- Admin can view all inquiries in dashboard

### 7.3 WhatsApp Business Button
- Floating button (bottom-right corner, all pages)
- Pre-filled message: "Hi TechSylph, I'm interested in placing a wholesale order..."
- Click-to-chat link with WhatsApp Business number

### 7.4 Product Filter & Search
- Client-side filtering for fast UX
- Filters: Category, Fabric, MOQ range
- Debounced search input

### 7.5 Lookbook PDF Download
- PDF catalog download (hosted on Sanity or Vercel)
- Optional: email gate before download

### 7.6 Multi-Language Support (i18n)
- Phase 1: English (default), French, German
- Use next-intl library
- Language switcher in navbar
- All static content translated via JSON locale files
- CMS content: translate key fields in Sanity

### 7.7 Currency Display Switcher
- Display prices in USD, EUR, GBP (no actual transactions)
- Since no prices are shown on products, this applies to any future pricing info, shipping estimates, or MOQ value indicators
- Simple dropdown in header

### 7.8 SEO
- Next.js Metadata API (App Router)
- Per-page title, description, Open Graph tags
- Sitemap.xml auto-generated
- robots.txt
- Structured data (JSON-LD) for products and organization
- Sanity fields for SEO per product and blog post

### 7.9 Admin Dashboard (Sanity Studio)
Managed content:
- Products (add/edit/delete, images, details, category, MOQ, slug)
- Blog posts
- FAQ items
- Testimonials
- Lookbook PDF
- SEO fields per page
- Inquiries viewer (read-only list of form submissions)

---

## 8. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SEO, performance, modern React |
| Language | TypeScript | Type safety, better Cursor DX |
| Styling | Tailwind CSS | Rapid, consistent styling |
| CMS | Sanity v3 | Best Next.js pairing, generous free tier, great image CDN |
| i18n | next-intl | Best i18n solution for Next.js App Router |
| Forms / Email | React Hook Form + Resend | Clean forms, reliable email delivery |
| Animations | Framer Motion | Smooth, professional micro-interactions |
| Icons | Lucide React | Clean, consistent icon set |
| Deployment | Vercel | Native Next.js hosting, free tier |
| Image CDN | Sanity CDN + Next/Image | Optimized image delivery |
| Analytics | Vercel Analytics (free) | Traffic insights |

---

## 9. Folder Structure

```
techsylph/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                  # Home
│   │   ├── about/page.tsx
│   │   ├── catalog/
│   │   │   ├── page.tsx              # Catalog index
│   │   │   └── [slug]/page.tsx       # Single product
│   │   ├── custom-label/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── why-us/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── rfq/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── faq/page.tsx
│   │   └── lookbook/page.tsx
│   ├── api/
│   │   ├── contact/route.ts          # Contact form handler
│   │   └── rfq/route.ts              # RFQ form handler
│   └── studio/[[...index]]/page.tsx  # Sanity Studio
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppButton.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── FeaturedCategories.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── HowItWorksMini.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTABanner.tsx
│   ├── catalog/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   └── InquiryCart.tsx
│   ├── shared/
│   │   ├── SectionHeading.tsx
│   │   ├── CTAButton.tsx
│   │   └── LanguageSwitcher.tsx
│   └── forms/
│       ├── ContactForm.tsx
│       └── RFQForm.tsx
├── sanity/
│   ├── schemas/
│   │   ├── product.ts
│   │   ├── blogPost.ts
│   │   ├── testimonial.ts
│   │   └── faqItem.ts
│   ├── lib/
│   │   └── client.ts
│   └── sanity.config.ts
├── messages/
│   ├── en.json
│   ├── fr.json
│   └── de.json
├── public/
│   ├── logo.svg
│   └── lookbook.pdf
├── middleware.ts                      # i18n routing
├── next.config.ts
└── tailwind.config.ts
```

---

## 10. Design System

### Typography
- **Display / Hero:** Bold, large, impactful (e.g., Syne or Clash Display)
- **Body:** Clean readable sans-serif (e.g., Inter)
- **Accent / Labels:** Medium weight, slightly spaced

### Color Palette (Suggested — to be finalized with logo)
| Name | Usage |
|---|---|
| Primary | Vibrant brand color (from logo) |
| Secondary | Gradient partner color |
| Dark | #0D0D0D — headings, body text |
| Light | #F8F8F8 — backgrounds |
| Accent | Bold highlight for CTAs |
| Muted | #6B7280 — secondary text |

### Gradient System
- Hero gradient: Primary → Secondary (diagonal)
- CTA banner gradient: dark to vibrant
- Card hover gradients: subtle overlay

### Components
- Cards with subtle shadow + hover lift
- Gradient CTA buttons (primary action)
- Outlined ghost buttons (secondary action)
- Badge chips for categories and MOQ labels
- Sticky navbar with blur backdrop

---

## 11. SEO Strategy

- Target keywords: "Pakistan apparel manufacturer", "wholesale clothing export", "private label clothing Pakistan", "bulk t-shirt supplier", "custom hoodie manufacturer"
- Each page has unique title + meta description managed via Sanity
- Blog content targets long-tail B2B search terms
- Sitemap auto-generated via Next.js
- Open Graph images for social sharing
- Schema markup for Organization + Product types

---

## 12. Phases & Milestones

### Phase 1 — Core Website (MVP)
- [ ] Project setup (Next.js + Sanity + Tailwind + next-intl)
- [ ] Design system & component library
- [ ] Navbar + Footer + WhatsApp button
- [ ] Home page (all sections)
- [ ] Product Catalog + Single Product page
- [ ] Contact page + RFQ page
- [ ] Sanity schemas (Product, Blog, FAQ, Testimonials)
- [ ] Admin studio setup
- [ ] Basic i18n (EN + FR + DE JSON files)
- [ ] Vercel deployment

### Phase 2 — Content & SEO
- [ ] About, Why Us, How It Works, Custom Label pages
- [ ] Blog system (full)
- [ ] FAQ page
- [ ] Lookbook page + PDF download
- [ ] SEO metadata per page
- [ ] Sitemap + robots.txt

### Phase 3 — Advanced Features
- [ ] Inquiry Cart (multi-product RFQ)
- [ ] Email notifications (Resend integration)
- [ ] Currency display switcher
- [ ] Framer Motion animations
- [ ] Analytics setup

### Phase 4 — Future
- [ ] Add new product categories via CMS
- [ ] Additional languages (Arabic, Spanish, Chinese)
- [ ] B2C ecommerce layer (optional)
- [ ] Customer portal / order tracking

---

## 13. Environment Variables Needed

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Email (Resend)
RESEND_API_KEY=

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+92XXXXXXXXXX

# Admin contact email
ADMIN_EMAIL=techsylph.co@gmail.com
```

---

## 14. Cursor Prompting Notes

When building with Cursor AI, use these prompts in order:

1. **Setup prompt** — Initialize project, install all dependencies
2. **Design system prompt** — Tailwind config, fonts, color tokens
3. **Layout prompt** — Navbar, Footer, WhatsApp button
4. **Home page prompt** — Section by section
5. **Sanity schemas prompt** — All content schemas
6. **Catalog prompt** — Product grid, filters, product page
7. **Forms prompt** — Contact form, RFQ form, API routes
8. **i18n prompt** — next-intl setup, locale files
9. **Remaining pages prompt** — About, Why Us, How It Works, etc.
10. **SEO prompt** — Metadata, sitemap, structured data
11. **CMS prompt** — Sanity Studio configuration
12. **Deployment prompt** — Vercel config, environment variables

---

*Document prepared for TechSylph — techsylph.shop*  
*Next step: Begin writing detailed Cursor prompts for each phase.*
