import Link from "next/link";
import { site } from "@/data/site";
import { ThemeIcon } from "./Icons";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-paper">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-lg leading-none tracking-tight">
          <span className="sm:hidden">
            LK<span className="text-accent">.</span>
            <span className="sr-only"> {site.name}, home</span>
          </span>
          <span className="hidden sm:inline">
            {site.name}
            <span className="text-accent">.</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <ul className="flex items-center">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-2.5 py-2 text-sm text-ink-2 transition-colors hover:text-ink sm:px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            id="theme-toggle"
            type="button"
            aria-label="Toggle colour theme"
            className="ml-1 grid size-11 place-items-center rounded-full text-ink-2 transition-colors hover:bg-accent-soft hover:text-ink"
          >
            <ThemeIcon />
          </button>
        </nav>
      </div>
    </header>
  );
}
