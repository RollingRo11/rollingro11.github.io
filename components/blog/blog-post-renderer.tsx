"use client";

import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";
import { CodeBlock, Divider, simpleTableClasses } from "@/components/srcl";

// Flatten a react-markdown code node's children into the raw source string.
function nodeText(node: React.ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement(node)) return nodeText((node.props as { children?: React.ReactNode }).children);
  return "";
}

interface MarginNote {
  id: string;
  number: string;
  html: string;
  top: number; // document Y
  left: number; // document X
}

const NOTE_WIDTH = 260;
const NOTE_GAP = 16;
const MIN_VIEWPORT = 1200; // only float notes when there's room to the right

export function BlogPostRenderer({ content }: { content: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [marginNotes, setMarginNotes] = useState<MarginNote[]>([]);
  const [activeFootnote, setActiveFootnote] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const calculateMarginNotes = useCallback(() => {
    const container = contentRef.current;
    if (!container) return;

    // Not enough horizontal room → keep footnotes inline at the bottom.
    if (window.innerWidth < MIN_VIEWPORT) {
      setMarginNotes([]);
      return;
    }

    const refs = container.querySelectorAll("[data-footnote-ref]");
    const footnotesSection = container.querySelector("[data-footnotes]");
    if (!refs.length || !footnotesSection) {
      setMarginNotes([]);
      return;
    }

    // Float to the right of the Card window (the bordered box), not the prose
    // column — so the notes sit outside the main window entirely.
    const card = container.closest("article") ?? container;
    const cardRect = card.getBoundingClientRect();
    const noteLeft = cardRect.right + window.scrollX + NOTE_GAP;

    const notes: MarginNote[] = [];
    refs.forEach((ref) => {
      const href = (ref as HTMLAnchorElement).getAttribute("href");
      if (!href) return;
      const fnId = href.replace("#", "");
      const footnoteEl = footnotesSection.querySelector(`#${CSS.escape(fnId)}`);
      if (!footnoteEl) return;

      const refRect = ref.getBoundingClientRect();
      const top = refRect.top + window.scrollY;

      const clone = footnoteEl.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-footnote-backref]").forEach((el) => el.remove());

      notes.push({ id: fnId, number: ref.textContent || "", html: clone.innerHTML, top, left: noteLeft });
    });

    if (notes.length === 0) {
      setMarginNotes([]);
      return;
    }

    notes.sort((a, b) => a.top - b.top);

    // Measure real heights so adjacent windows never overlap.
    const measureRoot = document.createElement("div");
    Object.assign(measureRoot.style, {
      position: "absolute",
      left: "-9999px",
      top: "0",
      width: `${NOTE_WIDTH}px`,
      visibility: "hidden",
      pointerEvents: "none",
      zIndex: "-1",
    });
    document.body.appendChild(measureRoot);

    const heights = notes.map((note) => {
      const el = document.createElement("div");
      el.className = "margin-note-window";
      el.style.position = "static";
      el.innerHTML = `<span class="margin-note-number">${note.number}.</span> ${note.html}`;
      measureRoot.appendChild(el);
      const h = el.getBoundingClientRect().height;
      return h > 0 ? h : 56;
    });
    document.body.removeChild(measureRoot);

    let nextTop = 0;
    for (let i = 0; i < notes.length; i++) {
      const placed = Math.max(notes[i].top, nextTop);
      notes[i].top = placed;
      nextTop = placed + heights[i] + NOTE_GAP;
    }

    setMarginNotes(notes);
  }, []);

  useLayoutEffect(() => {
    calculateMarginNotes();
    const handleResize = () => requestAnimationFrame(calculateMarginNotes);
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
            // Tables use the SRCL SimpleTable styling.
            table: ({ children }) => (
              <div className={simpleTableClasses.scrollWrapper}>
                <table className={simpleTableClasses.root}>{children}</table>
              </div>
            ),
            // Fenced code blocks render through the SRCL CodeBlock.
            pre: ({ children }) => <CodeBlock>{nodeText(children)}</CodeBlock>,
            // Horizontal rules use the SRCL Divider.
            hr: () => <Divider style={{ margin: "1.5rem 0" }} />,
            img: ({ src, alt }) => {
              if (!src) return null;
              return (
                <img
                  src={src}
                  alt={alt ?? ""}
                  loading="eager"
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

      {/* Floating footnote windows — portaled to <body> in document coordinates
          so they sit outside the Card window (no horizontal scroll) and still
          scroll naturally with the page. */}
      {mounted &&
        marginNotes.length > 0 &&
        createPortal(
          <div className="margin-notes-layer" aria-label="Footnotes">
            {marginNotes.map((note, i) => (
              <aside
                key={`${note.id}-${i}`}
                className={`margin-note-window ${activeFootnote === note.id ? "margin-note-window--active" : ""}`}
                style={{ top: note.top, left: note.left, width: NOTE_WIDTH }}
              >
                <span className="margin-note-number">{note.number}.</span>{" "}
                <span dangerouslySetInnerHTML={{ __html: note.html }} />
              </aside>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
