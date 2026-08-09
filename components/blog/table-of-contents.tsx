"use client";

import { useState, useEffect, useLayoutEffect, useCallback } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

// Reading position for a post, in the empty margin to its left. Shown only
// where there's room; the active section is marked with a sage rule.
export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const scan = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(".prose h2[id], .prose h3[id]"),
      ).filter((el) => !el.closest("[data-footnotes]"));

      setHeadings(
        els.map((el) => ({
          id: el.id,
          text: el.textContent || "",
          level: parseInt(el.tagName.substring(1), 10),
        })),
      );
    };

    scan();
    // Re-scan once content (fonts, KaTeX, images) settles.
    const t = setTimeout(scan, 300);
    window.addEventListener("resize", scan);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", scan);
    };
  }, []);

  // The active heading is the last one whose top has passed the fold.
  useEffect(() => {
    if (headings.length === 0) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let current = headings[0]?.id ?? null;
        for (const h of headings) {
          const el = document.getElementById(h.id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= 120) current = h.id;
          else break;
        }
        setActiveId(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="toc__label">Contents</p>
      <ul className="toc__list">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              className={`toc__item${activeId === h.id ? " toc__item--active" : ""}`}
              style={{ paddingLeft: h.level === 3 ? "1.5rem" : undefined }}
              onClick={() => scrollTo(h.id)}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
