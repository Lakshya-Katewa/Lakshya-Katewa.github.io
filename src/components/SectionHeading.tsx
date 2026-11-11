type Props = {
  id: string;
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
};

/** Section opener: a ruled line with a mono index, like a receipt line item. */
export function SectionHeading({ id, index, label, title, intro }: Props) {
  return (
    <div className="reveal">
      <div className="flex items-center gap-3 border-t border-ink pt-3">
        <span className="label text-ink">{index}</span>
        <span className="label">{label}</span>
      </div>
      <h2 id={id} className="mt-6 scroll-mt-16 max-w-3xl text-[2rem] leading-[1.1] sm:text-5xl">
        {title}
      </h2>
      {intro ? <p className="mt-4 max-w-2xl text-lg text-ink-2">{intro}</p> : null}
    </div>
  );
}
