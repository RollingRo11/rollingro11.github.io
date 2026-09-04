"use client";

// A watercolor of a network being read.
//
// Four columns of soft pigment blooms stand for layers of neurons; hair-thin
// ink lines flow between them along a vector field. One path through the
// network is traced in orange and its neuron is painted hotter than the
// rest: a circuit, picked out of the whole. Painted with p5.brush
// (standalone build, WebGL2).
//
// A fresh painting on every visit, fading in and sharpening once the library
// has loaded. Dark mode is a CSS inversion of the same canvas, so toggling
// never repaints.

import { useEffect, useRef } from "react";

type Brush = Record<string, any>;

// Start fetching the library as soon as this module is evaluated in the
// browser, so the chunk arrives while React is still hydrating instead of
// after it.
const brushModule: Promise<Brush> | null =
  typeof window !== "undefined" ? import("p5.brush/standalone") : null;

type Palette = { paper: string; ink: string; pigments: string[]; hot: string; boost: number };

// Chosen so the CSS inversion (invert + hue-rotate) lands the paper near the
// dark ground and turns the tints into chalky washes.
export const PALETTE: Palette = {
  paper: "#f2f1ee",
  ink: "#2b2d2b",
  pigments: ["#3d4b6e", "#6a7c98", "#7d8a78", "#b8a06a", "#8b6f8f"],
  hot: "#e2551c",
  boost: 1,
};

export function paint(brush: Brush, W: number, H: number, seed: number, pal: Palette) {
  const { paper: PAPER, ink: INK, pigments: PIGMENTS, hot: HOT } = pal;
  const op = (v: number) => Math.min(255, Math.round(v * pal.boost));
  const rnd = mulberry(seed);
  const between = (a: number, b: number) => a + (b - a) * rnd();
  const pickOne = <T,>(xs: T[]) => xs[Math.floor(rnd() * xs.length)];

  brush.seed(seed);
  brush.noiseSeed(seed * 7 + 1);
  brush.angleMode(brush.DEGREES);
  brush.clear(PAPER);
  brush.push();
  brush.translate(-W / 2, -H / 2);

  // --- layers of neurons ---------------------------------------------------
  const counts = [3, 5, 5, 3];
  const xs = [0.13, 0.38, 0.62, 0.87];
  const layers = counts.map((n, li) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n;
      return {
        x: W * xs[li] + between(-W * 0.03, W * 0.03),
        y: H * (0.16 + 0.68 * t) + between(-H * 0.05, H * 0.05),
        r: between(H * 0.055, H * 0.11),
        color: pickOne(PIGMENTS),
      };
    }),
  );

  // the circuit: one neuron per layer, chained
  const circuit = layers.map((layer) => Math.floor(rnd() * layer.length));

  // --- a broad pale wash behind everything ---------------------------------
  brush.noStroke();
  brush.fill(pickOne(PIGMENTS), op(14));
  brush.fillBleed(0.5, "out");
  brush.fillTexture(0.5, 0.3, false);
  const wx = W * between(0.3, 0.7);
  const wy = H * between(0.35, 0.65);
  brush.circle(wx, wy, Math.max(W, H) * between(0.22, 0.3));

  // --- connections --------------------------------------------------------
  brush.field("waves");
  brush.noFill();
  for (let li = 0; li < layers.length - 1; li++) {
    for (const a of layers[li]) {
      for (const b of layers[li + 1]) {
        if (rnd() < 0.45) continue;
        brush.set("HB", INK, between(0.35, 0.6));
        brush.line(a.x, a.y, b.x, b.y);
      }
    }
  }

  // the traced circuit, warmer and heavier
  for (let li = 0; li < layers.length - 1; li++) {
    const a = layers[li][circuit[li]];
    const b = layers[li + 1][circuit[li + 1]];
    brush.set("pen", HOT, 1.3);
    brush.line(a.x, a.y, b.x, b.y);
    brush.set("HB", HOT, 0.6);
    brush.line(a.x + between(-3, 3), a.y + between(-3, 3), b.x, b.y);
  }
  brush.noField();

  // --- neurons: pigment blooms ---------------------------------------------
  brush.noStroke();
  layers.forEach((layer, li) => {
    layer.forEach((n, i) => {
      const hot = circuit[li] === i;
      brush.fill(hot ? HOT : n.color, op(hot ? 160 : between(95, 140)));
      brush.fillBleed(between(0.2, 0.45), rnd() < 0.5 ? "out" : "in");
      brush.fillTexture(between(0.4, 0.8), between(0.3, 0.7));
      brush.circle(n.x, n.y, n.r, true);
      if (hot) {
        // a second, tighter bloom so the traced neuron glows
        brush.fill(HOT, op(90));
        brush.fillBleed(0.15, "in");
        brush.circle(n.x + between(-4, 4), n.y + between(-4, 4), n.r * 0.55, true);
      }
    });
  });

  // --- a few loose ink marks: the reading -----------------------------------
  brush.noFill();
  brush.wiggle(2);
  brush.set("2H", INK, 0.5);
  const target = layers[2][circuit[2]];
  brush.circle(target.x, target.y, target.r * 1.55);
  brush.set("2H", INK, 0.4);
  brush.line(target.x + target.r * 1.7, target.y, target.x + target.r * 2.6, target.y - target.r * 0.9);
  brush.noField();

  brush.pop();
  brush.render();
}

