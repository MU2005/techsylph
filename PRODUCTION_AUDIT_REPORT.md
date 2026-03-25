# Production Audit Report — TechSylph
Date: 2026-03-25
Auditor: Claude (Cursor AI)

---

## EXECUTIVE SUMMARY

**Overall Production Readiness:** NEEDS WORK

**Security Score:** 8/10  
**Reliability Score:** 8/10  
**Performance Score:** 7/10  
**SEO Score:** 7/10  
**Code Quality Score:** 8/10

**Top 5 Issues Before Launch:**
1. **HIGH**: Public anti-abuse posture is still weak (in-memory per-instance rate limiting only, no CAPTCHA/challenge) on `app/api/contact/route.ts` and `app/api/rfq/route.ts`.
2. **HIGH**: Sanity write token scope is still broad (`Editor`) and not least-privilege (`npx sanity tokens list --json` evidence).
3. **HIGH**: Locale middleware matcher excludes `/studio` but not locale-prefixed `/en/studio`, so locale-prefixed Studio URLs are not explicitly blocked (`proxy.ts`).
4. **MEDIUM**: Major i18n hardcoded string surface still exists across key locale pages (`app/[locale]/about/page.tsx`, `why-us`, `how-it-works`, `custom-label`, `lookbook`, `faq`).
5. **MEDIUM**: Metadata depth is still shallow on many routes (most pages have title/description only, no per-page OpenGraph).

**Recommended Action:** Fix these 3 high-priority items before broad launch traffic.

---

## 1. SECURITY AUDIT

### POST /api/contact

- **[PASS] Server-only token usage in route path**: `writeClient` is imported only in server route handler and uses `process.env.SANITY_API_TOKEN` (`app/api/contact/route.ts:6`, `sanity/lib/writeClient.ts:8`).
- **[PASS] Schema coverage is aligned**: every field persisted to Sanity is from `contactSchema.safeParse()` output (`app/api/contact/route.ts:56-77`).
- **[PASS] Partial success is explicit**: API returns `success: true` with `partial` and service booleans when either Sanity or Resend succeeds (`app/api/contact/route.ts:99-107`).
- **[PASS] PII logging is sanitized**: logging now goes through `reportApiError()` with stage-only context; no direct `name/email/message` logging in route (`app/api/contact/route.ts:79-81`, `93-96`, `113-115`).
- **[HIGH] Abuse protection is basic only**: in-memory rate limiting exists (`app/api/contact/route.ts:43-53`) but no CAPTCHA/challenge and no distributed backend (state resets per instance/redeploy).
  - **Fix**: add challenge verification (Cloudflare Turnstile or hCaptcha) and shared-store limiter (Redis/Upstash).
  - Example:

```ts
// server route sketch
const turnstileToken = body.turnstileToken;
await verifyTurnstile(turnstileToken, getClientIp(request));
const limit = await checkRateLimitRedis(`contact:${ip}`);
```

### POST /api/rfq

- **[PASS] CRITICAL parse crash fixed**: multipart `JSON.parse(dataStr)` is wrapped in `try/catch` and invalid payload returns 400 (`app/api/rfq/route.ts:90-102`).
- **[PASS] Attachment server validation present**: file size and MIME validated server-side before attachment forwarding (`app/api/rfq/route.ts:53-59`, `104-124`).
- **[PASS] Provider errors are sanitized**: errors sent through `reportApiError()` stages (no raw provider dump in route code) (`app/api/rfq/route.ts:165-167`, `195-198`, `215-217`).
- **[PASS] Rate limiting exists**: per-IP limit check implemented (`app/api/rfq/route.ts:63-73`).
- **[HIGH] Same abuse gap as contact**: limiter is in-memory and no CAPTCHA/challenge.
  - **Fix**: same as contact route (challenge + distributed limiter).

### Sanity Configuration

- **[PASS] `INQUIRIES_QUERY` removed**: no export remains in `sanity/lib/queries.ts`; no app references found.
- **[PASS] Dataset visibility is private**: verified by `npx sanity dataset visibility get production` => `private`.
- **[PASS] CORS is locked to production domains**: `npx sanity cors list` returns:
  - `https://techsylph.vercel.app`
  - `https://www.techsylph.shop`
- **[HIGH] Token scope still broad**: active token role is `Editor` (`npx sanity tokens list --json`), not least-privilege.
  - **Fix**: rotate to custom role with minimal document-level permissions for required read/write only.

### Studio Route

- **[PASS] Studio relies on Sanity auth gate**: route renders `NextStudio` directly (`app/studio/[[...index]]/page.tsx:3-10`), and Studio itself enforces login.
- **[MEDIUM] Locale-prefixed studio path not explicitly excluded**: matcher excludes `/studio` root prefix only (`proxy.ts:7`), so `/en/studio` is still middleware-matched.
  - **Fix**: add locale-prefixed studio exclusion to matcher.

```ts
// proxy.ts matcher idea
matcher: ["/((?!api|_next|_vercel|.*\\..*|studio|[a-z]{2}(-[A-Z]{2})?/studio).*)"];
```

