"use client";

// Lightweight client component that builds the floating footnote windows from
// the already server-rendered `.blog-prose` DOM. No markdown parsing here — it
// just reads the rendered footnotes, so opening a post stays snappy.

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

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

export function BlogMarginNotes() {
  const [marginNotes, setMarginNotes] = useState<MarginNote[]>([]);
  const [activeFootnote, setActiveFootnote] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const calculate = useCallback(() => {
    const container = document.querySelector(".blog-prose");
    if (!(container instanceof HTMLElement)) return;

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

    // Float to the right of the Card window, not the prose column.
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

  useEffect(() => {
    calculate();
    // Recalc once content settles (fonts / KaTeX / images), and on resize.
    const t = setTimeout(calculate, 300);
    const handleResize = () => requestAnimationFrame(calculate);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculate]);

  useEffect(() => {
    const container = document.querySelector(".blog-prose");
    if (!container) return;

    const onOver = (e: Event) => {
      const ref = (e.target as HTMLElement).closest("[data-footnote-ref]") as HTMLAnchorElement | null;
      if (ref) {
        const href = ref.getAttribute("href");
        if (href) setActiveFootnote(href.replace("#", ""));
      }
    };
    const onOut = () => setActiveFootnote(null);

    container.addEventListener("mouseover", onOver);
    container.addEventListener("mouseout", onOut);
    return () => {
      container.removeEventListener("mouseover", onOver);
      container.removeEventListener("mouseout", onOut);
    };
  }, []);

  if (!mounted || marginNotes.length === 0) return null;

  return createPortal(
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
  );
}
