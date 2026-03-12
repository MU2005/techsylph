# TechSylph

Next.js 14+ project with App Router, TypeScript, Tailwind CSS, shadcn/ui, next-intl, and Sanity.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.local` and fill in your environment variables.

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to the default locale (e.g. `/en`).

## Stack

- **Framework:** Next.js (App Router), TypeScript (strict)
- **Styling:** Tailwind CSS, shadcn/ui (CSS variables)
- **Fonts:** Syne (headings), Inter (body) via `next/font/google`
- **i18n:** next-intl (en, fr, de)
- **CMS:** Sanity (next-sanity, @sanity/client)
- **Forms:** react-hook-form, @hookform/resolvers, zod
- **Email:** Resend

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
