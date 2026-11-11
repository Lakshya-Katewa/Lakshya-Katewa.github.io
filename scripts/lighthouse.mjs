// Runs Lighthouse (mobile preset) on the built site and prints the scores.
// Usage: npm run build && npm run preview   (in one terminal)
//        npm run lighthouse                  (in another)
// Optional: LH_URL=http://localhost:4321 npm run lighthouse
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.LH_URL ?? "http://localhost:4321";
const pages = ["/", "/work/chinaragro/"];
const dir = mkdtempSync(join(tmpdir(), "lh-"));

for (const page of pages) {
  const out = join(dir, page.replaceAll("/", "_") + ".json");
  execFileSync(
    "npx",
    ["--yes", "lighthouse@12.8.2", base + page, "--quiet", "--chrome-flags=--headless=new", "--output=json", `--output-path=${out}`],
    { stdio: "inherit" },
  );
  const r = JSON.parse(readFileSync(out, "utf8"));
  const s = (k) => Math.round(r.categories[k].score * 100);
  const a = r.audits;
  console.log(
    `${page}  perf ${s("performance")} · a11y ${s("accessibility")} · best ${s("best-practices")} · seo ${s("seo")}` +
      `  |  LCP ${a["largest-contentful-paint"].displayValue} · CLS ${a["cumulative-layout-shift"].displayValue} · TBT ${a["total-blocking-time"].displayValue}`,
  );
}
