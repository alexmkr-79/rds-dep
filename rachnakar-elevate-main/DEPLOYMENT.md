# Deployment Guide — Cloudflare Pages

This project is a Vite React SPA with TanStack Router and client-side routing.
Lovable-specific tooling has been removed, and the app now builds as a static
site for Cloudflare Pages.

## Build settings (Cloudflare Pages dashboard)

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 18+ (set `NODE_VERSION` env var if needed)
- Root directory: this folder, if deploying from a monorepo

## Decap CMS

`public/admin/config.yml` ships with a placeholder `repo: OWNER/REPO`. Update
it to your actual `org/repo` and branch before publishing, and configure the
GitHub backend / OAuth provider per the Decap CMS docs.

## Security headers

`public/_headers` defines Cloudflare Pages response headers (CSP, HSTS,
X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
The `/admin/*` path gets a relaxed CSP so the Decap CMS bundle (loaded from
unpkg.com) can run. Review the CSP if you add new third-party scripts, fonts,
or image hosts.

## SEO

`public/robots.txt` is included. Add `public/sitemap.xml` once you know your
production domain (sitemaps require absolute URLs).

## Verifying the build locally

This conversion was done in a sandbox without network/npm access, so the
build could not be executed here. Before deploying, run:

```bash
npm install
npm run build
npm run preview
```

and confirm the site renders identically to the original Lovable preview.
