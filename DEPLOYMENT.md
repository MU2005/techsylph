# TechSylph – Vercel deployment & GitHub

## Vercel deployment checklist

The project **builds successfully** locally. Before deploying:

### 1. Environment variables (required on Vercel)

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Usually `production` |
| `SANITY_API_TOKEN` | Yes | For Sanity write client (studio, imports) |
| `RESEND_API_KEY` | Yes | For contact/RFQ emails |
| `ADMIN_EMAIL` | Yes | Where form submissions are sent |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | WhatsApp link (e.g. `+923225594022`) |
| `RESEND_FROM` | No | Sender address (default: Resend onboarding) |

Use the same values as in `.env.local` (do not commit `.env.local`).

### 2. Build settings (Vercel)

- **Framework preset:** Next.js (auto-detected)
- **Root directory:** Leave empty if the repo root is the Next app, or set to `techsylph` if the repo root is the parent folder.
- **Build command:** `npm run build` (default)
- **Output directory:** (default)

### 3. Optional: middleware deprecation (Next.js 16)

The build shows:

```text
The "middleware" file convention is deprecated. Please use "proxy" instead.
```

This is a warning only; the app still runs. You can migrate to the new “proxy” convention later using the [Next.js docs](https://nextjs.org/docs/messages/middleware-to-proxy).

---

## Connect this project to GitHub and deploy

### Step 1: Initialize Git and push to GitHub

From the **project root** (folder that contains `techsylph` or the app):

```bash
# If the repo root is inside techsylph:
cd c:\Users\User\Desktop\Projects\Techsylph\techsylph

# Initialize git (if not already)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: TechSylph Next.js app"

# Add GitHub remote (repo: https://github.com/MU2005/techsylph)
git remote add origin https://github.com/MU2005/techsylph.git

# Push (use main or master depending on your default branch)
git branch -M main
git push -u origin main
```

If the repo root is **Techsylph** (parent of `techsylph`), run `git init` in `c:\Users\User\Desktop\Projects\Techsylph` and add/commit from there so the top level of the repo is what you want on GitHub.

### Step 2: Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign in (with GitHub if you prefer).
2. **Add New Project** → **Import Git Repository**.
3. Select **MU2005/techsylph** (or connect GitHub and then choose the repo).
4. If the app lives in a subfolder (e.g. `techsylph`), set **Root Directory** to `techsylph`.
5. Add the environment variables listed above.
6. Click **Deploy**.

After the first deploy, every push to `main` (or your production branch) will trigger a new deployment.

---

## Quick reference

- **GitHub repo:** https://github.com/MU2005/techsylph  
- **Env template:** `.env.example` (copy to `.env.local` locally; use Vercel UI in production)  
- **Build:** `npm run build`  
- **Lint:** `npm run lint`
