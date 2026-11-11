// Bundles the hero 3D scene (three.js) into a standalone ES module in /public.
// Runs before `dev` and `build`. Kept separate from Next's bundle on purpose:
// it's loaded lazily, after first paint, by an inline loader in Hero.tsx.
import { build } from "esbuild";
import { statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";

const outfile = "public/three/hero-scene.js";
await build({
  entryPoints: ["src/three/hero-scene.ts"],
  outfile,
  bundle: true,
  format: "esm",
  minify: true,
  target: "es2020",
  legalComments: "none",
  treeShaking: true,
});
const raw = statSync(outfile).size;
const gz = gzipSync(readFileSync(outfile)).length;
console.log(`build-3d: ${outfile} ${(raw / 1024).toFixed(0)} KB (${(gz / 1024).toFixed(0)} KB gzipped)`);
