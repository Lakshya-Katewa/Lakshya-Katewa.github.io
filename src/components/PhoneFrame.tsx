import Image from "next/image";
import type { Screenshot } from "@/data/site";
import { asset } from "@/lib/paths";

type Props = {
  screenshot?: Screenshot;
  /** Shown inside the frame when no screenshot exists yet. */
  steps: string[];
  priority?: boolean;
  className?: string;
};

/**
 * A CSS-only phone frame with a fixed aspect ratio, so swapping a
 * schematic for a real screenshot never shifts layout.
 */
export function PhoneFrame({ screenshot, steps, priority = false, className = "" }: Props) {
  return (
    <figure className={`mx-auto w-full max-w-[17rem] ${className}`}>
      <div className="relative rounded-[2.4rem] bg-phone p-[0.55rem] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/10">
        {/* screenshots are 9:16 captures; the schematic uses a modern 9:19.5 screen */}
        <div className={`relative overflow-hidden rounded-[1.9rem] bg-surface ${screenshot ? "aspect-[9/16]" : "aspect-[9/19.5]"}`}>
          {/* camera notch (the screenshots carry their own status bar) */}
          {screenshot ? null : (
            <div aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-phone" />
          )}
          {screenshot ? (
            <Image
              src={asset(`/screenshots/${screenshot.file}`)}
              alt={screenshot.alt}
              fill
              sizes="(min-width: 1024px) 17rem, 70vw"
              className="object-cover object-top"
              priority={priority}
            />
          ) : (
            <FlowSchematic steps={steps} />
          )}
        </div>
      </div>
      {screenshot ? (
        <figcaption className="label mt-4 text-center">{screenshot.caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** An honest stand-in: the app's real flow, drawn as a list, not a fake UI. */
function FlowSchematic({ steps }: { steps: string[] }) {
  return (
    <div className="flex h-full flex-col px-4 pb-5 pt-11">
      <p className="label text-ink">The order flow</p>
      <ol className="mt-4 flex flex-col gap-2">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 rounded-xl border border-rule bg-paper px-3 py-2.5 text-[0.8125rem] leading-tight text-ink"
          >
            <span className="font-mono text-[0.6875rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
            {step}
          </li>
        ))}
      </ol>
      <div className="mt-auto rounded-xl bg-ink px-3 py-3 text-paper">
        <p className="font-mono text-[0.625rem] uppercase tracking-wider opacity-70">Status</p>
        <p className="mt-1 text-[0.8125rem] leading-snug">Built in Flutter · Live on Google Play</p>
      </div>
      <div aria-hidden="true" className="mx-auto mt-4 h-1 w-24 rounded-full bg-rule-strong" />
    </div>
  );
}
