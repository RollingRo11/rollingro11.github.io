"use client";

// The interactive half of an annotated equation. The KaTeX HTML arrives
// already rendered; this only tags the term spans and follows the pointer.

import { useRef, useState, useEffect } from "react";

export function EquationView({
  html,
  number,
  defs,
}: {
  html: string;
  number: string | null;
  defs: Record<string, string>;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTerms = Object.keys(defs).length > 0;

  const active = hovered ?? pinned;

  // Tag the rendered term spans and wire up hover / click (event delegation).
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    root.querySelectorAll<HTMLElement>("[data-term]").forEach((el) => {
      const key = el.getAttribute("data-term");
      el.classList.add(key && defs[key] != null ? "eq-term" : "eq-term--inert");
    });

    const keyFor = (target: EventTarget | null): string | null => {
      if (!(target instanceof Element)) return null;
      const el = target.closest("[data-term]");
      const key = el?.getAttribute("data-term");
      return key && defs[key] != null ? key : null;
    };

    const onOver = (e: Event) => {
      const k = keyFor(e.target);
      if (k) setHovered(k);
    };
    const onOut = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget;
      if (related instanceof Element && related.closest("[data-term]")) return;
      setHovered(null);
    };
    const onClick = (e: Event) => {
      const k = keyFor(e.target);
      if (k) setPinned((p) => (p === k ? null : k));
    };

    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseout", onOut);
    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseout", onOut);
      root.removeEventListener("click", onClick);
    };
  }, [defs, html]);

  // Keep both the pinned term (clicked) and the hovered term at full strength
  // while the rest of the equation recedes.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    root.querySelectorAll("[data-term]").forEach((el) => {
      const key = el.getAttribute("data-term");
      const lit = key != null && (key === hovered || key === pinned);
      el.classList.toggle("eq-term--active", lit);
    });
  }, [hovered, pinned, html]);

  return (
    <div className="equation">
      <div className="equation__row">
        <div
          ref={containerRef}
          className={`equation__katex${active ? " equation__katex--focused" : ""}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {number && <span className="equation__number">({number})</span>}
      </div>
      {hasTerms && (
        <div className="equation__def" aria-live="polite">
          {active ? (
            <span key={active} dangerouslySetInnerHTML={{ __html: defs[active] }} />
          ) : (
            <span className="equation__hint">Hover or click any term for its definition</span>
          )}
        </div>
      )}
    </div>
  );
}
