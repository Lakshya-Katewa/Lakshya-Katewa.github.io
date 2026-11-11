# Lakshya Katewa: portfolio

Personal portfolio. Next.js (App Router) + TypeScript + Tailwind CSS v4, exported as a fully static site.

Lighthouse (mobile preset, production build, 2026-11-11): **Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100**. LCP 1.4 s (home, with the 3D hero) and 1.2 s (case study), CLS 0. Home ranged 98–100 across runs while the 3D work was tuned.

## Setup

Requires Node 20+ (developed on Node 22).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site → out/
npm run preview    # serve out/ on http://localhost:4321
npm run lighthouse # with preview running: mobile Lighthouse for both pages
```

## Editing content

**All text lives in [`src/data/site.ts`](src/data/site.ts).** Layout components only read from it, so you never need to touch them to:

- change the hero line, intro, links or email (`site`)
- edit the "At a glance" slip (`slip`)
- edit the ChinarAgro case study: problem, flows, decisions, stack, role (`caseStudy`)
- add, remove or reorder projects (`projects`): each has `name`, `outcome`, `stack`, `repo`, optional `demo`
- update skills, about text, education and experience (`skills`, `about`)
- update the footer Lighthouse numbers (`buildNote.lighthouse`)

Search the file for `TODO` to find what still needs your input.

### Files you supply

| Path | What |
| --- | --- |
| `public/resume.pdf` | Resume behind the "Download resume" button (currently your SPO resume) |
| `public/screenshots/app-home.png`, `app-cart.png`, `app-tracking.png` | App screenshots. See `public/screenshots/README.md`. Missing files are skipped at build time, and the phone frame shows a schematic instead |
| `src/app/opengraph-image.png`, `twitter-image.png` | 1200×630 social preview card |

## How it's built

- **Every component is a Server Component.** Pages are rendered to HTML at build time.
- **No React runtime ships.** Nothing on the site needs hydration, so `scripts/strip-runtime.mjs` (runs as `postbuild`) removes the framework's client JS and inline RSC payload from the exported HTML. What remains is a ~1 KB inline theme script, plus the lazily loaded 3D scene described below. Links become normal page loads.
  - If you add a `"use client"` component, build with `KEEP_NEXT_RUNTIME=1 npm run build`, or remove the `postbuild` script.
- **3D hero (three.js):** `src/three/hero-scene.ts` is bundled separately by esbuild (`scripts/build-3d.mjs`, runs before `dev`/`build`) into `public/three/hero-scene.js` (~136 KB gzipped). An inline loader in `Hero.tsx` imports it only after the browser reports the Largest Contentful Paint and the main thread is idle, and skips it on Save-Data connections. Until it's ready, or if WebGL is unavailable, a CSS phone shows in the same fixed-size stage, so nothing shifts.
  - Cheap by design: a baked contact shadow instead of a shadow map, standard (not physical) materials, shaders compiled with `compileAsync`, pixel ratio capped at 1.5, and rendering on demand. After a short entrance swing, the loop stops until you hover or drag. With reduced motion it renders a single still frame.
  - The phone screen shows `public/screenshots/app-home.png` if it exists; otherwise it draws an "LK." splash screen that follows the theme.
- **CSS is inlined** (`experimental.inlineCss`), so there is no render-blocking stylesheet request.
- **Fonts:** Fraunces 500 (display) and JetBrains Mono 400 (labels), self-hosted by `next/font`, `font-display: swap`. Body text uses the system UI font.
- **Theme:** colour tokens in `src/app/globals.css`. The site follows `prefers-color-scheme` until the visitor uses the toggle, then remembers their choice.
- **Motion:** CSS only. A short fade on hero secondaries, plus scroll-driven reveals where `animation-timeline: view()` is supported. All of it is disabled under `prefers-reduced-motion`. The primary hero text is never animated, so it paints at first paint as the LCP element.
- **SEO:** metadata and Open Graph/Twitter tags in `src/app/layout.tsx`. `sitemap.xml` and `robots.txt` are generated from `src/app/sitemap.ts` and `robots.ts`. The favicon is `src/app/icon.svg`.

```
src/
  app/            layout, home page, /work/chinaragro, sitemap, robots, icon, OG image
  components/     one small component per section
  data/site.ts    all content
  lib/            basePath helper, build-time screenshot detection
scripts/          strip-runtime (postbuild), lighthouse
```

## Deploying

Set `NEXT_PUBLIC_SITE_URL` to the final URL so canonical links, Open Graph and the sitemap point at the right place. Alternatively, change the fallback in `src/data/site.ts`.

### Vercel (simplest)

```bash
git init && git add -A && git commit -m "Portfolio"
gh repo create portfolio --public --source=. --push
npx vercel@latest --prod        # or import the repo at vercel.com/new: no config needed
```

Then in Vercel → Project → Settings → Environment Variables, set `NEXT_PUBLIC_SITE_URL=https://<your-domain>` and redeploy.

### GitHub Pages

A workflow is included at `.github/workflows/pages.yml`. It sets the base path and site URL automatically.

```bash
git init && git add -A && git commit -m "Portfolio"
gh repo create portfolio --public --source=. --push
gh api -X POST repos/Lakshya-Katewa/portfolio/pages -f build_type=workflow
```

The site appears at `https://lakshya-katewa.github.io/portfolio/`. Name the repo `Lakshya-Katewa.github.io` to serve it from the root instead.
