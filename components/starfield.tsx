"use client";

import { useEffect, useRef } from "react";
import { useCustomTheme } from "@/components/custom-theme-provider";
import { STARS } from "@/lib/stars";
import { CONSTELLATIONS } from "@/lib/constellations";
import { BOSTON_LAT, BOSTON_LON, altAzContext, altAzWith } from "@/lib/astro";

// Live Boston sky, dark-mode only.
//
// Performance architecture
// ────────────────────────
// The hot path is composed almost entirely of cheap `drawImage` calls; the
// expensive sub-passes are pre-rendered to offscreen canvases that only
// rebuild on real change.
//
//   layerStatic   horizon + faint constellation lines     → on resize / reproject
//   layerStars    star glyphs at current twinkle alpha    → ~10 Hz
//   layerDocMask  text-anchored blurred mask (doc coords) → on layout change
//   layerVpMask   cardinals + caption blurred mask        → on resize
//   starSprites   pre-rasterised '.', '+', '*' glyphs     → on resize / dpr
//
// Per-frame, we composite these layers + the (cheap) hover-overlay strokes
// + the (cheap) cardinals/caption text on top. The Gaussian blur (`filter:
// blur(18px)`) is never on the per-frame path — that was the previous big
// cost.
//
// Adaptive frame rate
// ───────────────────
// The rAF loop is gated by a throttle: ACTIVE_FRAME_MS (~30 Hz) when a
// hover transition is in flight or the cursor moved recently, IDLE_FRAME_MS
// (1 Hz) otherwise. Idle 1 Hz still keeps the UTC caption clock live.
//
// Reproject window
// ────────────────
// Bumped to 2 s. Sidereal drift in 2 s is ~0.5° — visually indistinguishable
// — and the cost of the per-frame reprojection was substantial.

