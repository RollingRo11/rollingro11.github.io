"use client";

import { useCallback } from "react";
import { prepare, layout } from "@chenglou/pretext";

/**
 * Programmatic pretext measurement — compute text height without DOM layout.
 * Useful for measuring text that isn't rendered yet (e.g. margin notes).
 */
export function measureTextHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
): { height: number; lineCount: number } {
  const prepared = prepare(text, font);
  return layout(prepared, maxWidth, lineHeight);
}

/**
 * Hook that attaches pretext layout to a DOM element.
 * Computes dimensions once after fonts load and stores them as
 * data-pretext-height and data-pretext-lines attributes.
 *
 * Does NOT use ResizeObserver — the browser handles native text
 * reflow during resize. Pretext provides the initial measurement.
 *
 * Returns a callback ref to attach to the target element.
 */
export function usePretextLayout() {
  const ref = useCallback((el: HTMLElement | null) => {
    if (!el) return;

    const compute = () => {
      const text = el.textContent || "";
      if (!text.trim()) return;

      const cs = getComputedStyle(el);
      const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const lh =
        cs.lineHeight === "normal"
          ? parseFloat(cs.fontSize) * 1.5
          : parseFloat(cs.lineHeight);

      const paddingL = parseFloat(cs.paddingLeft) || 0;
      const paddingR = parseFloat(cs.paddingRight) || 0;
      const contentWidth = el.clientWidth - paddingL - paddingR;

      if (contentWidth > 0) {
        try {
          const prepared = prepare(text, font);
          const result = layout(prepared, contentWidth, lh);
          el.dataset.pretextHeight = String(Math.round(result.height));
          el.dataset.pretextLines = String(result.lineCount);
        } catch {
          // font not ready or measurement error — skip silently
        }
      }
    };

    document.fonts.ready.then(compute);
  }, []);

  return ref;
}
