import Link from "next/link";
import { caseStudy } from "@/data/site";
import { availableScreenshots } from "@/lib/screenshots";
import { SectionHeading } from "./SectionHeading";
import { PhoneFrame } from "./PhoneFrame";
import { DecisionList, StackReceipt, flowSteps } from "./CaseStudyParts";
import { ArrowRight, ArrowUpRight } from "./Icons";

export function FeaturedWork() {
  const shots = availableScreenshots(caseStudy.screenshots);

  return (
    <section aria-labelledby="work" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading id="work" index="01" label={caseStudy.kicker} title={caseStudy.headline} intro={caseStudy.summary} />

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_15rem] md:gap-10 lg:grid-cols-[1fr_19rem] lg:gap-16">
        <div className="min-w-0">
          <p className="reveal border-l-2 border-accent pl-4 text-ink">
            <span className="label block pb-1">My role</span>
            {caseStudy.role}
          </p>

          <h3 className="label mt-12 text-ink">What I changed, and why</h3>
          <div className="mt-4">
            <DecisionList items={caseStudy.decisions.slice(0, 3)} headingLevel={4} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/work/${caseStudy.slug}/`} className="btn btn-primary">
              Read the full case study <ArrowRight />
            </Link>
            <a href={caseStudy.playStore} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              Google Play listing <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="space-y-8 md:sticky md:top-24 md:self-start">
          <PhoneFrame screenshot={shots[0]} steps={flowSteps} />
          <StackReceipt />
        </div>
      </div>
    </section>
  );
}
