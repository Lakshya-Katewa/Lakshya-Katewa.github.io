import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { SocialLinks } from "./SocialLinks";
import { Mail } from "./Icons";

const subject = encodeURIComponent("Frontend role: saw your portfolio");

export function Contact() {
  return (
    <section aria-labelledby="contact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        id="contact"
        index="05"
        label="Contact"
        title="Building something customers will use? Let’s talk."
        intro="Email is the fastest way to reach me."
      />
      <div className="reveal mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <a href={`mailto:${site.links.email}?subject=${subject}`} className="btn btn-primary self-start">
          <Mail /> Email me
        </a>
        <a href={`mailto:${site.links.email}`} className="link break-all font-mono text-sm">
          {site.links.email}
        </a>
      </div>
      <SocialLinks className="mt-6" />
    </section>
  );
}
