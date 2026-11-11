import { caseStudy } from "@/data/site";

type Decision = (typeof caseStudy.decisions)[number];

/** Numbered engineering decisions, each a line item with tags. */
export function DecisionList({ items, headingLevel = 3 }: { items: Decision[]; headingLevel?: 3 | 4 }) {
  const H = `h${headingLevel}` as "h3" | "h4";
  return (
    <ol className="divide-y divide-rule border-y border-rule">
      {items.map((d, i) => (
        <li key={d.title} className="reveal grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-4">
          <span className="font-mono text-sm text-accent" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <H className="text-xl leading-snug sm:text-2xl">{d.title}</H>
            <p className="mt-2 text-ink-2">{d.body}</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Topics">
              {d.tags.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The stack, printed like a receipt. */
export function StackReceipt() {
  return (
    <div className="rounded-lg border border-rule bg-surface p-5">
      <p className="label text-ink">Stack</p>
      <dl className="mt-4 space-y-2.5 text-sm">
        {caseStudy.stack.map((row) => (
          <div key={row.label} className="leader">
            <dt className="label shrink-0">{row.label}</dt>
            <dd className="min-w-0 text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export const flowSteps = ["Phone OTP sign-in", "Choose your area", "Browse products", "Cart · ½ L steps", "Pay or use wallet", "Track the order"];
