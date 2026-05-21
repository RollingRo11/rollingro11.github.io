"use client";

import { useState, useEffect, useLayoutEffect, useCallback } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

// Always-visible table of contents for blog posts — sits in the empty space
// to the left of the centered post, on the page background. Active section is
// underlined via scroll-spy.
export function BlogSidebar() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const scan = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".blog-prose h1[id], .blog-prose h2[id], .blog-prose h3[id]",
        ),
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

  // Scroll spy: the active heading is the last one whose top is above the fold.
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
    <nav className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc-label">Contents</p>
      <ul className="blog-toc-list">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              className={`blog-toc-item ${activeId === h.id ? "blog-toc-item--active" : ""}`}
              style={{ paddingLeft: `${(h.level - 1) * 2 + 1}ch` }}
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
