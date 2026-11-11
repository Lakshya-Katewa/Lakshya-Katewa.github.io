import type { Metadata } from "next";
import Link from "next/link";
import { caseStudy } from "@/data/site";
import { availableScreenshots } from "@/lib/screenshots";
import { PhoneFrame } from "@/components/PhoneFrame";
import { DecisionList, StackReceipt, flowSteps } from "@/components/CaseStudyParts";
import { ArrowUpRight } from "@/components/Icons";

const description = `Case study: ${caseStudy.summary}`;

export const metadata: Metadata = {
  title: `${caseStudy.name} case study`,
  description,
  alternates: { canonical: `/work/${caseStudy.slug}/` },
  openGraph: { title: `${caseStudy.name} case study`, description, url: `/work/${caseStudy.slug}/` },
};

function Block({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="reveal border-t border-ink pt-3">
      <p className="label">{label}</p>
      <h2 id={id} className="mt-5 text-3xl leading-tight sm:text-4xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function CaseStudyPage() {
  const shots = availableScreenshots(caseStudy.screenshots);

  return (
    <article className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24">
      <nav aria-label="Breadcrumb" className="label">
        <Link href="/#work" className="link">
          ← All work
        </Link>
      </nav>

      <header className="mt-8 grid gap-12 lg:grid-cols-[1fr_19rem] lg:items-end lg:gap-16">
        <div>
          <p className="label">{caseStudy.kicker}</p>
          <h1 className="mt-5 text-[2.5rem] leading-[1.05] sm:text-6xl">
            {caseStudy.name}: {caseStudy.headline.toLowerCase()}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-2">
            {caseStudy.summary}
          </p>
          <p className="enter mt-6 max-w-2xl border-l-2 border-accent pl-4" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="label block pb-1">My role</span>
            {caseStudy.role}
          </p>
          <div className="enter mt-8" style={{ "--i": 2 } as React.CSSProperties}>
            <a href={caseStudy.playStore} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              View on Google Play <ArrowUpRight />
            </a>
          </div>
        </div>
        <PhoneFrame screenshot={shots[0]} steps={flowSteps} priority className="enter" />
      </header>

      <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_19rem] lg:gap-16">
        <div className="min-w-0 space-y-20">
          <Block id="problem" label="01 · The problem" title="Daily essentials, every morning">
            <div className="max-w-2xl space-y-4 text-lg text-ink-2">
              {caseStudy.problem.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
          </Block>

          <Block id="flows" label="02 · Screens & flows" title="What a customer does in the app">
            <ul className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
              {caseStudy.flows.map((f, i) => (
                <li key={f.title} className="bg-paper p-5">
                  <span className="font-mono text-xs text-accent" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-xl">{f.title}</h3>
                  <p className="mt-1 text-ink-2">{f.detail}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="decisions" label="03 · Frontend decisions" title="What I changed, and why">
            <DecisionList items={caseStudy.decisions} />
          </Block>

          {shots.length > 1 ? (
            <Block id="screens" label="04 · Screens" title="In the app">
              <ul className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
                {shots.map((s) => (
                  <li key={s.file} className="w-[70%] shrink-0 snap-center sm:w-auto">
                    <PhoneFrame screenshot={s} steps={flowSteps} />
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          <Block id="system" label={shots.length > 1 ? "05 · The system" : "04 · The system"} title="Part of a three-app system">
            <p className="max-w-2xl text-lg text-ink-2">
              The customer app shares a Firestore backend with an admin app and a delivery-partner app. I worked on both.
            </p>
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {caseStudy.related.map((r) => (
                <li key={r.name} className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr_auto] sm:items-baseline sm:gap-6">
                  <h3 className="text-xl">{r.name}</h3>
                  <p className="text-ink-2">{r.detail}</p>
                  <a href={r.repo} className="link inline-flex min-h-11 items-center gap-1 text-sm" target="_blank" rel="noopener noreferrer">
                    Source<span className="sr-only">: {r.name}</span> <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start" aria-label="Project facts">
          <StackReceipt />
          <div className="rounded-lg border border-rule p-5 text-sm">
            <p className="label text-ink">Links</p>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={caseStudy.playStore} className="link inline-flex min-h-11 items-center gap-1" target="_blank" rel="noopener noreferrer">
                  Google Play listing <ArrowUpRight />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Lakshya-Katewa/chinar_dairy_customer"
                  className="link inline-flex min-h-11 items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Customer app source <ArrowUpRight />
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
