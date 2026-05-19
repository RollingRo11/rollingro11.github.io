"use client";

import { useEffect, useRef } from "react";
import { useCustomTheme } from "@/components/custom-theme-provider";

// Frosted-glass panel that sits between the Starfield canvas and the body text.
// It's a `position: fixed` div in the root stacking context (same as the canvas),
// so `backdrop-filter` can actually see — and blur — the canvas behind it.
// The size + position are continuously updated to match the union of all elements
// tagged with `data-sky-mask` (the text columns).
export default function SkyBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const { colorMode } = useCustomTheme();
  const isDark = colorMode === "dark";

  useEffect(() => {
    if (!isDark) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const targets = document.querySelectorAll<HTMLElement>("[data-sky-mask]");
      let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
      let any = false;
      for (const t of targets) {
        const r = t.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        any = true;
        if (r.left < minL) minL = r.left;
        if (r.top < minT) minT = r.top;
        if (r.right > maxR) maxR = r.right;
        if (r.bottom > maxB) maxB = r.bottom;
      }
      if (!any) {
        el.style.display = "none";
      } else {
        const pad = 12;
        el.style.display = "block";
        el.style.left = `${minL - pad}px`;
        el.style.top = `${minT - pad}px`;
        el.style.width = `${maxR - minL + pad * 2}px`;
        el.style.height = `${maxB - minT + pad * 2}px`;
      }
      raf = requestAnimationFrame(update);
    };
    update();

    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  if (!isDark) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="sky-backdrop pointer-events-none fixed"
      style={{ zIndex: 1 }}
    />
  );
}
