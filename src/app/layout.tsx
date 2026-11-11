import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

// Self-hosted at build time by next/font; one weight each keeps the payload small.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
  variable: "--font-fraunces",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.links.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#13120f" },
  ],
};

/*
 * Runs before first paint: applies a saved theme choice (no flash) and wires
 * the toggle button. No React hydration needed for any of it.
 */
const themeScript = `(function(){var d=document.documentElement,k='theme';try{var s=localStorage.getItem(k);if(s==='light'||s==='dark')d.setAttribute('data-theme',s)}catch(e){}
function cur(){var a=d.getAttribute('data-theme');return a||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}
function sync(b){var t=cur();b.setAttribute('aria-pressed',String(t==='dark'));b.setAttribute('aria-label',t==='dark'?'Switch to light theme':'Switch to dark theme')}
document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('theme-toggle');if(b)sync(b)});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#theme-toggle');if(!b)return;var n=cur()==='dark'?'light':'dark';d.setAttribute('data-theme',n);try{localStorage.setItem(k,n)}catch(_){}sync(b)})})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
