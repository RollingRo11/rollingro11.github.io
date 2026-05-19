"use client";

import { useEffect, useRef } from "react";
import { useCustomTheme } from "@/components/custom-theme-provider";
import { STARS } from "@/lib/stars";
import { CONSTELLATIONS } from "@/lib/constellations";
import { BOSTON_LAT, BOSTON_LON, altAzContext, altAzWith } from "@/lib/astro";

// Live Boston sky, dark-mode only.
// Stereographic projection from the zenith (zenith = viewport center, horizon = inscribed ring).
// requestAnimationFrame syncs to the display refresh rate natively (60 / 120 / 144 Hz, etc.),
// so the loop is uncapped. To keep that smooth on high-refresh displays, the expensive part
// (per-vertex alt/az) is cached and only recomputed ~5x/sec — sidereal drift in 200 ms is ~0.04°,
// imperceptible — while twinkle and hover update every frame.

type ProjStar = { x: number; y: number; size: number; baseAlpha: number; seed: number };
type ProjSeg = { x1: number; y1: number; x2: number; y2: number };
type ProjCon = {
  name: string;
  cx: number;
  cy: number;
  labelVisible: boolean;
  segs: ProjSeg[];
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
};

const HOVER_RADIUS_PX = 28;
const REPROJECT_INTERVAL_MS = 200;

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useCustomTheme();
  const isDark = colorMode === "dark";

  useEffect(() => {
    if (!isDark) return;
    const c = canvasRef.current;
    if (!c) return;
    const g = c.getContext("2d");
    if (!g) return;

    let width = 0;
    let height = 0;
    let radius = 0;
    let centerX = 0;
    let centerY = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let stars: ProjStar[] = [];
    let cons: ProjCon[] = [];
    let lastProjectMs = -Infinity;

    let mouseX = -1;
    let mouseY = -1;

    // Resolve next/font CSS variables to their actual font-family strings —
    // ctx.font doesn't always resolve `var(...)` so we substitute the resolved value.
    const bodyStyle = getComputedStyle(document.body);
    const serifFont =
      (bodyStyle.getPropertyValue("--font-crimson-pro").trim() || "Georgia") + ", Georgia, serif";
    const monoFont =
      (bodyStyle.getPropertyValue("--font-departure-mono").trim() || "ui-monospace") +
      ", ui-monospace, monospace";

    // Per-line glyph-tight rects. A Range over a block element returns its
    // line-box width (full column) — to get the actual rendered text bounds,
    // walk to the text nodes and take their per-line client rects.
    //
    // Stored in *document* coordinates so we can recompute viewport rects each
    // frame by simple subtraction of scrollX/scrollY — never call
    // `getClientRects` during scroll. The DOM walk only runs on real layout
    // changes (initial mount, resize, font load, content edit).
    type Rect = { left: number; top: number; right: number; bottom: number };
    let cachedDocRects: Rect[] = [];
    let maskRectsStale = true;
    const invalidateMaskRects = () => {
      maskRectsStale = true;
    };

    const computeDocRects = (): Rect[] => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      const els = document.querySelectorAll<HTMLElement>("[data-sky-mask]");
      const rects: Rect[] = [];
      const range = document.createRange();
      for (const el of els) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          if (!(node.nodeValue ?? "").trim()) continue;
          range.selectNodeContents(node);
          const clientRects = range.getClientRects();
          for (let i = 0; i < clientRects.length; i++) {
            const r = clientRects[i];
            if (r.width === 0 || r.height === 0) continue;
            rects.push({
              left: r.left + sx,
              top: r.top + sy,
              right: r.right + sx,
              bottom: r.bottom + sy,
            });
          }
        }
      }
      return rects;
    };
    const ensureMaskRects = () => {
      if (maskRectsStale) {
        cachedDocRects = computeDocRects();
        maskRectsStale = false;
      }
    };

    const project = (alt: number, az: number): [number, number] => {
      const zenithAngleRad = ((90 - alt) * Math.PI) / 180;
      const r = radius * Math.tan(zenithAngleRad / 2);
      const azRad = (az * Math.PI) / 180;
      return [centerX + r * Math.sin(azRad), centerY - r * Math.cos(azRad)];
    };

    const reproject = (now: Date) => {
      const acx = altAzContext(now, BOSTON_LAT, BOSTON_LON);

      // Stars
      const ns: ProjStar[] = [];
      for (let i = 0; i < STARS.length; i++) {
        const [ra, dec, mag] = STARS[i];
        const { alt, az } = altAzWith(acx, ra, dec);
        if (alt <= 0) continue;
        const [x, y] = project(alt, az);
        const brightness = Math.max(0, 5.2 - mag) / 6.2;
        ns.push({
          x,
          y,
          size: 0.45 + brightness * 1.9,
          baseAlpha: 0.1 + brightness * 0.65,
          seed: i * 0.137,
        });
      }
      stars = ns;

      // Constellations
      const nc: ProjCon[] = [];
      for (const con of CONSTELLATIONS) {
        const segs: ProjSeg[] = [];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const seg of con.segments) {
          let prev: [number, number, boolean] | null = null;
          for (const [ra, dec] of seg) {
            const { alt, az } = altAzWith(acx, ra, dec);
            const visible = alt > 0;
            const [x, y] = project(Math.max(alt, 0), az);
            if (prev && prev[2] && visible) {
              segs.push({ x1: prev[0], y1: prev[1], x2: x, y2: y });
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
              if (prev[0] < minX) minX = prev[0];
              if (prev[1] < minY) minY = prev[1];
              if (prev[0] > maxX) maxX = prev[0];
              if (prev[1] > maxY) maxY = prev[1];
            }
            prev = [x, y, visible];
          }
        }
        const { alt: calt, az: caz } = altAzWith(acx, con.center[0], con.center[1]);
        const [cx, cy] = project(Math.max(calt, 0), caz);
        nc.push({
          name: con.name,
          cx,
          cy,
          labelVisible: calt > 5 && segs.length > 0,
          segs,
          bbox: { minX, minY, maxX, maxY },
        });
      }
      cons = nc;
    };

    // Distance from point (px, py) to segment s.
    const pointSegDist = (px: number, py: number, s: ProjSeg): number => {
      const dx = s.x2 - s.x1;
      const dy = s.y2 - s.y1;
      const lenSq = dx * dx + dy * dy;
      let t = lenSq > 0 ? ((px - s.x1) * dx + (py - s.y1) * dy) / lenSq : 0;
      t = Math.max(0, Math.min(1, t));
      const cx = s.x1 + t * dx;
      const cy = s.y1 + t * dy;
      const ex = px - cx;
      const ey = py - cy;
      return Math.sqrt(ex * ex + ey * ey);
    };

    const findHovered = (): ProjCon | null => {
      if (mouseX < 0 || mouseY < 0) return null;
      // Suppress hover when the cursor is inside any tight text rect, but
      // expanded vertically so the small gaps between consecutive lines /
      // paragraphs are also dead zones. Horizontal bounds stay tight to the
      // actual glyphs — constellations to the right of short text remain
      // hoverable.
      const HOVER_PAD_X = 4;
      const HOVER_PAD_Y = 22;
      const mDocX = mouseX + window.scrollX;
      const mDocY = mouseY + window.scrollY;
      for (let i = 0; i < cachedDocRects.length; i++) {
        const r = cachedDocRects[i];
        if (
          mDocX >= r.left - HOVER_PAD_X &&
          mDocX <= r.right + HOVER_PAD_X &&
          mDocY >= r.top - HOVER_PAD_Y &&
          mDocY <= r.bottom + HOVER_PAD_Y
        ) {
          return null;
        }
      }
      let best: ProjCon | null = null;
      let bestDist = HOVER_RADIUS_PX;
      for (const con of cons) {
        if (con.segs.length === 0) continue;
        const b = con.bbox;
        if (
          mouseX < b.minX - HOVER_RADIUS_PX ||
          mouseX > b.maxX + HOVER_RADIUS_PX ||
          mouseY < b.minY - HOVER_RADIUS_PX ||
          mouseY > b.maxY + HOVER_RADIUS_PX
        ) continue;
        for (const s of con.segs) {
          const d = pointSegDist(mouseX, mouseY, s);
          if (d < bestDist) {
            bestDist = d;
            best = con;
          }
        }
      }
      return best;
    };

    const resize = () => {
      const rect = c.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(width * dpr);
      c.height = Math.floor(height * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.max(width, height) * 0.72;
      centerX = width / 2;
      centerY = height / 2;
      reproject(new Date());
      lastProjectMs = performance.now();
      invalidateMaskRects();
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onLeave = () => {
      mouseX = -1;
      mouseY = -1;
    };

    let raf = 0;
    const frame = (t: number) => {
      if (t - lastProjectMs > REPROJECT_INTERVAL_MS) {
        reproject(new Date());
        lastProjectMs = t;
      }

      const hovered = findHovered();
      ensureMaskRects();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      g.clearRect(0, 0, width, height);

      // Horizon ring
      g.save();
      g.globalAlpha = 0.18;
      g.strokeStyle = "#8a8b95";
      g.lineWidth = 1;
      g.setLineDash([2, 4]);
      g.beginPath();
      g.arc(centerX, centerY, radius, 0, Math.PI * 2);
      g.stroke();
      g.setLineDash([]);
      g.restore();

      // Cardinals — anchored to viewport edges so they're always visible.
      // (The actual horizon ring is larger than the viewport in stereographic projection,
      // so this is a readable proxy for "where N/E/S/W lie".)
      g.save();
      g.globalAlpha = 0.7;
      g.fillStyle = "#d4d6e0";
      g.font = `18px ${monoFont}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      const edgePad = 26;
      g.fillText("N", centerX, edgePad);
      g.fillText("S", centerX, height - edgePad);
      g.fillText("E", width - edgePad, centerY);
      g.fillText("W", edgePad, centerY);
      g.restore();

      // Constellation lines — draw unhovered first, hovered on top so it crisply overlays.
      g.save();
      g.lineCap = "round";
      g.strokeStyle = "#9aa0b5";
      g.lineWidth = 0.7;
      g.globalAlpha = 0.13;
      g.beginPath();
      for (const con of cons) {
        if (con === hovered) continue;
        for (const s of con.segs) {
          g.moveTo(s.x1, s.y1);
          g.lineTo(s.x2, s.y2);
        }
      }
      g.stroke();
      if (hovered) {
        // Outer glow
        g.strokeStyle = "rgba(170, 240, 200, 0.18)";
        g.lineWidth = 4;
        g.globalAlpha = 1;
        g.beginPath();
        for (const s of hovered.segs) {
          g.moveTo(s.x1, s.y1);
          g.lineTo(s.x2, s.y2);
        }
        g.stroke();
        // Bright core
        g.strokeStyle = "#dde6f5";
        g.lineWidth = 1.2;
        g.globalAlpha = 0.95;
        g.beginPath();
        for (const s of hovered.segs) {
          g.moveTo(s.x1, s.y1);
          g.lineTo(s.x2, s.y2);
        }
        g.stroke();
      }
      g.restore();

      // Stars
      g.save();
      g.fillStyle = "#e8eaf0";
      const time = t / 1000;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const tw = 1 + 0.16 * Math.sin(time + s.seed * 7.3);
        const a = Math.max(0, Math.min(1, s.baseAlpha * tw));
        g.globalAlpha = a;
        g.beginPath();
        g.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        g.fill();
        if (s.size > 1.4) {
          g.globalAlpha = a * 0.2;
          g.beginPath();
          g.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.restore();

      // Constellation labels (Crimson Pro italic, like a classical star atlas).
      g.save();
      g.font = `italic 13px ${serifFont}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      for (const con of cons) {
        if (!con.labelVisible) continue;
        // Hide labels falling inside any masked text section. Doc-coord rects
        // are compared in doc space (label position + scroll offset).
        const dx = con.cx + scrollX;
        const dy = con.cy + scrollY;
        let inMask = false;
        for (let i = 0; i < cachedDocRects.length; i++) {
          const r = cachedDocRects[i];
          if (dx >= r.left && dx <= r.right && dy >= r.top && dy <= r.bottom) {
            inMask = true;
            break;
          }
        }
        if (inMask) continue;
        const isHovered = con === hovered;
        if (isHovered) {
          g.fillStyle = "#e8f5ec";
          g.globalAlpha = 1;
          g.shadowColor = "rgba(170, 240, 200, 0.6)";
          g.shadowBlur = 8;
        } else {
          g.fillStyle = "#bdc1d1";
          g.globalAlpha = 0.32;
          g.shadowBlur = 0;
        }
        g.fillText(con.name, con.cx, con.cy);
      }
      g.restore();

      // Soft-edged "holes" punched through the canvas — one per text section.
      // CRITICAL perf note: all rectangles go into a single Path2D and we
      // `fill()` once under `filter: blur(...)`. Earlier we called `fillRect`
      // per rect, which triggered a Gaussian blur shader pass *per rect*; with
      // 30–50 text-line rects that saturated the GPU and made everything feel
      // sluggish. One fill = one blur pass.
      if (cachedDocRects.length > 0) {
        const padX = 4;
        const padY = 6;
        g.save();
        g.filter = "blur(18px)";
        // Semi-opaque dark overlay drawn on top of the stars. The alpha here
        // controls how much of the sky shows through behind the text.
        g.fillStyle = "rgba(34, 33, 41, 1)";
        g.beginPath();
        for (let i = 0; i < cachedDocRects.length; i++) {
          const r = cachedDocRects[i];
          g.rect(
            r.left - scrollX - padX,
            r.top - scrollY - padY,
            r.right - r.left + padX * 2,
            r.bottom - r.top + padY * 2,
          );
        }
        g.fill();
        g.restore();
      }

      // Caption — Departure Mono, low-opacity, bottom-right. UTC clock ticks
      // every frame so the "@" timestamp is genuinely live.
      {
        const now = new Date();
        const hh = String(now.getUTCHours()).padStart(2, "0");
        const mm = String(now.getUTCMinutes()).padStart(2, "0");
        const ss = String(now.getUTCSeconds()).padStart(2, "0");
        g.save();
        g.font = `14px ${monoFont}`;
        g.fillStyle = "#bdc1d1";
        g.globalAlpha = 0.5;
        g.textAlign = "right";
        g.textBaseline = "bottom";
        g.fillText(
          `Night sky over Boston, Massachusetts @ ${hh}:${mm}:${ss} UTC`,
          width - 28,
          height - 20,
        );
        g.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(c);
    // Body ResizeObserver catches the only events that can move text rects
    // *without* a scroll: viewport resize, font load, content edits. Scroll
    // itself doesn't invalidate — `getMaskRects` re-translates doc coords by
    // the current scroll offset every frame, so no DOM work happens on scroll.
    const docRo = new ResizeObserver(invalidateMaskRects);
    docRo.observe(document.body);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      docRo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [isDark]);

  if (!isDark) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
