# Deployment Guide — Cloudflare Pages

This project is a TanStack Start (React 19 + Vite) application. Lovable-specific
tooling has been removed; it now builds with stock Vite/TanStack/Nitro plugins.

## Build settings (Cloudflare Pages dashboard)

- Build command: `npm run build`
- Build output directory: `dist` (Nitro's `cloudflare_pages` preset emits a
  Pages-compatible `_worker.js` + static assets here). If your installed
  Nitro version emits to a different folder, check what's created after
  running `npm run build` locally and point the output directory there.
- Node version: 18+ (set `NODE_VERSION` env var if needed)
- Root directory: this folder, if deploying from a monorepo

Note: TanStack Start's Vite plugin (`@tanstack/react-start/plugin/vite`)
already bundles the Nitro Vite plugin internally — `vite.config.ts` only
needs to pass the `nitro: { preset: "cloudflare_pages" }` option, not
register `nitro/vite`'s plugin a second time.

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