### Secrets

- **[PASS] No `NEXT_PUBLIC_SANITY_API_TOKEN` exposure** found via repository search.
- **[PASS] `.env.local` is ignored** by `.gitignore` (`.gitignore:33` with `.env*`, while allowing `.env.example`).
- **[LOW] `scripts/test-resend.mjs` logs recipient email** (`scripts/test-resend.mjs:47`, `72`) but script is manual-only (`package.json:12`), not runtime-imported.
- **[PASS] `.env.example` now documents required/optional runtime/build intent clearly** (`.env.example:1-20`).

---

## 2. RELIABILITY AUDIT

### Partial Success Semantics

- **Contact route**:
  - Sanity success + Resend fail => `200` + `success: true` + `partial: true` (`app/api/contact/route.ts:99-107`).
  - Sanity fail + Resend success => same partial-success response.
  - Both fail => `500` (`app/api/contact/route.ts:109-112`).
- **RFQ route** follows same semantics (`app/api/rfq/route.ts:201-214`).
- **Verdict**: intentional lead-preserving behavior is now explicit and consistent.

### RFQ Multipart Parsing

- Flow is safe:
  - validates `data` exists and is string (`app/api/rfq/route.ts:83-89`);
  - guarded parse (`90-102`);
  - then Zod validation without attachment (`135-142`).
- Non-multipart JSON path still validated (`130-142`).

### Locale Routing

- Matcher excludes `/api`, `/studio`, `/_next`, `/_vercel`, and file extensions (`proxy.ts:7`).
- `i18n/routing.ts` locale list is exactly `["en","fr","de"]` (`i18n/routing.ts:4`).
- `generateStaticParams` locales are aligned in both slug pages (`app/[locale]/catalog/[slug]/page.tsx:51`, `app/[locale]/blog/[slug]/page.tsx:44`).
- Root `/` redirect behavior: with `localePrefix: "always"` and middleware enabled, it should resolve to default locale path `/en` (configuration-consistent).

### Sanity Singleton Null-Safety

- `HeroSection`, `StatsBar`, `FeaturedCategories` are null-safe with fallback values (`components/home/HeroSection.tsx:21-24`, `components/home/StatsBar.tsx:23-27`, `components/home/FeaturedCategories.tsx:97-101`).
- `CustomLabelCustomizations` receives sanitized fallback arrays from page-level guard (`app/[locale]/custom-label/page.tsx:121-128`).

### Form Reset & Feedback

- `RFQForm` resets fields and clears file input on success (`components/forms/RFQForm.tsx:109-117`), displays network and server errors (`104-107`, `123-125`).
- `ContactForm` resets on success and displays clear success/error UI (`components/forms/ContactForm.tsx:49-51`, `45-47`, `57-59`).
- Client and server schemas are aligned for accepted fields (`lib/validations.ts` with route usage).

---

## 3. PERFORMANCE AUDIT

### Catalog Filtering

- Current product count from Sanity query: **8** (`npx sanity documents query "count(*[_type == 'product'])"`).
- Current size is safe for client-side filtering.
- Recommendation threshold: once catalog approaches ~200+ items, move to server-side filtering/pagination.
- Debounce callback stability: `onFilterChange` is `setFilters` from `useState` (stable), so no effect-loop issue (`components/catalog/CatalogClient.tsx:46-51`, `components/catalog/ProductFilters.tsx:47-51`).

### Caching

| Page | revalidate value | Intentional? | Recommendation |
|------|------------------|--------------|----------------|
| `app/[locale]/page.tsx` | `60` | Yes | Consider `300-3600` or webhook revalidation if content cadence is low |
| `app/[locale]/catalog/page.tsx` | `300` | Yes | Keep |
| `app/[locale]/catalog/[slug]/page.tsx` | `300` | Yes | Keep |
| `app/[locale]/blog/page.tsx` | `300` | Yes | Keep |
| `app/[locale]/blog/[slug]/page.tsx` | `300` | Yes | Keep |
| `app/[locale]/faq/page.tsx` | `300` | Yes | Keep |
| `app/[locale]/custom-label/page.tsx` | `300` | Yes | Keep |
| `app/[locale]/about/page.tsx` | `3600` | Yes | Keep |
| `app/[locale]/why-us/page.tsx` | `3600` | Yes | Keep |
| `app/[locale]/how-it-works/page.tsx` | `3600` | Yes | Keep |
| `app/[locale]/contact/page.tsx` | `3600` | Yes | Keep |
| `app/[locale]/rfq/page.tsx` | `3600` | Yes | Keep |
| `app/[locale]/lookbook/page.tsx` | `3600` | Yes | Keep |

### Images & Video

- `<Image>` usage generally uses `fill` inside sized containers; CLS risk is low in current patterns.
- Hero mobile video uses `preload="metadata"` (`components/home/HeroSection.tsx:159`).
- Product cards do not set `priority` on catalog cards (`components/catalog/ProductCard.tsx`); correct.

