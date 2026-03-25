# Sanity Security Verification

Date: 2026-03-25

## Verified Items

- **Project ID:** `tz0ejrmm`
- **Dataset:** `production`
- **Token label:** `techsylph`
- **Token role:** `Editor` (from `npx sanity tokens list --json`)

## Dataset Visibility

- Command: `npx sanity dataset visibility get production`
- Result: `private`

Notes:
- Sanity CLI reported: datasets are private while assets remain public.
- Verification script result shows `aclMode: "private"` on dataset metadata.

## CORS Allowlist

Final allowlist after cleanup (`npx sanity cors list`):

- `https://techsylph.vercel.app`
- `https://www.techsylph.shop`

Removed:

- `http://localhost:3333`
- `http://localhost:3000`

## Public Data Probe

Script: `node scripts/verify-sanity-security.mjs`

Observed checks:

- `dataQueryNoAuth: 200` with `count(*[_type=="inquiry"]) => 0`
- `managementDatasetsWithToken: 200` with `aclMode: "private"`

Interpretation:

- Anonymous query does not expose inquiry documents after private dataset hardening.
- Application-level PII query helper (`INQUIRIES_QUERY`) was removed earlier from code.

## Token Scope Note

- Current runtime token is `Editor` role.
- For this app (server-side Sanity reads + inquiry writes), Editor is currently the write-capable built-in role used by the project.
- If you later introduce custom Sanity roles, rotate to a narrower custom role that only permits required read/write operations.
