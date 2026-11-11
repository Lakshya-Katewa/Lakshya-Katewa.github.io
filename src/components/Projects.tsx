import { projects } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { ArrowUpRight } from "./Icons";

export function Projects() {
  return (
    <section aria-labelledby="projects" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading id="projects" index="02" label="Other projects" title="More things I’ve built" />
      <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-2">
        {projects.map((p) => (
          <li key={p.name} className="reveal flex flex-col bg-paper p-6 sm:p-7">
            <h3 className="text-2xl leading-tight">{p.name}</h3>
            <p className="mt-3 flex-1 text-ink-2">{p.outcome}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${p.name} stack`}>
              {p.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {p.demo ? (
                <a href={p.demo} className="link inline-flex min-h-11 items-center gap-1" target="_blank" rel="noopener noreferrer">
                  Live demo<span className="sr-only">: {p.name}</span> <ArrowUpRight />
                </a>
              ) : null}
              <a href={p.repo} className="link inline-flex min-h-11 items-center gap-1" target="_blank" rel="noopener noreferrer">
                Source<span className="sr-only">: {p.name}</span> <ArrowUpRight />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
