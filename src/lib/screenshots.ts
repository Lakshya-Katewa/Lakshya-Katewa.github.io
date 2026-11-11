import fs from "node:fs";
import path from "node:path";
import type { Screenshot } from "@/data/site";

/**
 * Runs at build time only (Server Component). Returns the screenshots that
 * actually exist in /public/screenshots, so the layout works with none,
 * some or all of them present. Add a file and rebuild to show it.
 */
export function availableScreenshots(list: Screenshot[]): Screenshot[] {
  const dir = path.join(process.cwd(), "public", "screenshots");
  return list.filter((s) => fs.existsSync(path.join(dir, s.file)));
}
