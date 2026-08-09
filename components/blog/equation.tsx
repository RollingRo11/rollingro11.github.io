"use client";

// Interactive display equation. Authored in a ```equation fenced code block:
//
//   ```equation
//   \eqterm{delta}{\Delta^l} := \eqterm{W}{W^l} - \sum_c \eqterm{uv}{\vec{U}^l_c (\vec{V}^l_c)^\top}
//
//   @@number: 1
//   @delta: The residual weight matrix for layer $l$ left after subtracting components.
//   @W: The original weight matrix at layer $l$.
//   @uv: A reconstructed rank-one component.
//   ```
//
// `\eqterm{key}{latex}` marks a hoverable/clickable term; the matching `@key:`
// line is its definition (inline `$...$` math allowed). The KaTeX string is
// built in a useMemo so it also renders during SSR — no layout shift, no
// on-open hydration flash — while the hover/click wiring runs in the browser.

import { useMemo, useRef, useState, useEffect } from "react";
import katex from "katex";

interface Term {
  key: string;
  html: string;
}

interface Parsed {
  latex: string;
  number: string | null;
  terms: Term[];
}

// `\eqterm{key}{body}` -> a span carrying `data-term="key"` around the body.
// Needs `trust` + `strict: false` below for KaTeX to honor the HTML extension.
const MACROS = { "\\eqterm": "\\htmlData{term=#1}{#2}" };

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Render a definition string that may contain inline `$...$` math to HTML.
function renderInline(text: string): string {
  const parts = text.split("$");
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      try {
        out += katex.renderToString(parts[i], {
          displayMode: false,
          throwOnError: false,
          strict: false,
        });
      } catch {
        out += escapeHtml(parts[i]);
      }
    } else {
      out += escapeHtml(parts[i]);
    }
  }
  return out;
}

function parse(source: string): Parsed {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const latexLines: string[] = [];
  const terms: Term[] = [];
  let number: string | null = null;
  let current: { key: string; buf: string[] } | null = null;

  const flush = () => {
    if (current) {
      terms.push({ key: current.key, html: renderInline(current.buf.join(" ").trim()) });
      current = null;
    }
  };

  for (const line of lines) {
    const cfg = line.match(/^@@\s*number\s*:\s*(.+?)\s*$/i);
    if (cfg) {
      flush();
      number = cfg[1].trim();
      continue;
    }
    const term = line.match(/^@([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (term) {
      flush();
      current = { key: term[1], buf: term[2] ? [term[2]] : [] };
      continue;
    }
    if (current) {
      if (line.trim() === "") flush();
      else current.buf.push(line.trim());
      continue;
    }
    latexLines.push(line);
  }
  flush();

  let latex = latexLines.join("\n").trim();
  // Be forgiving if the author wrapped the body in $$ ... $$.
  latex = latex.replace(/^\$\$/, "").replace(/\$\$$/, "").trim();

  return { latex, number, terms };
}

export function Equation({ source }: { source: string }) {
  const { latex, number, terms } = useMemo(() => parse(source), [source]);

  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        trust: true,
        strict: false,
        macros: MACROS,
      });
    } catch {
      return "";
    }
  }, [latex]);

  const defMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const t of terms) m[t.key] = t.html;
    return m;
  }, [terms]);

  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = hovered ?? pinned;

  // Tag the rendered term spans and wire up hover / click (event delegation).
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    root.querySelectorAll<HTMLElement>("[data-term]").forEach((el) => {
      const key = el.getAttribute("data-term");
      el.classList.add(key && defMap[key] != null ? "eq-term" : "eq-term--inert");
    });

    const keyFor = (target: EventTarget | null): string | null => {
      if (!(target instanceof Element)) return null;
      const el = target.closest("[data-term]");
      const key = el?.getAttribute("data-term");
      return key && defMap[key] != null ? key : null;
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
  }, [defMap, html]);

  // Keep both the pinned term (clicked) and the hovered term at full strength
  // while the rest of the equation recedes — so a clicked term stays lit even
  // as you hover others. The definition still follows the hover.
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
      {terms.length > 0 && (
        <div className="equation__def" aria-live="polite">
          {active ? (
            <span key={active} dangerouslySetInnerHTML={{ __html: defMap[active] }} />
          ) : (
            <span className="equation__hint">Hover or click any term for its definition</span>
          )}
        </div>
      )}
    </div>
  );
}
