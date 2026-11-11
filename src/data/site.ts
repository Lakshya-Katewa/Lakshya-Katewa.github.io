/**
 * All site content lives here. Edit this file to update text, projects,
 * links and skills. Layout components only read from it.
 *
 * Honesty rule for this file: every claim below is either verified from
 * the GitHub repos / resume, or marked with a `TODO` for Lakshya to confirm.
 */

export const site = {
  name: "Lakshya Katewa",
  // Deployed URL (used for canonical links, Open Graph and the sitemap).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakshya-katewa.github.io",
  title: "Lakshya Katewa | Frontend developer",
  description:
    "Frontend developer at IIT Kanpur. I ship interfaces real customers use, most recently the ChinarAgro dairy-delivery app on Google Play.",
  role: "Frontend developer",
  tagline: "I build fast, careful interfaces for real customers.",
  intro:
    "Most recently: the ChinarAgro customer app, a dairy-delivery app live on Google Play, where I worked on the parts that have to be right: payments, the wallet, onboarding and the order flow.",
  resume: "/resume.pdf",
  links: {
    github: "https://github.com/Lakshya-Katewa",
    linkedin: "https://www.linkedin.com/in/lakshya-katewa-73344a295/",
    email: "lakshyak23@iitk.ac.in",
  },
} as const;

/** Small at-a-glance summary in the hero, styled like an order slip. */
export const slip: { label: string; value: string }[] = [
  { label: "Shipped", value: "ChinarAgro app · Google Play" },
  { label: "Stack", value: "Flutter · Firebase · Razorpay · React" },
  { label: "Studying", value: "B.S. Economic Sciences, IIT Kanpur" },
  { label: "Looking for", value: "Frontend developer roles" },
];

/* ------------------------------------------------------------------ */
/* Featured case study                                                 */
/* ------------------------------------------------------------------ */

export type Screenshot = {
  /** File name expected in /public/screenshots/ */
  file: string;
  alt: string;
  caption: string;
};

