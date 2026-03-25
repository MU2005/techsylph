# Production Audit Fix Tracker

Use this file as a living checklist.  
Rule: when a task is completed and verified, cut it from `## To Do` and paste it into `## Solved` with date + notes.

---

## To Do

### P0 - Critical (fix before public traffic)

### P1 - High (fix within 48h of launch)

### P2 - Medium (first month)

### P3 - Low (nice-to-have)

---

## Solved

- [x] **T-001: Guard RFQ multipart JSON parsing**
  - **Completed on:** 2026-03-25
  - **Notes:** Added local `try/catch` around multipart `JSON.parse` in `app/api/rfq/route.ts`; malformed payload now returns `400` with validation details instead of falling into generic `500`.

- [x] **T-002: Add server-side RFQ attachment validation**
  - **Completed on:** 2026-03-25
  - **Notes:** Added server-side MIME allowlist + 10MB max file size checks in `app/api/rfq/route.ts`; invalid attachment types/sizes now return `400`. Verified with successful `next build` and no lints on edited route.

- [x] **T-003: Add missing OG image asset**
  - **Completed on:** 2026-03-25
  - **Notes:** Added `public/og-image.jpg` and verified file is present and loadable at the expected path used by metadata.

- [x] **T-004: Add abuse protection to `POST /api/contact`**
  - **Completed on:** 2026-03-25
  - **Notes:** Added IP-based in-memory rate limiting in `app/api/contact/route.ts` with `429` response and `Retry-After` header when throttled.

- [x] **T-005: Add abuse protection to `POST /api/rfq`**
  - **Completed on:** 2026-03-25
  - **Notes:** Added IP-based in-memory rate limiting in `app/api/rfq/route.ts` with `429` response and `Retry-After` header when throttled.

- [x] **T-006: Remove or secure `INQUIRIES_QUERY`**
  - **Completed on:** 2026-03-25
  - **Notes:** Removed `INQUIRIES_QUERY` export from `sanity/lib/queries.ts` to eliminate accidental exposure of inquiry PII from app-query helpers.

- [x] **T-010: Add error tracking (Sentry or equivalent)**
  - **Completed on:** 2026-03-25
  - **Notes:** Added Sentry SDK (`@sentry/nextjs`), runtime instrumentation (`instrumentation.ts`), server/edge init files, and API exception capture via `reportApiError()` in both inquiry routes. Added `SENTRY_DSN` to `.env.example`.

- [x] **T-012: Decide and document partial-success API semantics**
  - **Completed on:** 2026-03-25
  - **Notes:** Kept lead-preserving semantics (success if either Sanity save or email send succeeds) and made partial outcomes explicit in API response payload (`partial` + per-service status) in both contact and RFQ routes.

- [x] **T-013: Sanitize API error logging**
  - **Completed on:** 2026-03-25
  - **Notes:** Replaced raw object logging in contact/RFQ handlers with structured sanitized error reporting (`message` + stage metadata) through `lib/monitoring.ts`.

- [x] **T-015: Add hero video preload strategy**
  - **Completed on:** 2026-03-25
  - **Notes:** Added `preload=\"metadata\"` to mobile hero video in `components/home/HeroSection.tsx`.

- [x] **T-011: Add lead analytics/conversion tracking**
  - **Completed on:** 2026-03-25
  - **Notes:** Added Google Analytics integration in `app/layout.tsx` (via `NEXT_PUBLIC_GA_MEASUREMENT_ID`) and form submission events (`generate_lead`) with `form_type`, `locale`, and `page_path` from both contact and RFQ forms.

- [x] **T-014: Add explicit caching policy per route**
  - **Completed on:** 2026-03-25
  - **Notes:** Added explicit `revalidate` values across locale page routes (`app/[locale]/**`) so all key routes now have intentional caching behavior.

- [x] **T-018: Add `reset()` on successful form submit**
  - **Completed on:** 2026-03-25
  - **Notes:** Added form reset behavior to both `ContactForm` and `RFQForm` after successful submission (including file input reset for RFQ).

- [x] **T-019: Fix type/schema mismatches**
  - **Completed on:** 2026-03-25
  - **Notes:** Updated `types/sanity.ts` to include `seo` objects on `Product` and `BlogPost`, and added `Inquiry` interface aligned with inquiry schema fields.

- [x] **T-024: Clarify `.env.example` build vs runtime requirements**
  - **Completed on:** 2026-03-25
  - **Notes:** Added requirement-level comments in `.env.example` and aligned `DEPLOYMENT.md` env table with Sentry + GA variables.

- [x] **T-016: Add hreflang alternates**
  - **Completed on:** 2026-03-25
  - **Notes:** Added locale alternates/canonical metadata in `app/[locale]/layout.tsx` for `en`, `fr`, `de`, and `x-default`, establishing explicit hreflang links at locale layout level.

- [x] **T-020: Dependency cleanup**
  - **Completed on:** 2026-03-25
  - **Notes:** Removed unused `next-themes`, moved `shadcn` and `@sanity/vision` to `devDependencies`, and refreshed lockfile.

- [x] **T-021: Resolve npm audit vulnerabilities**
  - **Completed on:** 2026-03-25
  - **Notes:** Ran dependency updates and `npm audit fix`; high vulnerabilities were eliminated. One remaining moderate advisory persists in pinned `next@16.1.6`, requiring major-range bump (`npm audit fix --force`) to clear.

- [x] **T-022: Add `WebSite` JSON-LD**
  - **Completed on:** 2026-03-25
  - **Notes:** Added `WebSite` JSON-LD object alongside existing organization schema in `app/[locale]/layout.tsx`.

- [x] **T-023: Remove unused UI scaffolding components**
  - **Completed on:** 2026-03-25
  - **Notes:** Removed unused UI files with no app imports: `badge.tsx`, `select.tsx`, `textarea.tsx`, `input.tsx`, `card.tsx`, `separator.tsx`, `dialog.tsx`.

- [x] **T-007: Confirm minimal Sanity write token scope**
  - **Completed on:** 2026-03-25
  - **Notes:** Verified token inventory with `npx sanity tokens list --json`; documented active token role and security posture in `SANITY_SECURITY_VERIFICATION.md`.

- [x] **T-008: Confirm Sanity dataset visibility**
  - **Completed on:** 2026-03-25
  - **Notes:** Set and verified `production` dataset visibility to `private` via `npx sanity dataset visibility set/get production`; recorded evidence in `SANITY_SECURITY_VERIFICATION.md`.

- [x] **T-009: Lock Sanity CORS to production domains**
  - **Completed on:** 2026-03-25
  - **Notes:** Removed localhost origins and verified final allowlist contains production domains only via `npx sanity cors list`; documented in `SANITY_SECURITY_VERIFICATION.md`.

- [x] **T-017: Localize hardcoded UI strings**
  - **Completed on:** 2026-03-25
  - **Notes:** Localized key user-facing strings in catalog, product card/detail, stats bar, contact/rfq pages, and RFQ attachment helper UI; added matching keys across `messages/en.json`, `fr.json`, and `de.json` with parity verification.

