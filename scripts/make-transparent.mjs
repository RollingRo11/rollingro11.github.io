// Strips the white paper background out of figure images so they sit on the
// site's own background in either theme.
//
// This is not a chroma key. Figures like these are already a composite over
// white:
//
//     C = a*F + (1 - a)*255
//
// Assuming the foreground ink is fully saturated somewhere in each pixel (true
// for matplotlib output, paper figures, and line art), the background's
// contribution is exactly the pixel's minimum channel:
//
//     a = 255 - min(R,G,B)
//     F = 255 * (C - min) / a
//
// Recompositing the result over white reproduces the source pixel-for-pixel,
// so antialiased edges stay smooth instead of picking up the halo a threshold
// key would leave behind. Light tints become partly transparent, which is what
// lets the paper — or the dark ground — show through.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = "public";
const BACKUP_DIR = path.join("image-originals", "pre-transparency");

// Full-bleed artwork has no paper to remove — keying it would eat the image.
const SKIP = new Set(["external/quanta-manifold-lede.webp", "title.png", "favicon.svg"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

// Below ~7% opacity the recovered hue is noise, not signal.
const FLATTEN_BELOW = 18;

function unmultiplyFromWhite(data, channels) {
  const pixels = data.length / channels;
  const out = Buffer.alloc(pixels * 4);

  for (let i = 0; i < pixels; i++) {
    const s = i * channels;
    const d = i * 4;
    const r = data[s];
    const g = data[s + 1];
    const b = data[s + 2];
    const srcAlpha = channels === 4 ? data[s + 3] : 255;

    const min = Math.min(r, g, b);
    const alpha = 255 - min;

    if (alpha === 0) {
      out[d] = out[d + 1] = out[d + 2] = out[d + 3] = 0;
      continue;
    }

    // Dividing by a tiny alpha amplifies the source's own compression noise
    // into wild colors. They're invisible at that opacity but they wreck the
    // encoder's ratio, so flatten near-transparent pixels to neutral ink.
    if (alpha < FLATTEN_BELOW) {
      out[d] = out[d + 1] = out[d + 2] = 0;
      out[d + 3] = Math.round((alpha * srcAlpha) / 255);
      continue;
    }

    out[d] = Math.min(255, Math.round((255 * (r - min)) / alpha));
    out[d + 1] = Math.min(255, Math.round((255 * (g - min)) / alpha));
    out[d + 2] = Math.min(255, Math.round((255 * (b - min)) / alpha));
    // Respect any alpha the source already carried.
    out[d + 3] = Math.round((alpha * srcAlpha) / 255);
  }

  return out;
}

const format = process.argv.includes("--webp") ? "webp" : "png";

const targets = walk(PUBLIC_DIR)
  .filter((f) => /\.(avif|webp|png|jpe?g)$/i.test(f))
  .filter((f) => !SKIP.has(path.relative(PUBLIC_DIR, f)));

let totalBefore = 0;
let totalAfter = 0;

for (const file of targets) {
  const rel = path.relative(PUBLIC_DIR, file);
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const rgba = unmultiplyFromWhite(data, info.channels);

  const image = sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });

  const outPath = path.join(PUBLIC_DIR, rel.replace(/\.[^.]+$/, `.${format}`));
  const buffer =
    format === "webp"
      ? await image.webp({ quality: 92, alphaQuality: 100, effort: 6 }).toBuffer()
      : await image.png({ compressionLevel: 9, palette: false }).toBuffer();

  // Keep the source safe before anything is replaced.
  const backupPath = path.join(BACKUP_DIR, rel);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  if (!fs.existsSync(backupPath)) fs.copyFileSync(file, backupPath);

  fs.writeFileSync(outPath, buffer);
  if (outPath !== file) fs.rmSync(file);

  const before = fs.statSync(backupPath).size;
  const after = buffer.length;
  totalBefore += before;
  totalAfter += after;

  const kb = (n) => `${(n / 1024).toFixed(0)}kB`;
  console.log(`${rel.padEnd(50)} ${kb(before).padStart(7)} -> ${kb(after).padStart(7)}`);
}

console.log(
  `\n${targets.length} images  ${(totalBefore / 1024).toFixed(0)}kB -> ${(totalAfter / 1024).toFixed(0)}kB`,
);
