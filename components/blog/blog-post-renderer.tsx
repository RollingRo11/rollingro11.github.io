"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";

interface MarginNote {
  id: string;
  number: string;
  top: number;
  html: string;
}

export function BlogPostRenderer({ content }: { content: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [marginNotes, setMarginNotes] = useState<MarginNote[]>([]);
  const [activeFootnote, setActiveFootnote] = useState<string | null>(null);

  const calculateMarginNotes = useCallback(() => {
    const container = contentRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const refs = container.querySelectorAll("[data-footnote-ref]");
    const footnotesSection = container.querySelector("[data-footnotes]");
    if (!refs.length || !footnotesSection) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const notes: MarginNote[] = [];

    refs.forEach((ref) => {
      const href = (ref as HTMLAnchorElement).getAttribute("href");
      if (!href) return;

      const fnId = href.replace("#", "");
      const footnoteEl = footnotesSection.querySelector(`#${CSS.escape(fnId)}`);
      if (!footnoteEl) return;

      const refRect = ref.getBoundingClientRect();
      const top = refRect.top - wrapperRect.top;

      const clone = footnoteEl.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-footnote-backref]").forEach((el) => el.remove());

      notes.push({
        id: fnId,
        number: ref.textContent || "",
        top,
        html: clone.innerHTML,
      });
    });

    if (notes.length === 0) {
      setMarginNotes([]);
      return;
    }

    notes.sort((a, b) => a.top - b.top);

    // Measure real note heights so nearby references never overlap.
    const measureRoot = document.createElement("div");
    Object.assign(measureRoot.style, {
      position: "absolute",
      left: "-9999px",
      top: "0",
      width: "240px",
      visibility: "hidden",
      pointerEvents: "none",
      zIndex: "-1",
    });
    document.body.appendChild(measureRoot);

    const measuredHeights: number[] = notes.map((note) => {
      const el = document.createElement("div");
      el.className = "margin-note";
      el.style.position = "static";
      el.style.paddingLeft = "12px";
      el.style.borderLeft = "2px solid transparent";
      el.innerHTML = `<span class="margin-note-number">${note.number}.</span> ${note.html}`;
      measureRoot.appendChild(el);
      const h = el.getBoundingClientRect().height;
      return h > 0 ? h : 52;
    });

    document.body.removeChild(measureRoot);

    const NOTE_GAP = 12;
    let nextTop = 0;
    for (let i = 0; i < notes.length; i++) {
      const desiredTop = Math.max(0, notes[i].top);
      const placedTop = Math.max(desiredTop, nextTop);
      notes[i].top = placedTop;
      nextTop = placedTop + measuredHeights[i] + NOTE_GAP;
    }

    setMarginNotes(notes);
  }, []);

  useLayoutEffect(() => {
    calculateMarginNotes();

    const handleResize = () => {
      requestAnimationFrame(calculateMarginNotes);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [content, calculateMarginNotes]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleFootnoteHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const ref = target.closest("[data-footnote-ref]") as HTMLAnchorElement;
      if (ref) {
        const href = ref.getAttribute("href");
        if (href) setActiveFootnote(href.replace("#", ""));
      }
    };

    const handleFootnoteLeave = () => setActiveFootnote(null);

    container.addEventListener("mouseover", handleFootnoteHover);
    container.addEventListener("mouseout", handleFootnoteLeave);
    return () => {
      container.removeEventListener("mouseover", handleFootnoteHover);
      container.removeEventListener("mouseout", handleFootnoteLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div ref={contentRef} className="blog-prose">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeSlug]}
          components={{
            table: ({ children }) => (
              <div className="blog-table-wrap">
                <table>{children}</table>
              </div>
            ),
            img: ({ src, alt }) => {
              if (!src) return null;
              return (
                <img
                  src={src}
                  alt={alt ?? ""}
                  loading="lazy"
                  decoding="async"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Margin notes — desktop only */}
      <aside className="margin-notes-container" aria-label="Sidenotes">
        {marginNotes.map((note, i) => (
          <div
            key={`${note.id}-${i}`}
            className={`margin-note ${activeFootnote === note.id ? "margin-note--active" : ""}`}
            style={{ top: note.top }}
          >
            <span className="margin-note-number">{note.number}.</span>{" "}
            <span dangerouslySetInnerHTML={{ __html: note.html }} />
          </div>
        ))}
      </aside>
    </div>
  );
}