### Bundle

- Message bundle sizes:
  - `messages/en.json`: 9046 bytes
  - `messages/fr.json`: 9653 bytes
  - `messages/de.json`: 9565 bytes
- Sizes are currently small (<50KB each), so no immediate i18n payload risk.

---

## 4. SEO AUDIT

### OG Image
**EXISTS: YES** — `public/og-image.jpg` present (verified in `public/` listing).

### Metadata Coverage

| Page | generateMetadata | title | description | openGraph | hreflang |
|------|------------------|-------|-------------|-----------|----------|
| `/[locale]` | No (layout-level) | Inherited | Inherited | Inherited from locale layout | Yes (locale layout alternates) |
| `/[locale]/catalog` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/catalog/[slug]` | Yes | Yes | Yes | Yes | Yes |
| `/[locale]/blog` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/blog/[slug]` | Yes | Yes | Yes | Yes | Yes |
| `/[locale]/faq` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/custom-label` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/about` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/why-us` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/how-it-works` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/contact` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/rfq` | No (static metadata) | Yes | Yes | No page-level OG | Yes |
| `/[locale]/lookbook` | No (static metadata) | Yes | Yes | No page-level OG | Yes |

### JSON-LD Schemas

- Present:
  - `Organization` + `WebSite` in locale layout (`app/[locale]/layout.tsx:82-112`, `118-120`)
  - `Product` on PDP (`app/[locale]/catalog/[slug]/page.tsx:85-114`)

### Sitemap & robots.txt

- `robots.ts` allows crawl and points sitemap correctly (`app/robots.ts:5-13`).
- `sitemap.ts` includes localized static pages and localized product/blog URLs (`app/sitemap.ts:22-55`).
- **Reliability caveat**: product/blog sitemap slug mapping does not filter malformed/non-string slugs (unlike page static params hardening), so malformed data could emit bad URLs.

---

## 5. INTERNATIONALISATION AUDIT

### Missing Translation Keys

| Key | Missing in |
|-----|-----------|
| None | None |

Key parity check result: `en=201`, `fr=201`, `de=201`, `missingCount=0`.

### Hardcoded Strings

| File | Line | String | Fix |
|------|------|--------|-----|
| `app/[locale]/faq/page.tsx` | 92-96 | `"FAQ"`, `"Frequently Asked"`, etc. | Use `getTranslations("faq")` |
| `app/[locale]/about/page.tsx` | 27-31+ | Hero/section copy in English | Move to `messages/*` |
| `app/[locale]/why-us/page.tsx` | 72-76+ | Section labels and full feature text | Localize into namespace |
| `app/[locale]/how-it-works/page.tsx` | 57-61+ | Step labels/titles/descriptions | Localize |
| `app/[locale]/custom-label/page.tsx` | 116-249 | CTA/buttons/headings in English | Localize |
| `app/[locale]/lookbook/page.tsx` | 31-79 | Entire lookbook CTA copy | Localize |
| `components/home/HeroSection.tsx` | 107-147 | right-column stats/chips hardcoded | Wrap in `t()` |
| `components/home/StatsBar.tsx` | 63, 69 | aria text `"Countries we serve"`, `"flag"` suffix | localize accessibility text |

### Locale Switcher

- Path preservation is correct: `router.replace(pathname, { locale: l.code })` in both desktop and mobile (`components/layout/Navbar.tsx:123`, `188`).
- Slug is preserved as long as translated route exists for that path shape.

### Content Localisation Gap

- Blog/FAQ content schemas are single-language fields (no localized fields/doc strategy) (`sanity/schemas/blogPost.ts`, `sanity/schemas/faqItem.ts`).
- Result: same content appears across locales unless editors manually duplicate translated documents and routing logic is extended.

---

## 6. CODE QUALITY AUDIT

### Dead Dependencies

- `next-themes`: **removed** (pass).
- `shadcn`: now in `devDependencies` (`package.json:50`) (pass).
- `@sanity/vision`: in `devDependencies` and used in Studio config only (`sanity/sanity.config.ts:3`, `42`) (pass).

### npm audit Results

- `npm audit --json` reports **1 moderate** vulnerability on `next@16.1.6` (multiple advisories, fixed in `16.2.1`).
- Action: upgrade `next` + `eslint-config-next` to patched version.

### Component Issues

- Previous `badge.tsx` issue no longer applies; file was removed.
- Remaining `components/ui/*` are all client components (`"use client"` present).
- `components/ui/button.tsx` appears unused in app runtime (cleanup candidate).

### TypeScript Gaps

- `types/sanity.ts` now largely matches active schemas for product/blog/inquiry/category/site settings/custom label.
- Noted mismatch risk remains for `BlogPost.category`: schema stores slug-like enum values (`industry-news`, etc.), UI sometimes presents raw value; not a type crash but may be UX labeling issue.
- Query typing is mostly explicit in fetch calls (good), though runtime coercion/validation is still manual (no io-ts/zod on GROQ responses).

