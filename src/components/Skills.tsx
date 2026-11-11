import { skills } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section aria-labelledby="skills" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading id="skills" index="03" label="Skills" title="What I work with" intro="Only what shows up in my own repos or my work." />
      <dl className="mt-12 divide-y divide-rule border-y border-rule">
        {skills.map((g) => (
          <div key={g.group} className="reveal grid gap-2 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
            <dt className="label pt-0.5 text-ink">{g.group}</dt>
            <dd className="text-ink-2">{g.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
