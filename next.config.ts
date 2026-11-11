import type { NextConfig } from "next";

// Fully static site: `next build` writes plain HTML/CSS/JS to `out/`,
// which deploys as-is to Vercel, GitHub Pages or any static host.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves /path/ as /path/index.html
  trailingSlash: true,
  basePath,
  experimental: {
    // Tailwind output is ~7 KB gzipped: inlining it removes the render-blocking
    // stylesheet request, which matters most for first-time visitors (recruiters).
    inlineCss: true,
  },
  images: {
    // Static export has no image server. Screenshots are pre-sized
    // PNG/WebP files in /public, rendered with explicit dimensions.
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
