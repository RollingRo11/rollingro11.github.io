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
// line is its definition (inline `$...$` math allowed). KaTeX runs here, at
// build time, so the browser never downloads it; the rendered HTML goes to a
// small client component that only wires up hover and click.

import katex from "katex";
import { EquationView } from "@/components/blog/equation-view";

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
  const { latex, number, terms } = parse(source);

  let html = "";
  try {
    html = katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      trust: true,
      strict: false,
      macros: MACROS,
    });
  } catch {
    html = "";
  }

  const defs: Record<string, string> = {};
  for (const t of terms) defs[t.key] = t.html;

  return <EquationView html={html} number={number} defs={defs} />;
}
