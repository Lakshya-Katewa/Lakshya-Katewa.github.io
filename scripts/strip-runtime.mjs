// Post-build: remove the Next.js/React client runtime from the static export.
//
// Why: every component on this site is a Server Component rendered to plain
// HTML at build time. Nothing hydrates. The only client behaviour is the theme
// toggle, a ~1 KB inline script in <head>. The framework runtime (~180 KB
// gzipped JS + a ~100 KB inline RSC payload per page) would only power
// client-side route transitions between two pages, so it is dead weight on a
// recruiter's phone. Links still work as normal full-page navigations.
//
// Opt out: KEEP_NEXT_RUNTIME=1 npm run build
// If you ever add a "use client" component, set that flag (or delete this step).

import { readdirSync, readFileSync, writeFileSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

if (process.env.KEEP_NEXT_RUNTIME === "1") {
  console.log("strip-runtime: skipped (KEEP_NEXT_RUNTIME=1)");
  process.exit(0);
}

const OUT = "out";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(OUT);
let saved = 0;

for (const file of files) {
  if (file.endsWith(".html")) {
    const before = readFileSync(file, "utf8");
    const after = before
      // external framework chunks (any basePath)
      .replace(/<script\b[^>]*\bsrc="[^"]*\/_next\/static\/[^"]*"[^>]*><\/script>/g, "")
      // script preload hints for those chunks
      .replace(/<link\b[^>]*\bas="script"[^>]*\/?>/g, "")
      // inline RSC flight payload and bundler bootstrap
      .replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?(?:self\.__next_f|globalThis\["TURBOPACK"\])[\s\S]*?<\/script>/g, "");
    if (/_next\/static\/chunks\/[^"]*\.js/.test(after)) {
      throw new Error(`strip-runtime: a framework script survived in ${file}`);
    }
    saved += before.length - after.length;
    writeFileSync(file, after);
  } else if (/\/(?:index|__next\.[^/]*)\.txt$/.test(file) || /__next\.[^/]*\.txt$/.test(file)) {
    // RSC payloads for client navigation: unused without the runtime
    rmSync(file);
  }
}

console.log(`strip-runtime: removed ${(saved / 1024).toFixed(0)} KB of runtime markup from HTML`);