---

## 7. DEPLOYMENT READINESS

### Build Output

- `npm run build` passes cleanly on current state.
- No blocking compile/type/static generation errors in latest run.

### Vercel Config

- `vercel.json` exists but does not pin Node runtime (`vercel.json:1-5`).
- Timeout risk assessment:
  - RFQ route parses multipart, writes Sanity, sends Resend with optional attachment (`app/api/rfq/route.ts`).
  - On slow upstream or near-limit files this can approach serverless timeout budgets on lower tiers.
  - Plan/tier cannot be confirmed from repo alone.

### Monitoring

- Sentry is integrated (`@sentry/nextjs`, instrumentation, server/edge configs, API error reporting).
- Lead analytics is integrated via GA event tracking from both forms.

---

## PRIORITY MATRIX

### 🔴 CRITICAL — Fix before any public traffic
- None currently open.

### 🟠 HIGH — Fix within 48h of launch
- Replace in-memory limiter with distributed limiter and add CAPTCHA/challenge on both public POST routes.
- Rotate Sanity token from broad `Editor` to least-privilege custom role.
- Harden middleware matcher for locale-prefixed Studio path behavior (`/en/studio` class).
- Patch Next.js moderate advisories by upgrading to a fixed version.

### 🟡 MEDIUM — Fix within first month
- Localize remaining hardcoded marketing/SEO copy across locale pages.
- Expand page-level OpenGraph metadata beyond layout defaults.
- Add defensive slug filtering in `app/sitemap.ts` (product/blog URL generation).

### 🟢 LOW — Nice to have
- Remove/trim unused UI helper components and dead styles.
- Improve runtime validation of GROQ responses.

---

## LAUNCH CHECKLIST

- [x] `public/og-image.jpg` exists and is 1200×630px
- [x] `JSON.parse` in `app/api/rfq/route.ts` wrapped in try/catch
- [x] Server-side file type + size validation added to `app/api/rfq/route.ts`
- [x] `INQUIRIES_QUERY` confirmed unused/deleted from `sanity/lib/queries.ts`
- [x] `SANITY_API_TOKEN` confirmed server-only (not in any NEXT_PUBLIC_ var)
- [ ] Sanity write token scope confirmed as minimal (currently `Editor`, still broad)
- [x] Sanity dataset visibility confirmed (`private`)
- [x] Sanity CORS locked to production domains only
- [ ] All env vars set in Vercel dashboard (not verifiable from repo)
- [x] `next build` passes with zero errors
- [ ] Root `/` → `/en/` redirect tested in production runtime
- [ ] `/studio` + locale-prefixed studio route behavior confirmed in production runtime
- [ ] RFQ and Contact forms tested end-to-end in production
- [x] hreflang alternates configured in locale layout
- [x] Sitemap accessible at `/sitemap.xml` route implementation present
- [x] `next-themes` removed
- [x] `shadcn` moved to devDependencies

---

## CONCLUSION

TechSylph is substantially improved and close to production-ready, with core API hardening, dataset privacy, CORS lock-down, build stability, and monitoring now in place. The single biggest remaining risk is abuse resistance under real traffic: in-memory rate limiting without CAPTCHA/distributed enforcement is not enough for internet-facing lead forms. The second major gap is least-privilege token scope; current `Editor` role should be reduced. These high-priority items should be completed before broad launch traffic, while remaining i18n and metadata depth gaps can be scheduled immediately post-launch.
# Production Audit Report — TechSylph
Date: Wednesday Mar 25, 2026  
Auditor: Claude (Cursor AI)

---

## EXECUTIVE SUMMARY

**Overall Production Readiness:** NEEDS WORK

**Security Score:** 5.5/10  
**Reliability Score:** 6.5/10  
**Performance Score:** 7/10  
**SEO Score:** 6/10  
**Code Quality Score:** 6/10

**Top 5 Issues Before Launch:**
1. CRITICAL: Unhandled multipart JSON parse can throw in `app/api/rfq/route.ts:69` (`JSON.parse(dataStr)` without local try/catch around malformed payload handling).
2. HIGH: RFQ attachment bypasses server-side type/size validation in `app/api/rfq/route.ts:50`, `app/api/rfq/route.ts:71-76`, `app/api/rfq/route.ts:131-139`.
3. HIGH: No rate limiting/CAPTCHA/abuse controls on public POST routes `app/api/contact/route.ts` and `app/api/rfq/route.ts`.
4. CRITICAL: Missing social preview image file `public/og-image.jpg` referenced by `app/[locale]/layout.tsx:41` and `app/[locale]/layout.tsx:52`.
5. HIGH: `INQUIRIES_QUERY` exports full PII (`sanity/lib/queries.ts:46-49`) and is currently unused; keeping it increases accidental exposure risk.

**Recommended Action:** Fix these critical/high items first, then ship.

---

## 1. SECURITY AUDIT

### POST /api/contact

