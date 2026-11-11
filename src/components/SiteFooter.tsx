import { buildNote, site } from "@/data/site";

export function SiteFooter() {
  const lh = buildNote.lighthouse;
  return (
    <footer className="mt-8 border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-xl">
          <h2 className="label text-ink">How this site is built</h2>
          <p className="mt-2 text-ink-2">{buildNote.summary}</p>
          {lh ? (
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-ink-2" aria-label="Lighthouse scores, mobile">
              {[
                ["Performance", lh.performance],
                ["Accessibility", lh.accessibility],
                ["Best practices", lh.bestPractices],
                ["SEO", lh.seo],
                ["LCP", lh.lcp],
                ["CLS", lh.cls],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-1.5">
                  <dt>{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {lh ? <p className="label mt-2">Lighthouse, mobile preset</p> : null}
        </div>
        <p className="label self-end">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