// Small deterministic PRNG so a seed always paints the same picture.
function mulberry(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Watercolor({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let brush: Brush | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let seed = Math.floor(Math.random() * 100000) + 1;
    let W = 0;
    let H = 0;

    const render = () => {
      if (!brush) return false;
      try {
        const t0 = performance.now();
        paint(brush, W, H, seed, PALETTE);
        if (process.env.NODE_ENV !== "production") {
          console.log(`watercolor painted in ${Math.round(performance.now() - t0)} ms`);
        }
        return true;
      } catch (err) {
        console.error("watercolor failed", err);
        return false;
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Paint, then dry in: the new picture fades up and sharpens.
    //
    // The paint blocks for ~100ms, so the browser never renders the blurred
    // starting state — which is exactly what a CSS transition needs to run
    // from, and why the load (fresh canvas, no prior style) animated while a
    // click did not. Web Animations takes the start value as a keyframe
    // instead, so both paths animate identically.
    const dryIn = () => {
      host.classList.add("plate__specimen--shown");
      if (reduced || !canvas) return;
      const timing = { duration: 700, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" };
      // Cancel first so rapid clicks restart the dry-in rather than stack.
      canvas.getAnimations().forEach((a) => a.cancel());
      host.getAnimations().forEach((a) => a.cancel());
      canvas.animate([{ opacity: 0 }, { opacity: 1 }], timing);
      host.animate([{ filter: "blur(8px)" }, { filter: "blur(0px)" }], timing);
    };

    const paintAndDry = () => {
      if (!brush) return;
      if (render()) dryIn();
    };

    const onClick = () => {
      seed = (seed * 31 + 7) % 100000;
      paintAndDry();
    };

    (brushModule ?? import("p5.brush/standalone"))
      .then((mod) => {
        if (cancelled) return;
        brush = mod;
        // One canvas for the life of the component: every WebGL canvas
        // costs a context, and browsers hand out only a few.
        const rect = host.getBoundingClientRect();
        W = Math.max(320, Math.round(rect.width));
        H = Math.max(200, Math.round(rect.height));
        canvas = brush.createCanvas(W, H, {
          parent: host,
          // 1.5 keeps the ink crisp on retina at half the pixel work of 2.
          pixelDensity: Math.min(window.devicePixelRatio || 1, 1.5),
        });
        if (canvas) {
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.style.display = "block";
        }
        // scaleBrushes multiplies the brush parameters in place, so it is
        // applied once here, never per paint.
        brush.scaleBrushes(Math.max(1.6, W / 420));

        paintAndDry();
      })
      .catch((err) => console.error("p5.brush failed to load", err));

    host.addEventListener("click", onClick);

    return () => {
      cancelled = true;
      host.removeEventListener("click", onClick);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