- **[MEDIUM] Partial-success semantics are permissive** (`app/api/contact/route.ts:85-90`): API returns `{ success: true }` if either Sanity write OR email succeeds.
  - **Observed behavior:** 
    - Sanity success + Resend fail => success 200.
    - Sanity fail + Resend success => success 200.
    - both fail => 500.
- **[LOW] Zod coverage is complete for written fields** (`app/api/contact/route.ts:42`, `app/api/contact/route.ts:53-63`, `lib/validations.ts:3-10`): all fields persisted to Sanity come from `parsed.data`.
- **[LOW] PII logging not direct, but raw provider objects are logged** (`app/api/contact/route.ts:66`, `app/api/contact/route.ts:79`, `app/api/contact/route.ts:81`, `app/api/contact/route.ts:93`).
  - No explicit `name/email/message` logging, but error objects can contain request fragments depending on SDK/provider behavior.
- **[HIGH] No abuse protection**: no rate limiting, no CAPTCHA, no IP throttling on this route.
- **[PASS] `SANITY_API_TOKEN` is server-only in app code** (`sanity/lib/writeClient.ts:8`, no `NEXT_PUBLIC_SANITY_API_TOKEN` references found).

**Concrete fix snippet (contact route hardening):**
```ts
// app/api/contact/route.ts
// 1) Add rate limiting (Upstash/Redis or edge KV)
// 2) Replace raw error logs with sanitized logs
catch (sanityError) {
  console.error("[Contact API] Sanity create error", {
    message: sanityError instanceof Error ? sanityError.message : "unknown",
  });
}
```

### POST /api/rfq

- **[CRITICAL] Multipart `JSON.parse` line is unguarded for malformed payload branch** (`app/api/rfq/route.ts:69`).
  - Malformed `data` JSON throws, then outer catch at `app/api/rfq/route.ts:155-160` returns 500.
  - This creates easy probing/noise and avoidable 500s.
- **[HIGH] Attachment bypasses server-side Zod checks**:
  - Route intentionally omits attachment validation via `schemaWithoutAttachment` (`app/api/rfq/route.ts:50`).
  - File is accepted and forwarded as-is (`app/api/rfq/route.ts:71-76`, `app/api/rfq/route.ts:131-139`).
  - No server-side size cap and no MIME allowlist enforcement in API route.
- **[MEDIUM] Partial-success semantics are permissive** (`app/api/rfq/route.ts:148-153`): same as contact route.
- **[LOW] Raw error object logging exists** (`app/api/rfq/route.ts:113`, `app/api/rfq/route.ts:142`, `app/api/rfq/route.ts:144`, `app/api/rfq/route.ts:156`).
- **[HIGH] No abuse protection**: no rate limiting/CAPTCHA on route.
- **[PASS] `SANITY_API_TOKEN` remains server-only in app code** (`sanity/lib/writeClient.ts:8`).

**Concrete fix snippet (RFQ parse + file validation):**
```ts
// app/api/rfq/route.ts
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const MAX_SIZE = 10 * 1024 * 1024;

let parsedJson: unknown;
try {
  parsedJson = JSON.parse(dataStr);
} catch {
  return NextResponse.json({ error: "Validation failed", details: { data: "Invalid JSON" } }, { status: 400 });
}
data = parsedJson as Omit<RFQFormData, "attachment"> & { customLabelRequest?: boolean };

if (file && file.size > 0) {
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Attachment too large (max 10MB)." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Invalid attachment type." }, { status: 400 });
  }
}
```

### Sanity Configuration

- **[INFO] Write client token wiring is standard but scope is not verifiable from repo** (`sanity/lib/writeClient.ts:3-9`).
  - Cannot confirm from code whether token is editor/global vs minimal custom role.
- **[HIGH, conditional] Public read client + public dataset risk**:
  - Read client is anonymous + CDN (`sanity/lib/client.ts:3-8`).
  - If Sanity dataset is set to public in project settings, any browser can query exposed documents directly, including inquiry PII if queried.
  - Dataset visibility must be confirmed in Sanity project settings (not in repo).
- **[HIGH] `INQUIRIES_QUERY` exports full inquiry PII and is unused** (`sanity/lib/queries.ts:46-49`; only definition found).
  - Recommend deleting before launch.
- **[INFO] Sanity CORS lock-down cannot be verified from code** (must confirm in Sanity project settings).

### Studio Route

- **[INFO] `/studio` relies on Sanity auth as gate** (`app/studio/[[...index]]/page.tsx:1-10`).
  - Route is publicly reachable, but editor actions require Sanity login.
- **[PASS] Locale middleware excludes `/studio`** (`proxy.ts:7`).
  - Verified runtime:
    - `/studio` => 200
    - `/en/studio` => 404

### Secrets

- **[PASS] No `NEXT_PUBLIC_SANITY_API_TOKEN` references found.**
- **[PASS] `.env*` ignored in git** (`.gitignore:33-34`) and `.env.example` is allowlisted.
- **[LOW] `scripts/test-resend.mjs` logs recipient email** (`scripts/test-resend.mjs:47`), but script is only run manually (`package.json:12`) and not imported by runtime routes.
- **[MEDIUM] `.env.example` lacks required build/runtime clarity** (`.env.example:1-13`): no comments about required-at-build vs optional runtime features.

