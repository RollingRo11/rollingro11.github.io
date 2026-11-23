"use client";

// Token heatmaps over a model's chain of thought, embedded in a note with a
// fenced ```cot-heatmap block (one "label | /path/to/sample.json" per line).
//
// Kept light on purpose: nothing is fetched until the figure nears the
// screen, only the chosen sample is drawn, each token is a bare <span> with a
// colour class (no inline style, no title), and a token's value is written
// into its tooltip only when the pointer reaches it. The box has a fixed
// height, so loading never shifts the page or the margin notes.

import { useEffect, useMemo, useRef, useState } from "react";

export interface HeatmapSample {
  label: string;
  src: string;
}

interface SampleData {
  problemId: string;
  sample: number;
  robust: boolean;
  maxDrop: number;
  answer: string;
  finish: string;
  problem: string;
  tokens: string[];
  attn: number[];
  attnPct: number[];
  ifr: number[];
  ifrPct: number[];
}

const PANES = [
  { key: "attn", title: "Attention distance", sub: "mean over 8 attention layers, heads" },
  { key: "ifr", title: "IFR flow distance", sub: "R = C^L ⋯ C^1" },
] as const;

const BUCKETS = 21; // percentile rank in steps of 5: 0, 5, …, 100

export function CotHeatmap({ samples }: { samples: HeatmapSample[] }) {
  const root = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(0);
  const [data, setData] = useState<Record<string, SampleData>>({});

  // Wait until the figure is about a screen away before fetching anything.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const src = samples[active]?.src;
  useEffect(() => {
    if (!near || !src || data[src]) return;
    let live = true;
    fetch(src)
      .then((r) => r.json())
      .then((d: SampleData) => live && setData((all) => ({ ...all, [src]: d })))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [near, src, data]);

  const d = src ? data[src] : undefined;

  return (
    <figure className="heatmap" ref={root}>
      {samples.length > 1 && (
        <div className="heatmap__tabs" role="tablist">
          {samples.map((s, i) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              className="heatmap__tab"
              onClick={() => setActive(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="heatmap__meta">
        {d ? (
          <>
            {d.problemId} · sample {d.sample} ·{" "}
            <span className={d.robust ? "heatmap__rb" : "heatmap__nr"}>
              {d.robust ? "robust" : "not robust"}
            </span>{" "}
            (max drop {d.maxDrop}) · answer {d.answer}
          </>
        ) : (
          "Loading…"
        )}
      </div>

      <details className="heatmap__problem">
        <summary>Problem</summary>
        <div>{d?.problem}</div>
      </details>

      <Legend />

      {/* Keyed by sample so switching starts from fresh spans (no stale tooltips). */}
      <Panes key={src} data={d} />

      <figcaption className="heatmap__caption">
        Each CoT token is a query. Its score is the distance-weighted attention (left) or IFR flow
        (right) over earlier CoT tokens only (prompt, template and BOS ignored, weights
        renormalized), divided by the number of CoT tokens it can see. First 1024 CoT tokens.
        Colour is the percentile rank within that CoT. Hover a token for its value.
      </figcaption>
    </figure>
  );
}

function Legend() {
  return (
    <div className="heatmap__legend" aria-hidden>
      close
      <span className="heatmap__ramp">
        {Array.from({ length: BUCKETS }, (_, b) => (
          <span key={b} className={`h${b}`} />
        ))}
      </span>
      far
    </div>
  );
}

function Panes({ data }: { data?: SampleData }) {
  const panes = useRef<(HTMLDivElement | null)[]>([]);

  // Scrolling one pane scrolls the other to the same fraction of the way down.
  useEffect(() => {
    const els = panes.current.filter((p): p is HTMLDivElement => !!p);
    let lock = false;
    const handlers = els.map((p) => {
      const onScroll = () => {
        if (lock) return;
        lock = true;
        const f = p.scrollTop / Math.max(1, p.scrollHeight - p.clientHeight);
        for (const o of els) if (o !== p) o.scrollTop = f * (o.scrollHeight - o.clientHeight);
        requestAnimationFrame(() => (lock = false));
      };
      p.addEventListener("scroll", onScroll, { passive: true });
      return onScroll;
    });
    return () => els.forEach((p, i) => p.removeEventListener("scroll", handlers[i]));
  }, []);

  return (
    <div className="heatmap__panes">
      {PANES.map((pane, i) => (
        <div key={pane.key} className="heatmap__pane">
          <div className="heatmap__title">
            {pane.title} <span>({pane.sub})</span>
          </div>
          <div
            className="heatmap__cot"
            ref={(el) => {
              panes.current[i] = el;
            }}
            onMouseOver={(e) => {
              const t = e.target as HTMLElement;
              if (!data || t.parentElement !== e.currentTarget || t.title) return;
              const idx = Array.prototype.indexOf.call(e.currentTarget.children, t);
              const vals = data[pane.key];
              const pcts = data[`${pane.key}Pct`];
              t.title = `${vals[idx].toFixed(3)} (pct ${pcts[idx]}%)`;
            }}
          >
            {data && <Tokens tokens={data.tokens} pct={data[`${pane.key}Pct`]} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tokens({ tokens, pct }: { tokens: string[]; pct: number[] }) {
  return useMemo(
    () =>
      tokens.map((tok, i) => (
        <span key={i} className={`h${Math.round(pct[i] / 5)}`}>
          {tok.replace(/\n/g, "↵\n")}
        </span>
      )),
    [tokens, pct],
  );
}
