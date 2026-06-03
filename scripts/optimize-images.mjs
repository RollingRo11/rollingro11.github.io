// Optimize the images served on the blog and repoint the markdown at them.
//
// Static export disables Next's image optimizer (next.config.mjs:
// images.unoptimized + output:'export'), so optimization has to happen here, at
// author time. This script:
//   1. backs up any local original it modifies into image-originals/ (gitignored),
//   2. resizes + re-encodes the local /simplex/*.png plots to WebP,
//   3. downloads the external (arxiv / quanta / s3) images, optimizing rasters
//      to WebP and keeping SVGs as-is, into public/external/,
//   4. repoints the rkathuria.com references at the copies already in public/,
//   5. rewrites the URLs in content/blog/*.md.
//
// Idempotent: re-running skips work that's already done. Run with `npm run
// optimize-images`.

import sharp from "sharp";
import { mkdir, copyFile, writeFile, readFile, readdir, stat, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const BACKUP = path.join(ROOT, "image-originals");
const CONTENT = path.join(ROOT, "content", "blog");

const MAX_WIDTH = 1600; // generous for a ~720px column at 2x DPI
const QUALITY = 80;

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let savedBefore = 0;
let savedAfter = 0;

// old markdown reference -> new local reference. Filled in as we process.
const rewrites = new Map();

async function backup(absPath) {
  const rel = path.relative(PUBLIC, absPath);
  const dest = path.join(BACKUP, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  if (!existsSync(dest)) await copyFile(absPath, dest);
}

// (1) Local simplex PNG plots -> WebP, originals backed up then removed.
const LOCAL_PNGS = [
  "/simplex/mess3/overview.png",
  "/simplex/mess3/belief_geometry.png",
  "/simplex/training/loss.png",
  "/simplex/belief/recovery_by_state.png",
  "/simplex/belief/component_posterior.png",
  "/simplex/belief/concat/probe_cosine_similarity.png",
  "/simplex/pca/combined_geometry.png",
];

async function processLocalPngs() {
  for (const ref of LOCAL_PNGS) {
    const src = path.join(PUBLIC, ref.replace(/^\//, ""));
    const out = src.replace(/\.png$/i, ".webp");
    const newRef = ref.replace(/\.png$/i, ".webp");
    rewrites.set(ref, newRef);
    if (!existsSync(src)) {
      console.warn(`  ! missing ${ref} — skipping`);
      continue;
    }
    const before = (await stat(src)).size;
    await backup(src);
    await sharp(src).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
    const after = (await stat(out)).size;
    await unlink(src); // superseded; recoverable from image-originals/ + git
    savedBefore += before;
    savedAfter += after;
    console.log(`  ${ref}  ${kb(before)} -> ${kb(after)} webp`);
  }
}

// (2) rkathuria.com refs whose files already live in public/ — just localize.
const ALREADY_LOCAL = {
  "https://rkathuria.com/resid.avif": "/resid.avif",
  "https://rkathuria.com/subspaces.avif": "/subspaces.avif",
  "https://rkathuria.com/stream_superposition_diagram.svg": "/stream_superposition_diagram.svg",
};

function processAlreadyLocal() {
  for (const [url, local] of Object.entries(ALREADY_LOCAL)) {
    const abs = path.join(PUBLIC, local.replace(/^\//, ""));
    if (!existsSync(abs)) {
      console.warn(`  ! ${local} not in public/ — leaving ${url} as-is`);
      continue;
    }
    rewrites.set(url, local);
    console.log(`  ${url}  ->  ${local} (already local)`);
  }
}

// (3) External images -> downloaded + optimized into public/external/.
const EXTERNAL = [
  { url: "https://arxiv.org/html/2510.24256v2/x1.png", out: "arxiv-2510.24256-x1.webp" },
  { url: "https://research-posts.s3.amazonaws.com/kfac/task-spectrum.png", out: "kfac-task-spectrum.webp" },
  { url: "https://arxiv.org/html/2409.19606v3/x5.png", out: "arxiv-2409.19606-x5.webp" },
  { url: "https://arxiv.org/html/2409.19606v3/x6.png", out: "arxiv-2409.19606-x6.webp" },
  { url: "https://arxiv.org/html/2512.24880v2/x1.png", out: "arxiv-2512.24880-x1.webp" },
  { url: "https://www.quantamagazine.org/wp-content/uploads/2025/11/What-is-a-Manifold-cr-Mark-Belan-Lede-2.webp", out: "quanta-manifold-lede.webp" },
  { url: "https://www.quantamagazine.org/wp-content/uploads/2025/11/What_Is_A_Manifold-crMarkBelan-Desktopv2.svg", out: "quanta-manifold-diagram.svg" },
];

async function processExternal() {
  const dir = path.join(PUBLIC, "external");
  await mkdir(dir, { recursive: true });
  for (const { url, out } of EXTERNAL) {
    const dest = path.join(dir, out);
    const newRef = `/external/${out}`;
    rewrites.set(url, newRef);
    if (existsSync(dest)) {
      console.log(`  ${out} already present — skipping download`);
      continue;
    }
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! fetch ${url} -> ${res.status}; leaving reference unchanged`);
      rewrites.delete(url);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const before = buf.length;
    if (out.endsWith(".svg")) {
      await writeFile(dest, buf); // vector — ship as-is
      console.log(`  ${url}  ${kb(before)} svg (kept)`);
      continue;
    }
    await sharp(buf).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(dest);
    const after = (await stat(dest)).size;
    savedBefore += before;
    savedAfter += after;
    console.log(`  ${url}  ${kb(before)} -> ${kb(after)} webp`);
  }
}

async function rewriteMarkdown() {
  const files = (await readdir(CONTENT)).filter((f) => f.endsWith(".md"));
  for (const f of files) {
    const p = path.join(CONTENT, f);
    let text = await readFile(p, "utf8");
    let n = 0;
    for (const [from, to] of rewrites) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        n++;
      }
    }
    if (n) {
      await writeFile(p, text);
      console.log(`  ${f}: ${n} reference(s) rewritten`);
    }
  }
}

console.log("\n1. Local simplex PNGs -> WebP");
await processLocalPngs();
console.log("\n2. rkathuria.com refs -> already-local files");
processAlreadyLocal();
console.log("\n3. External images -> public/external/");
await processExternal();
console.log("\n4. Rewriting markdown references");
await rewriteMarkdown();

console.log(`\nDone. Optimized payload: ${kb(savedBefore)} -> ${kb(savedAfter)} (${savedBefore ? Math.round((1 - savedAfter / savedBefore) * 100) : 0}% smaller).`);
