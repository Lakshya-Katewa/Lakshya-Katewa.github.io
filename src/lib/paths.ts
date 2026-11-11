/** Prefix a /public path with the deploy base path (needed for GitHub Pages project sites). */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
