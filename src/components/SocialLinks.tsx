import { site } from "@/data/site";
import { GitHub, LinkedIn, Mail } from "./Icons";

type Props = { className?: string; style?: React.CSSProperties };

export function SocialLinks({ className = "", style }: Props) {
  const items = [
    { href: site.links.github, label: "GitHub", icon: <GitHub /> },
    // LinkedIn is hidden until a URL is set in src/data/site.ts
    site.links.linkedin ? { href: site.links.linkedin, label: "LinkedIn", icon: <LinkedIn /> } : null,
    { href: `mailto:${site.links.email}`, label: "Email", icon: <Mail /> },
  ].filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${className}`} style={style}>
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="inline-flex min-h-11 items-center gap-2 text-ink-2 transition-colors hover:text-accent"
            {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {item.icon}
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
