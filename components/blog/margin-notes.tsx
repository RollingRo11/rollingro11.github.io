"use client";

// Builds the floating margin notes from the already server-rendered `.prose`
// DOM. No markdown parsing here — it reads the rendered footnotes, so opening
// a post stays snappy. Notes hang in the right margin as plain text on the
// paper; the note matching the footnote you're hovering lights up.

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface Note {
  id: string;
  number: string;
  html: string;
  top: number; // document Y
  left: number; // document X
}

const NOTE_WIDTH = 240;
const NOTE_GAP = 40;
const STACK_GAP = 24;
const MIN_VIEWPORT = 1280; // below this there's no margin to hang notes in

export function MarginNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const calculate = useCallback(() => {
    const container = document.querySelector(".prose");
    if (!(container instanceof HTMLElement)) return;

    if (window.innerWidth < MIN_VIEWPORT) {
      setNotes([]);
      return;
    }

    const refs = container.querySelectorAll("[data-footnote-ref]");
    const footnotes = container.querySelector("[data-footnotes]");
    if (!refs.length || !footnotes) {
      setNotes([]);
      return;
    }

    // Hang off the right edge of the text column.
    const column = container.closest("main") ?? container;
    const noteLeft = column.getBoundingClientRect().right + window.scrollX + NOTE_GAP;

    const collected: Note[] = [];
    refs.forEach((ref) => {
      const href = (ref as HTMLAnchorElement).getAttribute("href");
      if (!href) return;
      const id = href.replace("#", "");
      const target = footnotes.querySelector(`#${CSS.escape(id)}`);
      if (!target) return;

      const clone = target.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-footnote-backref]").forEach((el) => el.remove());

      collected.push({
        id,
        number: ref.textContent || "",
        html: clone.innerHTML,
        top: ref.getBoundingClientRect().top + window.scrollY,
        left: noteLeft,
      });
    });

    if (collected.length === 0) {
      setNotes([]);
      return;
    }

    collected.sort((a, b) => a.top - b.top);

    // Measure real heights offscreen so adjacent notes never overlap.
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

    const heights = collected.map((note) => {
      const el = document.createElement("div");
      el.className = "margin-note";
      el.style.position = "static";
      el.innerHTML = `<span class="margin-note__number">${note.number}.</span> ${note.html}`;
      measureRoot.appendChild(el);
      const h = el.getBoundingClientRect().height;
      return h > 0 ? h : 56;
    });
    document.body.removeChild(measureRoot);

    let nextTop = 0;
    for (let i = 0; i < collected.length; i++) {
      const placed = Math.max(collected[i].top, nextTop);
      collected[i].top = placed;
      nextTop = placed + heights[i] + STACK_GAP;
    }

    setNotes(collected);
  }, []);

  useEffect(() => {
    calculate();
    // Recalc once content settles (fonts / KaTeX / images), and on resize.
    const t = setTimeout(calculate, 300);
    const onResize = () => requestAnimationFrame(calculate);
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [calculate]);

  useEffect(() => {
    const container = document.querySelector(".prose");
    if (!container) return;

    const onOver = (e: Event) => {
      const ref = (e.target as HTMLElement).closest("[data-footnote-ref]");
      const href = ref?.getAttribute("href");
      if (href) setActiveId(href.replace("#", ""));
    };
    const onOut = () => setActiveId(null);

    container.addEventListener("mouseover", onOver);
    container.addEventListener("mouseout", onOut);
    return () => {
      container.removeEventListener("mouseover", onOver);
      container.removeEventListener("mouseout", onOut);
    };
  }, []);

  if (!mounted || notes.length === 0) return null;

  return createPortal(
    <div className="margin-notes" aria-hidden="true">
      {notes.map((note, i) => (
        <aside
          key={`${note.id}-${i}`}
          className={`margin-note${activeId === note.id ? " margin-note--active" : ""}`}
          style={{ top: note.top, left: note.left, width: NOTE_WIDTH }}
        >
          <span className="margin-note__number">{note.number}.</span>{" "}
          <span dangerouslySetInnerHTML={{ __html: note.html }} />
        </aside>
      ))}
    </div>,
    document.body,
  );
}