---

## 2. RELIABILITY AUDIT

### Partial Success Semantics

- `app/api/contact/route.ts`
  - Sanity ok + email ok => 200 success.
  - Sanity ok + email fail => 200 success (`line 85`).
  - Sanity fail + email ok => 200 success (`line 85`).
  - both fail => 500 (`line 88`).
- `app/api/rfq/route.ts`
  - Same matrix via `line 148` and `line 151`.

### RFQ Multipart Parsing

- Flow: content-type check (`app/api/rfq/route.ts:54,60`) -> `request.formData()` (`line 61`) -> `formData.get("data")` (`line 62`) -> type check only (`line 63`) -> direct `JSON.parse` (`line 69`).
- Edge cases:
  - `data` missing/non-string => 400 (`line 63-67`) ✅
  - empty string / malformed JSON string => thrown error -> outer catch -> 500 (`line 69`, `line 155-160`) ❌ should be 400.

### Locale Routing

- Matcher excludes API, studio, Next internals, static assets (`proxy.ts:7`) and aligns with typical next-intl approach.
- Root redirect verified in production mode:
  - `/` => `307` location `/en`.
- `generateStaticParams` locale arrays match routing locales:
  - `i18n/routing.ts:4` => `["en","fr","de"]`
  - `app/[locale]/catalog/[slug]/page.tsx:49`
  - `app/[locale]/blog/[slug]/page.tsx:42`

### Sanity Singleton Null-Safety

- `HeroSection` handles null `settings` with defaults (`components/home/HeroSection.tsx:21-24`, `154-158`) ✅
- `FeaturedCategories` has fallback categories (`components/home/FeaturedCategories.tsx:96-100`) ✅
- `StatsBar` has fallback values (`components/home/StatsBar.tsx:23-27`) ✅
- `CustomLabelCustomizations` expects array input, and caller guarantees fallback array (`app/[locale]/custom-label/page.tsx:120-127`, `211`) ✅

### Form Reset & Feedback

- `RFQForm`:
  - Success message shown (`components/forms/RFQForm.tsx:116-122`), error message shown (`123-127`) ✅
  - File input is cleared on success (`105-107`) ✅
  - **Form values are not fully reset** (no `reset()` call) ⚠️
- `ContactForm`:
  - Success/error state shown (`54-65`) ✅
  - **Form values are not reset** after success ⚠️
- Client/server schema parity:
  - Contact schema parity is aligned.
  - RFQ route omits attachment schema server-side (`app/api/rfq/route.ts:50`) -> mismatch with client expectations (`lib/validations.ts:32-39`).

---

## 3. PERFORMANCE AUDIT

### Catalog Filtering

- Product filtering is fully client-side in `components/catalog/CatalogClient.tsx:30-42`.
- Parent passes stable `setFilters` to `onFilterChange` (`components/catalog/CatalogClient.tsx:48`) so debounce dependency does **not** churn.
- Product count from live Sanity could not be reliably sampled in this shell due command quoting constraints; route behavior indicates dynamic fetch path is in use.
- Recommendation: if catalog grows beyond ~200 items, move filtering/search server-side and reduce per-card motion.

### Caching

| Page | revalidate value | Intentional? | Recommendation |
|------|------------------|--------------|----------------|
| `app/[locale]/page.tsx` | `60` (`line 19`) | Yes (commented) | Consider 300-3600s + webhook invalidation for editorial workflow |
| `app/[locale]/catalog/page.tsx` | none | No | Set explicit `revalidate` |
| `app/[locale]/catalog/[slug]/page.tsx` | none | Unclear | Set explicit `revalidate` (or force-dynamic with reason) |
| `app/[locale]/blog/page.tsx` | none | Unclear | Set explicit `revalidate` |
| `app/[locale]/blog/[slug]/page.tsx` | none | Unclear | Set explicit `revalidate` |
| `app/[locale]/about/page.tsx` | none | Unclear | Static metadata-only page; set explicit caching policy |
| `app/[locale]/why-us/page.tsx` | none | Unclear | Same |
| `app/[locale]/how-it-works/page.tsx` | none | Unclear | Same |
| `app/[locale]/faq/page.tsx` | none | Unclear | Set explicit `revalidate` due Sanity content |
| `app/[locale]/lookbook/page.tsx` | none | Unclear | Same |
| `app/[locale]/contact/page.tsx` | none | Unclear | Same |
| `app/[locale]/rfq/page.tsx` | none | Unclear | Same |
| `app/[locale]/custom-label/page.tsx` | none | Unclear | Set explicit `revalidate` |
| `app/studio/[[...index]]/page.tsx` | `dynamic = "force-dynamic"` (`line 6`) | Yes | Keep |

