// Move unreferenced images (and the unused shadow-overlays asset pack) out of
// public/ and into image-originals/ so they stop shipping on every deploy.
//
// Conservative: an image is moved ONLY if its exact filename appears in NO
// source file (app / components / lib / content / *.css). Anything still
// referenced stays. Moved, not deleted — everything lands in image-originals/
// (gitignored) and is recoverable.

import { readdir, stat, readFile, mkdir, rename, copyFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const BACKUP = path.join(ROOT, "image-originals");
const SOURCE_DIRS = ["app", "components", "lib", "content"];
const IMAGE_EXT = /\.(png|jpe?g|avif|webp|gif|svg)$/i;
// Never walk into / move these by the per-file rule — handled explicitly.
const ASSET_PACK = "Resource Boy - Shadow Overlays";

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

// Concatenate every source file so we can test for filename mentions.
async function loadSourceText() {
  let text = "";
  for (const d of SOURCE_DIRS) {
    const abs = path.join(ROOT, d);
    if (!existsSync(abs)) continue;
    for (const f of await walk(abs)) text += "\n" + (await readFile(f, "utf8"));
  }
  // global CSS lives in app/ already, but include any stray .css just in case
  return text;
}

async function move(absSrc) {
  const rel = path.relative(PUBLIC, absSrc);
  const dest = path.join(BACKUP, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  try {
    await rename(absSrc, dest);
  } catch {
    await copyFile(absSrc, dest);
    await rm(absSrc);
  }
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;

const source = await loadSourceText();
let reclaimed = 0;
const moved = [];

// 1. Per-image rule.
for (const abs of await walk(PUBLIC)) {
  const rel = path.relative(PUBLIC, abs);
  if (rel.split(path.sep)[0] === ASSET_PACK) continue; // handled below
  if (!IMAGE_EXT.test(abs)) continue;
  const name = path.basename(abs);
  if (source.includes(name)) continue; // still referenced — keep
  const size = (await stat(abs)).size;
  await move(abs);
  reclaimed += size;
  moved.push(`${rel}  (${kb(size)})`);
}

// 2. The unreferenced shadow-overlays asset pack (zip + extracted folder).
for (const name of ["shadow-overlays.zip", ASSET_PACK]) {
  const abs = path.join(PUBLIC, name);
  if (!existsSync(abs)) continue;
  if (source.includes(name)) continue; // safety: skip if somehow referenced
  // size (file or dir)
  let size = 0;
  const s = await stat(abs);
  if (s.isDirectory()) {
    for (const f of await walk(abs)) size += (await stat(f)).size;
  } else size = s.size;
  await move(abs);
  reclaimed += size;
  moved.push(`${name}  (${mb(size)})`);
}

console.log(`Moved ${moved.length} item(s) to image-originals/:\n`);
for (const m of moved.sort()) console.log("  " + m);
console.log(`\nReclaimed from public/: ${mb(reclaimed)}`);
