import Image from "next/image";
import { about } from "@/data/site";
import { asset } from "@/lib/paths";
import { SectionHeading } from "./SectionHeading";

export function About() {
  const photo = about.photo;
  return (
    <section aria-labelledby="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading id="about" index="04" label="About" title="A bit about me" />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="reveal order-2 max-w-2xl space-y-5 text-lg text-ink-2 lg:order-1">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className="order-1 space-y-8 lg:order-2">
          {photo ? (
            <figure className="reveal w-40 sm:w-48 lg:w-full lg:max-w-[16rem]">
              {/* photo mounted like a print: thin frame, mono caption */}
              <div className="rotate-[-1.5deg] rounded-md border border-rule bg-surface p-2 pb-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:rotate-0 motion-reduce:rotate-0 motion-reduce:transition-none">
                <Image
                  src={asset(photo.src)}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 16rem, 12rem"
                  className="h-auto w-full rounded-sm"
                />
                <figcaption className="label mt-2.5 text-center">Lakshya Katewa</figcaption>
              </div>
            </figure>
          ) : null}

          <div className="hidden lg:block">
            <AboutFacts />
          </div>
        </div>

        <div className="order-3 lg:hidden">
          <AboutFacts />
        </div>
      </div>
    </section>
  );
}

function AboutFacts() {
  return (
    <div className="reveal space-y-8">
      <div>
        <h3 className="label text-ink">Education</h3>
        <p className="mt-3 font-display text-xl">{about.education.degree}</p>
        <p className="text-ink-2">{about.education.school}</p>
        <p className="label mt-1">{about.education.years}</p>
      </div>
      <div>
        <h3 className="label text-ink">Experience</h3>
        <ul className="mt-3 space-y-4">
          {about.experience.map((e) => (
            <li key={e.org}>
              <p className="font-display text-xl">
                {e.role}, {e.org}
              </p>
              {e.period ? <p className="label mt-0.5">{e.period}</p> : null}
              <p className="mt-1 text-sm text-ink-2">{e.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