type ProjStar = { x: number; y: number; sizeBucket: 0 | 1 | 2; baseAlpha: number; seed: number };
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
const REPROJECT_INTERVAL_MS = 2000;
const TWINKLE_INTERVAL_MS = 100;
const IDLE_FRAME_MS = 1000;
const ACTIVE_FRAME_MS = 33;
const ACTIVITY_TIMEOUT_MS = 250;
const STAR_SPRITE_SIZE = 18;
const FADE_TAU_MS = 220;

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
    // Cap at 4 so heavy zoom on retina (e.g. 200% on a 2× display = effective 4)
    // still gets crisp star sprites — at 2 the glyphs visibly pixelated.
    let dpr = Math.min(window.devicePixelRatio || 1, 4);
    let isMobile = false;

    let stars: ProjStar[] = [];
    let cons: ProjCon[] = [];

    // Per-constellation hover fade progress (0 = invisible, 1 = fully revealed).
    // Keyed by name so values survive reprojection (which rebuilds `cons` from
    // scratch). Time-based exponential lerp so duration is consistent across
    // browsers with different effective frame rates.
    const hoverProgress = new Map<string, number>();

    // Timing
    let lastFrameMs = -1;
    let lastDrawnMs = -Infinity;
    let lastProjectMs = -Infinity;
    let lastStarLayerMs = -Infinity;
    let lastMouseMoveMs = -Infinity;

    let mouseX = -1;
    let mouseY = -1;

    // Resolve next/font CSS variables to their actual font-family strings.
    const bodyStyle = getComputedStyle(document.body);
    const serifFont =
      (bodyStyle.getPropertyValue("--font-crimson-pro").trim() || "Georgia") + ", Georgia, serif";
    const monoFont =
      (bodyStyle.getPropertyValue("--font-departure-mono").trim() || "ui-monospace") +
      ", ui-monospace, monospace";

    // ── Mask rect cache ───────────────────────────────────────────────────
    // Per-line glyph-tight rects. A Range over a block element returns its
    // line-box width (full column); to get the actual rendered text bounds,
    // we walk to text nodes and take their per-line client rects. Stored in
    // *document* coordinates so scroll never triggers a DOM walk — the doc
    // mask is rendered once on layout change and blitted at scroll offset.
    type Rect = { left: number; top: number; right: number; bottom: number };
    let cachedDocRects: Rect[] = [];
    let maskRectsStale = true;
    let docMaskDirty = true;
    let docMaskHeight = 0;
    const invalidateMaskRects = () => {
      maskRectsStale = true;
      docMaskDirty = true;
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

    // ── Offscreen layers ──────────────────────────────────────────────────
    const layerStatic = document.createElement("canvas");
    const lgStatic = layerStatic.getContext("2d")!;
    const layerStars = document.createElement("canvas");
    const lgStars = layerStars.getContext("2d")!;
    const layerDocMask = document.createElement("canvas");
    const lgDocMask = layerDocMask.getContext("2d")!;
    const layerVpMask = document.createElement("canvas");
    const lgVpMask = layerVpMask.getContext("2d")!;

    // Pre-rasterised star glyph sprites — 3 buckets by magnitude.
    // `drawImage(sprite)` is ~5–10× faster than `fillText`.
    let starSprites: HTMLCanvasElement[] = [];
    const buildStarSprites = () => {
      starSprites = [];
      const glyphs = [".", "+", "*"];
      for (const glyph of glyphs) {
        const sc = document.createElement("canvas");
        sc.width = sc.height = STAR_SPRITE_SIZE * dpr;
        const sg = sc.getContext("2d")!;
        sg.scale(dpr, dpr);
        sg.fillStyle = "#e8eaf0";
        sg.font = `14px ${monoFont}`;
        sg.textAlign = "center";
        sg.textBaseline = "middle";
        sg.fillText(glyph, STAR_SPRITE_SIZE / 2, STAR_SPRITE_SIZE / 2);
        starSprites.push(sc);
      }
    };

    const renderStaticLayer = () => {
      layerStatic.width = Math.floor(width * dpr);
      layerStatic.height = Math.floor(height * dpr);
      lgStatic.setTransform(dpr, 0, 0, dpr, 0, 0);
      lgStatic.clearRect(0, 0, width, height);

      // Horizon ring
      lgStatic.save();
      lgStatic.globalAlpha = 0.18;
      lgStatic.strokeStyle = "#8a8b95";
      lgStatic.lineWidth = 1;
      lgStatic.setLineDash([2, 4]);
      lgStatic.beginPath();
      lgStatic.arc(centerX, centerY, radius, 0, Math.PI * 2);
      lgStatic.stroke();
      lgStatic.restore();

      // Default faint constellation lines — batched stroke.
      lgStatic.save();
      lgStatic.lineCap = "round";
      lgStatic.strokeStyle = "#9aa0b5";
      lgStatic.lineWidth = 0.7;
      lgStatic.globalAlpha = 0.13;
      lgStatic.beginPath();
      for (const con of cons) {
        for (const s of con.segs) {
          lgStatic.moveTo(s.x1, s.y1);
          lgStatic.lineTo(s.x2, s.y2);
        }
      }
      lgStatic.stroke();
      lgStatic.restore();
    };

    const renderStarsLayer = (t: number) => {
      layerStars.width = Math.floor(width * dpr);
      layerStars.height = Math.floor(height * dpr);
      lgStars.setTransform(dpr, 0, 0, dpr, 0, 0);
      lgStars.clearRect(0, 0, width, height);

      const half = STAR_SPRITE_SIZE / 2;
      const time = t / 1000;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const tw = 1 + 0.16 * Math.sin(time + s.seed * 7.3);
        const a = s.baseAlpha * tw;
        lgStars.globalAlpha = a < 0 ? 0 : a > 1 ? 1 : a;
        lgStars.drawImage(
          starSprites[s.sizeBucket],
          s.x - half,
          s.y - half,
          STAR_SPRITE_SIZE,
          STAR_SPRITE_SIZE,
        );
      }
    };

    const renderDocMaskLayer = () => {
      if (cachedDocRects.length === 0) {
        layerDocMask.width = 0;
        layerDocMask.height = 0;
        docMaskHeight = 0;
        return;
      }
      let maxBottom = 0;
      for (let i = 0; i < cachedDocRects.length; i++) {
        if (cachedDocRects[i].bottom > maxBottom) maxBottom = cachedDocRects[i].bottom;
      }
      const maskHeight = maxBottom + 80;
      docMaskHeight = maskHeight;
      layerDocMask.width = Math.floor(width * dpr);
      layerDocMask.height = Math.floor(maskHeight * dpr);
      lgDocMask.setTransform(dpr, 0, 0, dpr, 0, 0);
      lgDocMask.clearRect(0, 0, width, maskHeight);

      const padX = 4;
      const padY = 6;
      lgDocMask.save();
      lgDocMask.filter = "blur(18px)";
      lgDocMask.fillStyle = "rgba(34, 33, 41, 1)";
      lgDocMask.beginPath();
      for (let i = 0; i < cachedDocRects.length; i++) {
        const r = cachedDocRects[i];
        lgDocMask.rect(
          r.left - padX,
          r.top - padY,
          r.right - r.left + padX * 2,
          r.bottom - r.top + padY * 2,
        );
      }
      lgDocMask.fill();
      lgDocMask.restore();
    };

    let vpMaskBuiltForWidth = -1;
    const renderVpMaskLayer = (captionSize: number, bottomPad: number, captionWidth: number) => {
      layerVpMask.width = Math.floor(width * dpr);
      layerVpMask.height = Math.floor(height * dpr);
      lgVpMask.setTransform(dpr, 0, 0, dpr, 0, 0);
      lgVpMask.clearRect(0, 0, width, height);

      lgVpMask.save();
      lgVpMask.filter = "blur(18px)";
      lgVpMask.fillStyle = "rgba(34, 33, 41, 1)";
      lgVpMask.beginPath();

      const edgePad = 26;
      const cardinalFontSize = 18;
      if (!isMobile) {
        const cardW = cardinalFontSize * 0.85;
        const cardH = cardinalFontSize;
        const cPadX = 6;
        const cPadY = 6;
        lgVpMask.rect(centerX - cardW / 2 - cPadX, edgePad - cardH / 2 - cPadY, cardW + cPadX * 2, cardH + cPadY * 2);
        lgVpMask.rect(width - edgePad - cardW / 2 - cPadX, centerY - cardH / 2 - cPadY, cardW + cPadX * 2, cardH + cPadY * 2);
        lgVpMask.rect(edgePad - cardW / 2 - cPadX, centerY - cardH / 2 - cPadY, cardW + cPadX * 2, cardH + cPadY * 2);
      }

      const capPadX = 8;
      const capPadY = 6;
      lgVpMask.rect(
        centerX - captionWidth / 2 - capPadX,
        height - bottomPad - captionSize - capPadY,
        captionWidth + capPadX * 2,
        captionSize + capPadY * 2,
      );

      lgVpMask.fill();
      lgVpMask.restore();
    };

    // ── Astro / projection ────────────────────────────────────────────────
    const project = (alt: number, az: number): [number, number] => {
      const zenithAngleRad = ((90 - alt) * Math.PI) / 180;
      const r = radius * Math.tan(zenithAngleRad / 2);
      const azRad = (az * Math.PI) / 180;
      return [centerX + r * Math.sin(azRad), centerY - r * Math.cos(azRad)];
    };

    const reproject = (now: Date) => {
      const acx = altAzContext(now, BOSTON_LAT, BOSTON_LON);

      const ns: ProjStar[] = [];
      for (let i = 0; i < STARS.length; i++) {
        const [ra, dec, mag] = STARS[i];
        const { alt, az } = altAzWith(acx, ra, dec);
        if (alt <= 0) continue;
        const [x, y] = project(alt, az);
        const brightness = Math.max(0, 5.2 - mag) / 6.2;
        const size = 0.45 + brightness * 1.9;
        const sizeBucket: 0 | 1 | 2 = size > 1.6 ? 2 : size > 1.0 ? 1 : 0;
        ns.push({
          x,
          y,
          sizeBucket,
          baseAlpha: 0.1 + brightness * 0.65,
          seed: i * 0.137,
        });
      }
      stars = ns;

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

    const pointSegDist = (px: number, py: number, s: ProjSeg): number => {
      const dx = s.x2 - s.x1;
      const dy = s.y2 - s.y1;
      const lenSq = dx * dx + dy * dy;
      let t2 = lenSq > 0 ? ((px - s.x1) * dx + (py - s.y1) * dy) / lenSq : 0;
      t2 = Math.max(0, Math.min(1, t2));
      const cx = s.x1 + t2 * dx;
      const cy = s.y1 + t2 * dy;
      const ex = px - cx;
      const ey = py - cy;
      return Math.sqrt(ex * ex + ey * ey);
    };

    const findHovered = (): ProjCon | null => {
      if (mouseX < 0 || mouseY < 0) return null;
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
      dpr = Math.min(window.devicePixelRatio || 1, 4);
      c.width = Math.floor(width * dpr);
      c.height = Math.floor(height * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.max(width, height) * 0.72;
      centerX = width / 2;
      centerY = height / 2;
      isMobile = width < 640;
      buildStarSprites();
      reproject(new Date());
      const nowMs = performance.now();
      lastProjectMs = nowMs;
      lastStarLayerMs = -Infinity;
      renderStaticLayer();
      invalidateMaskRects();
      vpMaskBuiltForWidth = -1;
      // Paint the canvas synchronously — without this, the main canvas is
      // empty until the first rAF runs, which can lag on theme toggle.
      compose(nowMs, null);
      lastDrawnMs = nowMs;
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMouseMoveMs = performance.now();
    };
    const onLeave = () => {
      mouseX = -1;
      mouseY = -1;
    };

    // Composition step — extracted so it can be called synchronously from
    // resize() to paint the canvas on mount (otherwise the main canvas is
    // blank until the first rAF, which can lag noticeably on theme toggle
    // when the `dark` class is being applied and styles re-flow).
    const compose = (t: number, hovered: ProjCon | null) => {
      ensureMaskRects();

      // Stars layer regen at twinkle cadence — independent of frame rate.
      if (t - lastStarLayerMs > TWINKLE_INTERVAL_MS) {
        renderStarsLayer(t);
        lastStarLayerMs = t;
      }

      // Hover-progress lerp, wall-clock-based.
      const hoveredName = hovered ? hovered.name : null;
      const dtMs = lastFrameMs < 0 ? 16 : Math.min(100, t - lastFrameMs);
      lastFrameMs = t;
      const lerpFactor = 1 - Math.exp(-dtMs / FADE_TAU_MS);
      for (const con of cons) {
        const target = con.name === hoveredName ? 1 : 0;
        const current = hoverProgress.get(con.name) ?? 0;
        const next = current + (target - current) * lerpFactor;
        hoverProgress.set(con.name, next);
      }

      // Caption + viewport-mask geometry. Caption width is essentially constant
      // (mono font, fixed character count), so vp-mask is rebuilt only on
      // viewport-width changes.
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, "0");
      const mm = String(now.getUTCMinutes()).padStart(2, "0");
      const ss = String(now.getUTCSeconds()).padStart(2, "0");
      const captionText = `Night sky over Boston, Massachusetts @ ${hh}:${mm}:${ss} UTC`;
      const captionSize = Math.max(9, Math.min(14, width / 36));
      const bottomPad = Math.max(12, Math.min(20, width / 50));
      const edgePad = 26;
      const cardinalFontSize = 18;

      if (vpMaskBuiltForWidth !== width) {
        g.save();
        g.font = `${captionSize}px ${monoFont}`;
        const cw = g.measureText(captionText).width;
        g.restore();
        renderVpMaskLayer(captionSize, bottomPad, cw);
        vpMaskBuiltForWidth = width;
      }

      if (docMaskDirty) {
        renderDocMaskLayer();
        docMaskDirty = false;
      }

      // ── Compose main canvas ─────────────────────────────────────────────
      g.clearRect(0, 0, width, height);

      // Static layer (horizon + faint lines).
      if (layerStatic.width > 0) {
        g.drawImage(layerStatic, 0, 0, width, height);
      }

      // Stars.
      if (layerStars.width > 0) {
        g.drawImage(layerStars, 0, 0, width, height);
      }

      // Hover overlay — only for constellations with progress above threshold.
      g.save();
      g.lineCap = "round";
      for (const con of cons) {
        const p = hoverProgress.get(con.name) ?? 0;
        if (p < 0.01) continue;
        g.strokeStyle = `rgba(170, 240, 200, ${0.18 * p})`;
        g.lineWidth = 4;
        g.globalAlpha = 1;
        g.beginPath();
        for (const s of con.segs) {
          g.moveTo(s.x1, s.y1);
          g.lineTo(s.x2, s.y2);
        }
        g.stroke();
        g.strokeStyle = "#dde6f5";
        g.lineWidth = 1.2;
        g.globalAlpha = 0.95 * p;
        g.beginPath();
        for (const s of con.segs) {
          g.moveTo(s.x1, s.y1);
          g.lineTo(s.x2, s.y2);
        }
        g.stroke();
      }
      g.restore();

      // Constellation labels — fade in with hover. Safari quirk: alpha is
      // baked into rgba() of fill + shadow color, and shadowBlur is held
      // constant (only shadowColor's alpha fades). Both `globalAlpha` on
      // fillText and a ramping shadowBlur cause Safari to "pop".
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      g.save();
      g.font = `13px ${serifFont}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.shadowBlur = 8;
      for (const con of cons) {
        if (!con.labelVisible) continue;
        const p = hoverProgress.get(con.name) ?? 0;
        if (p < 0.01) continue;
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
        g.fillStyle = `rgba(232, 245, 236, ${p})`;
        g.shadowColor = `rgba(170, 240, 200, ${0.6 * p})`;
        g.fillText(con.name, con.cx, con.cy);
      }
      g.restore();

      // Doc-anchored mask — blit visible portion (scroll-translated).
      if (layerDocMask.width > 0 && docMaskHeight > 0) {
        const srcTop = scrollY;
        const srcBottom = Math.min(scrollY + height, docMaskHeight);
        if (srcBottom > srcTop) {
          g.drawImage(
            layerDocMask,
            0,
            srcTop * dpr,
            layerDocMask.width,
            (srcBottom - srcTop) * dpr,
            0,
            0,
            width,
            srcBottom - srcTop,
          );
        }
      }

      // Viewport-anchored mask (cardinals + caption areas).
      if (layerVpMask.width > 0) {
        g.drawImage(layerVpMask, 0, 0, width, height);
      }

      // Cardinals on top of the mask.
      if (!isMobile) {
        g.save();
        g.globalAlpha = 0.7;
        g.fillStyle = "#d4d6e0";
        g.font = `${cardinalFontSize}px ${monoFont}`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText("N", centerX, edgePad);
        g.fillText("E", width - edgePad, centerY);
        g.fillText("W", edgePad, centerY);
        g.restore();
      }

      // Caption on top of the mask.
      g.save();
      g.font = `${captionSize}px ${monoFont}`;
      g.fillStyle = "#bdc1d1";
      g.globalAlpha = 0.5;
      g.textAlign = "center";
      g.textBaseline = "bottom";
      g.fillText(captionText, centerX, height - bottomPad);
      g.restore();
    };

    // rAF loop — adaptive throttle. Skips compose when nothing is animating.
    let raf = 0;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);

      // Sky reprojection — slow drift, runs every 2 s.
      const needReproject = t - lastProjectMs > REPROJECT_INTERVAL_MS;
      if (needReproject) {
        reproject(new Date());
        lastProjectMs = t;
        renderStaticLayer();
        lastStarLayerMs = -Infinity; // force stars regen
      }

      const hovered = findHovered();

      // Activity gate — skip the whole render if nothing's happening.
      const hoveredName = hovered ? hovered.name : null;
      let inTransition = false;
      for (const con of cons) {
        const target = con.name === hoveredName ? 1 : 0;
        const current = hoverProgress.get(con.name) ?? 0;
        if (Math.abs(target - current) > 0.005) {
          inTransition = true;
          break;
        }
      }
      const recentlyMoved = mouseX >= 0 && t - lastMouseMoveMs < ACTIVITY_TIMEOUT_MS;
      const active = needReproject || hovered !== null || inTransition || recentlyMoved;
      const throttleMs = active ? ACTIVE_FRAME_MS : IDLE_FRAME_MS;
      if (t - lastDrawnMs < throttleMs) return;
      lastDrawnMs = t;

      compose(t, hovered);
    };

    // Initial setup. resize() ends with a synchronous compose() so the canvas
    // is painted with stars *before* useEffect returns — the user never sees
    // a blank starfield on theme toggle while waiting for the first rAF.
    resize();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(c);

    // Re-resize on devicePixelRatio change (browser zoom, monitor swap on
    // multi-display setups). A matchMedia listener for the *current* dpr
    // fires the moment dpr changes; we then re-attach a fresh listener for
    // the new dpr.
    let dprQuery: MediaQueryList | null = null;
    const onDprChange = () => {
      resize();
      attachDprListener();
    };
    const attachDprListener = () => {
      if (dprQuery) dprQuery.removeEventListener("change", onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener("change", onDprChange);
    };
    attachDprListener();
    // Body ResizeObserver catches text-rect-affecting layout changes
    // (resize, font load, content edits). Scroll doesn't invalidate —
    // doc mask is in doc coords and re-translated per frame.
    const docRo = new ResizeObserver(invalidateMaskRects);
    docRo.observe(document.body);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      docRo.disconnect();
      if (dprQuery) dprQuery.removeEventListener("change", onDprChange);
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