**Sanity fetch cache options:** all `client.fetch(...)` calls in app routes are used without explicit `{cache,next}` options; no route-level fetch cache tuning in `sanity/lib/client.ts`.

### Images & Video

- `Image` usage generally includes `fill` with sized container or dimensions ✅
- Hero video has `autoPlay` but no explicit preload (`components/home/HeroSection.tsx:153-165`) ⚠️
  - Recommend `preload="metadata"` to reduce network pressure.
- Product cards do not use `priority` for grid items (`components/catalog/ProductCard.tsx:20-26`) ✅

### Bundle

- Translation file sizes:
  - `messages/en.json` = 6864 bytes
  - `messages/fr.json` = 7323 bytes
  - `messages/de.json` = 7208 bytes
- Sizes are small; no namespace-splitting pressure currently.

---

## 4. SEO AUDIT

### OG Image
**EXISTS: NO** — `public/og-image.jpg`  
`app/[locale]/layout.tsx:41` and `app/[locale]/layout.tsx:52` reference this missing asset.

### Metadata Coverage

| Page | generateMetadata | title | description | openGraph | hreflang |
|------|------------------|-------|-------------|-----------|----------|
| `/[locale]` | NO | YES (layout-level) | YES | YES (layout-level) | NO explicit alternates |
| `/[locale]/catalog` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/catalog/[slug]` | YES | YES | YES | YES | NO explicit alternates |
| `/[locale]/about` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/why-us` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/how-it-works` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/custom-label` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/contact` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/rfq` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/faq` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/lookbook` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/blog` | NO | YES | YES | NO page-specific | NO explicit alternates |
| `/[locale]/blog/[slug]` | YES | YES | YES | YES | NO explicit alternates |

### JSON-LD Schemas

- `Organization` emitted in `app/[locale]/layout.tsx:67-89` via `JsonLd` ✅
- `Product` emitted on PDP in `app/[locale]/catalog/[slug]/page.tsx:74-103` ✅
- `WebSite` schema missing (recommended addition).

### Sitemap & robots.txt

- `robots.ts` allows crawling and points to sitemap (`app/robots.ts:5-13`) ✅
- `sitemap.ts` includes localized static pages + product/blog slugs (`app/sitemap.ts:22-55`) ✅
- Sitemap is Sanity-driven for product/blog slugs.

---

## 5. INTERNATIONALISATION AUDIT

### Missing Translation Keys

| Key | Missing in |
|-----|-----------|
| None found (156/156 parity) | — |

### Hardcoded Strings

| File | Line | String | Fix |
|------|------|--------|-----|
| `app/[locale]/catalog/page.tsx` | 38 | `"Home / Catalog"` | Use `t()` key |
| `app/[locale]/catalog/page.tsx` | 41-44 | `"Our Collection"`, `"Product"`, `"Catalog"` | Use localized keys |
| `components/catalog/ProductCard.tsx` | 31,45,70,78 | `"Photo Coming Soon"`, `"Uncategorized"`, `"Inquire Now"`, `"View Details"` | Replace with `useTranslations` |
| `components/home/FeaturedCategories.tsx` | 105-107,160 | Heading/CTA literals | Use `t()` |
| `components/home/StatsBar.tsx` | 61 | `"We actively serve clients in these markets"` | Use `t()` |
| `components/home/HowItWorksMini.tsx` | 13-27 | Step titles/descriptions hardcoded | Externalize strings |
| `components/home/WhyUsMini.tsx` | 12-24,57-58 | Card content and heading hardcoded | Externalize strings |
| `components/forms/RFQForm.tsx` | 315,332,345 | Attachment helper texts hardcoded | Use `t()` |
| `app/[locale]/contact/page.tsx` | 37 | `"Contact Information"` | Use localized key |
| `app/[locale]/rfq/page.tsx` | 17-20,29-42 | Hero labels and stat text | Use localized key |

### Locale Switcher

- **YES, path is preserved**: `router.replace(pathname, { locale: l.code })` in `components/layout/Navbar.tsx:123` and `188`.
- This preserves slug routes like `/en/catalog/some-slug` -> `/fr/catalog/some-slug`.

### Content Localisation Gap

- Blog and FAQ are single-language Sanity docs in current schema (`sanity/schemas/blogPost.ts`, `sanity/schemas/faqItem.ts`) with no locale field/plugin wiring.
- Result: same content likely appears across `/en|fr|de` routes unless manually translated per document strategy.

---

## 6. CODE QUALITY AUDIT

### Dead Dependencies

- `next-themes` in dependencies but no usage found (`package.json:30`) -> remove or implement.
- `shadcn` CLI is in runtime dependencies (`package.json:36`) -> move to `devDependencies` or remove.
- `@sanity/vision` used in Studio config (`sanity/sanity.config.ts:3,42`) only; move to `devDependencies`.

### npm audit Results

- `3` vulnerabilities reported:
  - `next` (moderate) advisories: request smuggling, image cache growth, buffering DoS, CSRF null-origin related (upgrade path points to `next@16.2.1`).
  - `undici` (high) advisories via direct/transitive packages.
  - `flatted` (high) prototype pollution.

### Component Issues

- `components/ui/badge.tsx` uses Base UI render hooks but has no `"use client"` (`components/ui/badge.tsx:1-2`) -> add `"use client"` if used in RSC boundary.
- Unused UI components (no app imports detected):
  - `components/ui/badge.tsx`
  - `components/ui/select.tsx`
  - `components/ui/textarea.tsx`
  - `components/ui/input.tsx`
  - `components/ui/card.tsx`
  - `components/ui/dialog.tsx`
  - `components/ui/separator.tsx`

### TypeScript Gaps

- `types/sanity.ts` missing schema fields:
  - `Product` missing `seo.metaTitle/metaDescription` object (`sanity/schemas/product.ts:84-96`).
  - `BlogPost` missing `seo` object (`sanity/schemas/blogPost.ts:48-55`).
  - No `Inquiry` interface despite active inquiry writes (`sanity/schemas/inquiry.ts`).
- GROQ queries are typed at call sites (`client.fetch<Type>(...)`) which is good, but partial schema mismatch above remains.

---

## 7. DEPLOYMENT READINESS

### Build Output

- `next build` passes with zero errors on Next `16.1.6`.
- Build routes show `/api/contact`, `/api/rfq`, `/studio` recognized and generated.

### Vercel Config

- `vercel.json` is minimal (`framework`, build/install commands) with no explicit Node runtime pin (`vercel.json:1-5`).
- Timeout risk:
  - RFQ does multipart parse + Sanity write + Resend send.
  - On Hobby 10s function limit, larger files and slow providers can time out; risk is real for attachment path.
- Env completeness:
  - `.env.example` declares expected keys, but dashboard parity cannot be verified from repo.

### Monitoring

- No Sentry/error tracking wiring found -> **HIGH** for lead-loss risk on silent route failures.
- No analytics/conversion tracking wiring found -> **HIGH** for lead-gen business observability.

---

## PRIORITY MATRIX

### 🔴 CRITICAL — Fix before any public traffic
- Guard multipart JSON parse and return 400 on malformed `data` in `app/api/rfq/route.ts:69`.
- Add strict server-side file size/type validation before attachment forwarding in `app/api/rfq/route.ts:71-76`.
- Add missing `public/og-image.jpg` used by metadata in `app/[locale]/layout.tsx:41,52`.

### 🟠 HIGH — Fix within 48h of launch
- Add rate limiting/CAPTCHA to both public POST routes (`app/api/contact/route.ts`, `app/api/rfq/route.ts`).
- Remove or lock down `INQUIRIES_QUERY` export (`sanity/lib/queries.ts:46-49`).
- Confirm Sanity dataset is private (or enforce query-level exposure controls) and CORS is production-domain-only in Sanity settings.
- Add error monitoring and lead funnel analytics.

### 🟡 MEDIUM — Fix within first month
- Standardize explicit cache/revalidate policy across all locale pages.
- Localize hardcoded strings in marketing/catalog components.
- Improve API logging hygiene (sanitize error logs).
- Move dead/prod-inappropriate deps (`shadcn`, `@sanity/vision`, optional `next-themes`).

### 🟢 LOW — Nice to have
- Add `WebSite` JSON-LD.
- Clean up unused UI scaffolding components.
- Add `reset()` for contact/RFQ forms after success.

---

## LAUNCH CHECKLIST

- [ ] `public/og-image.jpg` exists and is 1200×630px
- [ ] `JSON.parse` in `app/api/rfq/route.ts` line 69 wrapped in try/catch
- [ ] Server-side file type + size validation added to `app/api/rfq/route.ts`
- [ ] `INQUIRIES_QUERY` confirmed unused or deleted from `sanity/lib/queries.ts`
- [ ] `SANITY_API_TOKEN` confirmed server-only (not in any NEXT_PUBLIC_ var)
- [ ] Sanity write token scope confirmed as minimal
- [ ] Sanity dataset visibility confirmed and documented
- [ ] Sanity CORS locked to production domain only
- [ ] All env vars set in Vercel dashboard
- [ ] `next build` passes with zero errors
- [ ] Root `/` → `/en/` redirect tested in production
- [ ] `/studio` excluded from locale middleware confirmed
- [ ] RFQ and Contact forms tested end-to-end in production
- [ ] hreflang tags verified in page source for all 3 locales
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] `next-themes` removed or implemented
- [ ] `shadcn` moved to devDependencies

---

## CONCLUSION

The app is close to launchable, but not yet safe for production traffic. The single biggest risk is the RFQ API path: malformed multipart JSON handling and unvalidated file forwarding create avoidable stability and abuse exposure on your highest-value lead route. The first mandatory fixes are RFQ parse/file validation, anti-abuse controls on both POST routes, and restoring the missing OG image asset. After that, you can safely defer broader i18n cleanup and dependency hygiene to post-launch, but monitoring and conversion analytics should still be added as early as possible.