export const caseStudy = {
  slug: "chinaragro",
  name: "ChinarAgro",
  kicker: "Featured work · Live on Google Play",
  headline: "A dairy-delivery app that people pay through",
  summary:
    "ChinarAgro is the customer app for a dairy business (China Dairy / Chinar Dairy): sign in with a phone number, pick your area, order milk once or on a subscription, pay by card/UPI or wallet, and track the order to your door.",
  // TODO: confirm this wording. Git history shows a collaborator (sandeep14k)
  // wrote the first version of the customer app; your commits (Apr–Jun 2026)
  // rework 30 files and take it to the Play Store release. The resume also
  // lists the Admin App as built by you.
  role: "Freelance mobile developer. I took the customer app from a working first version (written by a collaborator) to its Play Store release, and built the admin app.",
  // TODO: resume says Apr '25 – May '25, but the customer-app commits are
  // Apr–Jun 2026. Confirm the dates before showing them.
  period: "",
  playStore: "https://play.google.com/store/apps/details?id=com.chinaragro.app",
  problem: [
    "Daily essentials are a repeat purchase. A customer orders milk most mornings, often on a cheap phone and a patchy connection, and expects the right quantity at the right door before breakfast.",
    "That makes the boring parts the important ones: sign-in has to be quick, the wallet balance has to be right, a payment must never be charged or credited twice, and the address has to be accurate without making sign-up a chore.",
  ],
  flows: [
    { title: "Phone OTP sign-in", detail: "Firebase phone authentication with a 6-digit code entry screen." },
    { title: "Area & address", detail: "Delivery-zone selection, saved addresses and a map pin (OpenStreetMap + device location)." },
    { title: "Browse & product detail", detail: "Category chips, banners, product cards with ‘buy once’ or ‘subscribe’." },
    { title: "Cart & checkout", detail: "Half-litre quantities, delivery address, order summary." },
    { title: "Payments & wallet", detail: "Razorpay checkout or wallet balance; wallet top-ups and history." },
    { title: "Orders & subscriptions", detail: "Order history, invoices, recurring subscriptions, low-balance notifications." },
  ],
  decisions: [
    {
      title: "Payments that can’t double-charge or double-credit",
      body: "The place-order button locks on the first tap, so a double tap can’t fire two orders. A wallet top-up first checks whether that Razorpay payment ID has already been recorded, then updates the balance and writes the transaction log in one atomic batch. A blocking progress dialog stays up while the write runs, and if Razorpay reports an error, no wallet code runs at all.",
      tags: ["Idempotency", "Atomic writes", "Loading states"],
    },
    {
      title: "Onboarding without the GPS wall",
      body: "Sign-up used to ask for a GPS address before you could see a single product. I removed it: new users get a placeholder address, and the real delivery address from their first order replaces it and is saved for next time. A failed reverse-geocode no longer blocks the form.",
      tags: ["Form UX", "Progressive disclosure"],
    },
    {
      title: "State that matches the server",
      body: "State lives in one Provider per domain (auth, cart, orders, wallet, addresses, subscriptions). I fixed a bug where the payment screen showed a ₹0.00 balance if you hadn’t opened the wallet first: the balance now loads as the screen opens, and the cart refreshes it after a top-up before checking whether you can pay.",
      tags: ["Provider", "Stale state"],
    },
    {
      title: "Tolerant of real-world data",
      body: "Areas were filtered with a Firestore query on an `isActive` field that older documents didn’t have, so they disappeared. Filtering now happens on the client. Quantities are stored as decimals so customers can order half a litre. Payments enforce Razorpay’s ₹1 minimum and allow one retry.",
      tags: ["Defensive UI", "Data modelling"],
    },
    {
      title: "Layouts that survive small screens",
      body: "I rebuilt the product card and grid with fixed-height cells so text and buttons stop overflowing on narrow phones. Bottom sheets now scroll instead of clipping, and banner images are letterboxed instead of cropped. I also built the rebrand to ChinarAgro and the animated splash screen.",
      tags: ["Responsive layout", "Visual polish"],
    },
  ],
  stack: [
    { label: "UI", value: "Flutter (Dart), Material 3" },
    { label: "State", value: "Provider" },
    { label: "Auth", value: "Firebase phone OTP" },
    { label: "Data", value: "Cloud Firestore, Firebase Storage" },
    { label: "Payments", value: "Razorpay Flutter SDK" },
    { label: "Maps", value: "flutter_map, Geolocator" },
    { label: "Notifications", value: "Firebase Cloud Messaging" },
  ],
  // The site checks /public/screenshots/ at build time and only shows the
  // ones that exist. Without any, the phone frame shows a schematic.
  screenshots: [
    {
      file: "app-home.webp",
      alt: "ChinarAgro home screen: greeting with delivery pincode, service-area banner, product search, category chips and a refer-and-earn card",
      caption: "Home & browse",
    },
    {
      file: "app-subscriptions.webp",
      alt: "ChinarAgro subscriptions screen listing milk subscriptions with active and cancelled status badges and progress bars",
      caption: "Subscriptions",
    },
    {
      file: "app-orders.webp",
      alt: "ChinarAgro orders screen showing delivered orders with delivery time and total paid (address blurred)",
      caption: "Orders & delivery",
    },
  ] satisfies Screenshot[],
  related: [
    {
      name: "Admin app",
      detail: "Product pricing, inventory, order processing and delivery assignment on Firestore. Flutter with Riverpod and go_router.",
      repo: "https://github.com/Lakshya-Katewa/chinar_admin",
    },
    {
      name: "Delivery-partner app",
      detail: "Fixes to pending orders, subscription delivery numbers and unpaid-earnings tracking.",
      repo: "https://github.com/Lakshya-Katewa/Chinar_delivery_partner",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Other projects                                                      */
/* ------------------------------------------------------------------ */

export type Project = {
  name: string;
  outcome: string;
  stack: string[];
  repo: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    name: "FINN: investor briefings",
    outcome:
      "A mobile-first investor app with an attention feed, portfolio and research view that cites the exact source quote and PDF page. The frontend has no build step, and headless Chrome found no horizontal overflow at 320, 390 or 430px.",
    stack: ["JavaScript", "HTML/CSS", "FastAPI", "Groq LLMs"],
    repo: "https://github.com/Lakshya-Katewa/enam-assignment",
    demo: "https://finn-investor-agent-2mvk.onrender.com",
  },
  {
    name: "Fuel route planner",
    outcome:
      "An API that plans the cheapest fuel stops for any US road trip. It makes one routing call per new route, serves repeat requests from cache in about 2 ms, and has 103 offline tests.",
    stack: ["Python", "Django", "OpenStreetMap", "GeoJSON"],
    repo: "https://github.com/Lakshya-Katewa/spotter-assignment",
  },
  {
    name: "In-memory key-value store",
    outcome:
      "A Redis-like store in C++ with O(1) average operations, key expiry using std::chrono, and file persistence that survives restarts.",
    stack: ["C++", "OOP", "STL"],
    repo: "https://github.com/Lakshya-Katewa/In-Memory-Redis-like-Key-Value-Store",
  },
  {
    name: "Inventory & order management",
    outcome:
      "Products, stock and orders in C++ on MySQL, with database transactions so stock stays consistent while orders are placed.",
    stack: ["C++", "MySQL", "SQL"],
    repo: "https://github.com/Lakshya-Katewa/Inventory-Order-Management-System",
  },
];

/* ------------------------------------------------------------------ */
/* Skills (from repos + resume)                                        */
/* ------------------------------------------------------------------ */

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Dart", "JavaScript", "Python", "C++", "SQL"] },
  // TODO: add TypeScript / Tailwind CSS here only if you have used them in your own work.
  { group: "Frontend & mobile", items: ["Flutter", "React", "Next.js", "Provider", "Riverpod"] },
  { group: "Backend & data", items: ["Firebase Auth", "Cloud Firestore", "Node.js", "Express", "MongoDB", "Redis", "Django", "FastAPI"] },
  { group: "Tooling", items: ["Git", "GitHub", "Docker", "Razorpay", "Firebase Storage"] },
];

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const about = {
  // Set to null to hide the photo. Replace the file with a clearer, well-lit
  // head-and-shoulders shot when you have one (3:4, at least 480×640).
  photo: { src: "/images/lakshya.webp", alt: "Portrait of Lakshya Katewa", width: 420, height: 560 } as null | {
    src: string; alt: string; width: number; height: number;
  },
  paragraphs: [
    "I’m an undergraduate at IIT Kanpur, studying Economic Sciences, and I build software for people who will actually use it. The work I care most about is unglamorous: making a payment screen impossible to double-tap, getting a sign-up form out of the way, making a layout hold together on a small, inexpensive phone.",
    "Economics shapes how I build. I think about what a customer is trying to get done and what it costs them in time and attention, then I try to make the interface cost less.",
    "I’m looking for a frontend developer role on a team that ships to real customers and cares how the product feels.",
  ],
  education: {
    degree: "B.S. Economic Sciences",
    school: "Indian Institute of Technology Kanpur",
    years: "2023 – present",
  },
  experience: [
    { role: "Backend developer", org: "EleWin", period: "Apr – Jul 2026", note: "REST APIs for aptitude tests on Node.js, Express and MongoDB, with Redis caching." },
    { role: "Freelance mobile developer", org: "ChinarAgro", period: "", note: "Customer, admin and delivery-partner apps in Flutter on Firebase." },
  ],
};

/* ------------------------------------------------------------------ */
/* Footer: how this site is built                                      */
/* ------------------------------------------------------------------ */

export const buildNote = {
  summary:
    "Next.js App Router and Tailwind CSS, statically exported, with the unused React runtime stripped after build. The hero's 3D scene is three.js, loaded only after the page's largest paint; it renders on demand and stops when idle. Two self-hosted fonts, inlined CSS, and motion that respects reduced-motion settings.",
  // Measured with Lighthouse 12.8 (mobile preset) against the live site
  // (lakshya-katewa.github.io) on 2026-11-11, home page, two runs.
  // Re-run `LH_URL=https://lakshya-katewa.github.io npm run lighthouse` after
  // changes and update these. Set to null to hide the scores.
  lighthouse: { performance: "97–99", accessibility: 100, bestPractices: 100, seo: 100, lcp: "1.1–1.3 s", cls: "0" } as null | {
    performance: number | string; accessibility: number; bestPractices: number; seo: number; lcp: string; cls: string;
  },
};
