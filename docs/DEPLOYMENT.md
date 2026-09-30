# Deploying HouseBank's frontend to Namecheap (cPanel static hosting)

This is a Vite/React SPA. There's no Node process for this half —
`npm run build` produces a static `dist/` folder that cPanel serves as
plain files (Apache/LiteSpeed), same as any HTML site. The backend
(`hb-backend`) is a separate Node app — see its own `docs/DEPLOYMENT.md`.

## 0. Point the build at your real API before building

Vite bakes `VITE_APP_BACKEND_HOST` into the JS bundle at **build time** —
it's not read at runtime like a normal backend env var. Your working
`.env.local` currently points at `https://dan.pxxlspace.cv/`, and Vite
loads `.env.local` in every mode, including production builds, so a
plain `npm run build` right now would ship a frontend that calls your
laptop.

Before building for deployment, create `.env.production.local` (git-
ignored, same as `.env.local`) in this folder:

```
VITE_APP_BACKEND_HOST=https://api.yourdomain.com/
```

(That's the API subdomain from the backend's `docs/DEPLOYMENT.md` step
3 — must match exactly, trailing slash included, matching how
`src/redux/housebank.ts` builds request URLs.) `.env.production.local`
outranks `.env.local` for production builds, so this overrides it
without touching your local dev setup.

## 1. Build

```
npm install
npm run build
```

Output is `dist/` — everything inside it is what gets uploaded, the
`dist` folder name itself doesn't matter to the server.

This also bundles `public/.htaccess` (already in this repo) into
`dist/.htaccess` automatically — that file is what makes React Router's
client-side routes (e.g. a direct visit or refresh on `/explore` or
`/agent/dashboard`) work on Apache instead of 404ing. Confirm it's
present after the build:

```
ls -la dist/.htaccess
```

## 2. Create where it lives in cPanel

Decide the domain/subdomain this frontend will answer on (e.g. your
main domain, or a `test.yourdomain.com` subdomain while you're
verifying features first) — cPanel → **Domains** (or **Subdomains**) →
create it if it doesn't exist yet, and note the **document root** cPanel
assigns it (often `public_html` for the main domain, or
`public_html/test` for a subdomain).

## 3. Upload

Upload the **contents** of `dist/` (not the `dist` folder itself) into
that document root, via cPanel **File Manager** or SFTP:

```
public_html/
├── .htaccess
├── index.html
├── favicon.png
├── og-image.png
├── robots.txt
├── sitemap.xml
└── assets/
    └── ...
```

If the document root already has a placeholder `index.html` or a
default cPanel page, remove it first so it doesn't collide.

## 4. Before this becomes the real production domain

`public/robots.txt` and `public/sitemap.xml` (source files, copied
verbatim into every `dist/`) both still contain the placeholder
`https://YOUR-DOMAIN-HERE`. Replace it with your real domain and rebuild
before this goes live for real — harmless while you're just testing on
a subdomain, but wrong URLs in a sitemap you submit to Google are worse
than no sitemap.

## 5. Verify

- Visit the domain — the homepage should load.
- Manually type a deep URL in the address bar (not a link click), e.g.
  `https://yourdomain.com/explore`, and refresh it. If you get an Apache
  404 instead of the app, `.htaccess` didn't upload or `mod_rewrite`
  isn't enabled on your hosting plan (contact Namecheap support for the
  latter — it's standard on shared hosting but occasionally needs
  enabling).
- Open the browser console on any page that hits the API (e.g. sign in)
  and confirm requests go to `https://api.yourdomain.com/...`, not
  `localhost`. If you see `localhost:3001`, step 0 was skipped or
  `.env.production.local` has a typo — rebuild.
- Confirm CORS works end to end: a failed request that never reaches
  the Network tab with a response, only a CORS error in the console,
  means the backend's `FRONTEND_URL` env var (backend `docs/DEPLOYMENT.md`
  step 4) doesn't match this domain exactly (scheme + host, no trailing
  slash mismatch).

## Redeploying later

Same three commands — rebuild, then re-upload `dist/`'s contents over
the old ones. `.htaccess` ships with every build automatically since
it's fixed in `public/`, so you won't lose it.
