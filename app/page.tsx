"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCustomTheme } from "@/components/custom-theme-provider";
import saeData from "@/data/sae-activations.json";

type FeatureData = {
  explanation: string;
  url: string;
  activations: Array<{
    tokens: string[];
    values: number[];
    maxValue: number;
    maxValueTokenIndex: number;
  }>;
};
const saeFeatures = saeData.features as Record<string, FeatureData>;

export default function Home() {
  const { colorMode, setColorMode } = useCustomTheme();
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLineEnter = useCallback((lineNum: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setTransitionEnabled(false);
    setHoveredLine(lineNum);
  }, []);

  const handleLineLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => {
      setTransitionEnabled(true);
      setHoveredLine(null);
    }, 500);
  }, []);

  const sunAscii = "\u2600"; // ✦ BLACK FOUR POINTED STAR (shown in dark mode)
  const moonAscii = "\u263E"; // ✧ WHITE FOUR POINTED STAR (shown in light mode)

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  // Single highlight color: blue in light mode, green in dark mode
  const HIGHLIGHT_RGB = colorMode === "light" ? [37, 99, 235] : [133, 186, 161];

  type Token =
    | string
    | { text: string; href: string; external?: boolean };

  // Fallback constants (used when SAE data unavailable)
  const LIGHT_COLOR = [37, 99, 235];
  const DARK_COLOR = [133, 186, 161];
  const LINK_ACTIVATION = 0.35;
  const FALLOFF_RADIUS = 2;
  const FALLOFF_DECAY = 0.5;

  type ResolvedToken =
    | string
    | { text: string; activation: number }
    | { text: string; activation: number; href: string; external?: boolean };

  function applyFalloff(tokens: Token[]): ResolvedToken[] {
    const linkIndices: number[] = [];
    tokens.forEach((t, i) => {
      if (typeof t === "object" && "href" in t) linkIndices.push(i);
    });

    return tokens.map((token, i) => {
      if (typeof token === "object" && "href" in token) {
        return { ...token, activation: LINK_ACTIVATION };
      }
      if (typeof token === "string") {
        let maxActivation = 0;
        for (const li of linkIndices) {
          const dist = Math.abs(i - li);
          if (dist > 0 && dist <= FALLOFF_RADIUS) {
            maxActivation = Math.max(maxActivation, LINK_ACTIVATION * Math.pow(FALLOFF_DECAY, dist));
          }
        }
        if (maxActivation > 0) return { text: token, activation: maxActivation };
      }
      return token;
    });
  }

  function FallbackHighlightedText({ tokens }: { tokens: Token[] }) {
    const resolved = useMemo(() => applyFalloff(tokens), [tokens]);

    return (
      <>
        {resolved.map((token, i) => {
          if (typeof token === "string") return <span key={i}>{token} </span>;

          const styles = (() => {
            const bg = (c: number[]) => `rgba(${c.join(",")},${token.activation})`;
            return { light: { backgroundColor: bg(LIGHT_COLOR) }, dark: { backgroundColor: bg(DARK_COLOR) } };
          })();
          const style = colorMode === "light" ? styles.light : styles.dark;

          if ("href" in token) {
            return (
              <span key={i}>
                <Link
                  href={token.href}
                  className="no-underline rounded-[3px] px-1 box-decoration-clone"
                  style={style}
                  {...(token.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >{token.text}</Link>{" "}
              </span>
            );
          }

          return (
            <span key={i}>
              <span className="rounded-[2px]" style={style}>{token.text}</span>{" "}
            </span>
          );
        })}
      </>
    );
  }

  type PopupData = {
    featureIndex: number;
    activation: number;
    top: number;
    left: number;
    arrowX: number;
  };

  const [popup, setPopup] = useState<PopupData | null>(null);
  const [mounted, setMounted] = useState(false);
  // Track last popup params to avoid redundant state updates
  const lastPopupRef = useRef<{ fi: number; bottom: number } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Disable hover effect on touch devices
  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const handleTextMouseMove = useCallback((e: React.MouseEvent) => {
    if (isTouchDevice) return;
    const target = (e.target as HTMLElement).closest("[data-fi]") as HTMLElement | null;
    if (!target) {
      if (lastPopupRef.current) { lastPopupRef.current = null; setPopup(null); }
      return;
    }
    const fi = Number(target.dataset.fi);
    const act = Number(target.dataset.act);

    // Find the line rect closest to the cursor Y — handles multi-line inline spans
    // and padding gaps where the cursor falls between rects
    const rects = target.getClientRects();
    let bestRect: DOMRect | null = null;
    let minDist = Infinity;
    for (let r = 0; r < rects.length; r++) {
      const mid = (rects[r].top + rects[r].bottom) / 2;
      const dist = Math.abs(e.clientY - mid);
      if (dist < minDist) {
        minDist = dist;
        bestRect = rects[r];
      }
    }
    const bottom = bestRect ? bestRect.bottom : e.clientY + 20;

    // Dedup: skip if same feature on same line (avoids jitter from horizontal mouse movement)
    const prev = lastPopupRef.current;
    if (prev && prev.fi === fi && Math.abs(prev.bottom - bottom) < 5) return;

    const popupWidth = 300;
    const arrowX = bestRect ? bestRect.left + bestRect.width / 2 : e.clientX;
    const left = Math.max(8, Math.min(arrowX - popupWidth / 2, window.innerWidth - popupWidth - 8));
    const top = bottom + 8;
    lastPopupRef.current = { fi, bottom };
    setPopup({ featureIndex: fi, activation: act, top, left, arrowX });
  }, []);

  const handleTextMouseLeave = useCallback(() => {
    lastPopupRef.current = null;
    setPopup(null);
  }, []);

  // Safety net: clear popup when cursor leaves all [data-fi] elements
  useEffect(() => {
    if (!mounted) return;
    const onPointerMove = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || !el.closest("[data-fi]")) {
        if (lastPopupRef.current) {
          lastPopupRef.current = null;
          setPopup(null);
        }
      }
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, [mounted]);

  function HighlightedText({ tokens, paragraphIndex }: { tokens: Token[]; paragraphIndex: number }) {
    const saeParag = saeData?.paragraphs?.[paragraphIndex];

    // Fallback if no SAE data for this paragraph
    if (!saeParag || saeParag.tokens.length === 0) {
      return <FallbackHighlightedText tokens={tokens} />;
    }

    // Build link regions by finding link text positions in the SAE paragraph text
    const linkRegions: Array<{ start: number; end: number; href: string; external?: boolean }> = [];
    let searchPos = 0;
    for (const token of tokens) {
      if (typeof token === "object" && "href" in token) {
        const idx = saeParag.text.indexOf(token.text, searchPos);
        if (idx !== -1) {
          linkRegions.push({ start: idx, end: idx + token.text.length, href: token.href, external: token.external });
          searchPos = idx + token.text.length;
        }
      }
    }

    // How much text the display tokens cover (SAE text may include trailing chars like ".")
    const displayText = tokens.map(t => typeof t === "string" ? t : t.text).join(" ");
    const textExtent = displayText.length;

    // Sort SAE tokens by start position and build segments (SAE tokens + gap fills)
    const saeTokens = [...saeParag.tokens].sort((a, b) => a.start - b.start);

    type Segment = {
      start: number;
      end: number;
      text: string;
      featureIndex?: number;
      activation?: number;
    };

    const segments: Segment[] = [];
    let lastEnd = 0;
    for (const st of saeTokens) {
      if (st.start >= textExtent) break;
      if (st.start > lastEnd) {
        segments.push({ start: lastEnd, end: st.start, text: saeParag.text.slice(lastEnd, st.start) });
      }
      const segEnd = Math.min(st.end, textExtent);
      segments.push({
        start: st.start,
        end: segEnd,
        text: saeParag.text.slice(st.start, segEnd),
        featureIndex: st.featureIndex,
        activation: st.activation,
      });
      lastEnd = Math.max(lastEnd, segEnd);
    }
    if (lastEnd < textExtent) {
      segments.push({ start: lastEnd, end: textExtent, text: saeParag.text.slice(lastEnd, textExtent) });
    }

    // Normalize opacity relative to max activation in this paragraph
    const maxAct = Math.max(...saeTokens.map(t => t.activation), 1);



    // Use overlap (not strict containment) so tokens with leading spaces still match links
    const findLink = (start: number, end: number) =>
      linkRegions.find(lr => start < lr.end && end > lr.start);

    // Precompute nearest feature for gap segments
    const nearestFeature = (idx: number) => {
      const prev = segments.slice(0, idx).reverse().find(s => s.featureIndex !== undefined);
      const next = segments.slice(idx + 1).find(s => s.featureIndex !== undefined);
      return prev || next;
    };

    return (
      <span onMouseMove={handleTextMouseMove} onMouseLeave={handleTextMouseLeave}>
        {segments.map((seg, i) => {
          const link = findLink(seg.start, seg.end);
          const linePad = { paddingBlock: "0.35em" } as const;

          // Plain text (gap) — delegate hover to nearest SAE token
          if (seg.featureIndex === undefined || seg.activation === undefined) {
            const nearest = nearestFeature(i);
            const dataAttrs = nearest ? { "data-fi": nearest.featureIndex, "data-act": nearest.activation } : {};

            if (link) {
              // Only strip leading space from underline if it's before the link region
              const spaceBeforeLink = seg.start < link.start;
              const gapLeading = spaceBeforeLink ? (seg.text.match(/^(\s+)/)?.[1] || "") : "";
              const gapWord = seg.text.slice(gapLeading.length);
              return (
                <span key={i} style={linePad} {...dataAttrs as Record<string, unknown>}>
                  {gapLeading}<Link href={link.href} className="underline"
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >{gapWord}</Link>
                </span>
              );
            }
            return <span key={i} style={linePad} {...dataAttrs}>{seg.text}</span>;
          }

          // SAE token — highlight span always present (transparent when idle) to prevent layout shift
          const isHovered = popup !== null && popup.featureIndex === seg.featureIndex;
          const opacityScale = colorMode === "dark" ? 0.7 : 0.35;
          const opacityBase = colorMode === "dark" ? 0.2 : 0.1;
          const opacity = isHovered ? Math.min(seg.activation / maxAct, 1) * opacityScale + opacityBase : 0;
          const bg = `rgba(${HIGHLIGHT_RGB.join(",")},${opacity})`;
          const dataAttrs = { "data-fi": seg.featureIndex, "data-act": seg.activation };

          // Split leading space so the highlight only covers the word
          // But keep spaces inside the link if they're between words (not at boundary)
          const atLinkBoundary = link && seg.start < link.start;
          const leadingSpace = seg.text.match(/^(\s+)/)?.[1] || "";
          const wordPart = seg.text.slice(leadingSpace.length);

          if (link) {
            if (atLinkBoundary) {
              return (
                <span key={i} style={linePad} {...dataAttrs as Record<string, unknown>}>
                  {leadingSpace}<Link href={link.href} className="underline"
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  ><span style={{ backgroundColor: bg }}>{wordPart}</span></Link>
                </span>
              );
            }
            return (
              <span key={i} style={linePad} {...dataAttrs as Record<string, unknown>}>
                <Link href={link.href} className="underline"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >{leadingSpace}<span style={{ backgroundColor: bg }}>{wordPart}</span></Link>
              </span>
            );
          }

          return (
            <span key={i} style={linePad} {...dataAttrs}>{leadingSpace}<span style={{ backgroundColor: bg }}>{wordPart}</span></span>
          );
        })}
      </span>
    );
  }

  return (
    <div className="min-h-dvh selection:bg-blue-600 selection:text-white dark:bg-[#222129] dark:text-white dark:selection:bg-[#85BAA1] dark:selection:text-white bg-white text-black">
      {/* Header area aligned with text content */}
      <div
        className="max-w-[52rem] mx-auto pl-6 sm:pl-[calc(2.5rem+2.5rem+1.25rem)] lg:pl-[calc(5rem+2.5rem+1.25rem)] pr-6 sm:pr-10 lg:pr-20 pt-6 sm:pt-8"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        <div className="flex items-baseline justify-between mt-8 mb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-normal">Rohan Kathuria</h1>
            <button
              className="sm:hidden text-4xl bg-transparent border-none cursor-pointer focus:outline-none relative top-[2px]"
              style={{ fontFamily: "var(--font-departure-mono)" }}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              title="Toggle color mode"
            >
              <span style={colorMode === "light" ? { fontSize: "0.75em" } : undefined}>
                {colorMode === "light" ? moonAscii : sunAscii}
              </span>
            </button>
          </div>
          <div className="hidden sm:flex items-center">
            <button
              className="text-4xl bg-transparent border-none cursor-pointer focus:outline-none relative top-[2px]"
              style={{ fontFamily: "var(--font-departure-mono)" }}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              title="Toggle color mode"
            >
              <span style={colorMode === "light" ? { fontSize: "0.75em" } : undefined}>
                {colorMode === "light" ? moonAscii : sunAscii}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content with line numbers */}
      <main className="max-w-[52rem] mx-auto px-6 sm:px-10 lg:px-20 pb-12 sm:pb-16 lg:pb-20">
        <div className="relative">
          {/* Continuous vertical line (hidden on mobile when line numbers are hidden) */}
          <div className="absolute left-8 sm:left-10 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

          <div className="space-y-1">
            {(() => {
              const lines: Array<
                | { type: "content"; content: React.ReactNode; center?: boolean; header?: boolean }
                | { type: "spacer"; height: string }
              > = [
                // Contact (first line)
                {
                  type: "content",
                  content: (
                    <p className="text-xl sm:text-2xl leading-relaxed">
                      kathuria.r@northeastern.edu
                      {" | "}
                      <Link
                        href="https://linkedin.com/in/rohanekathuria"
                        className="text-blue-600 no-underline hover:underline dark:text-inherit dark:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        linkedin
                      </Link>
                      {" | "}
                      <Link
                        href="https://github.com/RollingRo11"
                        className="text-blue-600 no-underline hover:underline dark:text-inherit dark:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        github
                      </Link>
                      {" | "}
                      <Link
                        href="/blog/"
                        className="text-blue-600 no-underline hover:underline dark:text-inherit dark:underline"
                      >
                        blog
                      </Link>
                    </p>
                  ),
                },
                { type: "spacer", height: "h-2" },
                // Intro
                {
                  type: "content",
                  content: (
                    <p className="text-xl sm:text-2xl leading-relaxed">
                      {HighlightedText({ paragraphIndex: 0, tokens: [
                        "Howdy! I'm a 2nd year CS student at Northeastern University",
                        "focused",
                        "on",
                        { text: "mechanistic interpretability.", href: "/interpretability" },
                        "I'm",
                        "currently",
                        "a research fellow at",
                        "the",
                        { text: "Supervised Program for Alignment Research", href: "https://sparai.org/", external: true },
                        "working",
                        "under",
                        "Santiago Aranguri (PhD @ NYU, Goodfire) on decreasing model evaluation awareness. I'm also a technical",
                        "fellow",
                        "at",
                        { text: "Harvard's AI Safety Student Team", href: "https://aisst.ai/", external: true },
                      ]})}
                      .
                    </p>
                  ),
                },
                { type: "spacer", height: "h-2" },
                {
                  type: "content",
                  content: (
                    <p className="text-xl sm:text-2xl leading-relaxed">
                      {HighlightedText({ paragraphIndex: 1, tokens: [
                        "I was",
                        "previously",
                        "at",
                        { text: "Northeastern's Research in AI Lab", href: "https://neurai.sites.northeastern.edu/our-team/rohan-kathuria/", external: true },
                        "in",
                        "Silicon",
                        "Valley working on understanding cross-layer superposition.",
                      ]})}
                    </p>
                  ),
                },
                { type: "spacer", height: "h-4" },
                // Other things
                {
                  type: "content",
                  center: true,
                  header: true,
                  content: (
                    <h2 className="text-2xl sm:text-3xl font-normal" style={{ fontFamily: "var(--font-crimson-pro)" }}>
                      Other things
                    </h2>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <div className="text-xl sm:text-2xl">
                      •{" "}
                      <Link
                        href="https://generatenu.com/"
                        className="text-blue-600 no-underline hover:underline dark:text-inherit dark:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Generate
                      </Link>{" "}
                      Design Engineering
                    </div>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <div className="text-xl sm:text-2xl">
                      •{" "}
                      <Link
                        href="https://www.ktpneu.org/"
                        className="text-blue-600 no-underline hover:underline dark:text-inherit dark:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Kappa Theta Pi
                      </Link>{" "}
                      @ Northeastern, Backend Lead
                    </div>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <div className="text-xl sm:text-2xl">
                      •{" "}
                      <Link
                        href="https://www.rev.school/"
                        className="text-blue-600 no-underline hover:underline dark:text-inherit dark:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        REV
                      </Link>{" "}
                      Cohort 4
                    </div>
                  ),
                },
              ];

              let lineNum = 0;
              return lines.map((line, i) => {
                if (line.type === "spacer") {
                  return (
                    <div key={i} className={`flex ${line.height}`}>
                      <div className="w-0 sm:w-10 shrink-0" />
                      <div className="pl-0 sm:pl-5 flex-1" />
                    </div>
                  );
                }
                lineNum++;
                const currentLineNum = lineNum;

                let displayNum: number | string = currentLineNum;
                if (hoveredLine !== null) {
                  const diff = currentLineNum - hoveredLine;
                  displayNum = diff === 0 ? currentLineNum : Math.abs(diff);
                }

                return (
                  <div
                    key={i}
                    className="flex items-baseline cursor-default"
                    onMouseEnter={() => handleLineEnter(currentLineNum)}
                    onMouseLeave={handleLineLeave}
                  >
                    <span
                      className={`hidden sm:block w-8 sm:w-10 text-right pr-3 sm:pr-4 select-none shrink-0 text-sm sm:text-base ${transitionEnabled ? "transition-colors" : ""} ${hoveredLine === currentLineNum ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}`}
                      style={{
                        fontFamily: "var(--font-departure-mono)",
                        transform: `translateY(${line.header ? "-2px" : "1px"})`,
                      }}
                    >
                      {displayNum}
                    </span>
                    <div className="pl-0 sm:pl-5 flex-1">{line.content}</div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </main>

      {/* Single shared popup for SAE feature details — pointer-events: none so cursor passes through to text */}
      {mounted && popup && createPortal(
        <div
          className="fixed z-50 w-[300px] pointer-events-none font-sans text-sm"
          style={{
            top: popup.top,
            left: popup.left,
          }}
        >
          {/* Arrow */}
          <div
            className="absolute -top-[5px] w-[10px] h-[10px] rotate-45 border-l border-t border-border bg-popover"
            style={{ left: popup.arrowX - popup.left }}
          />
          <div className="rounded-md border shadow-md overflow-hidden bg-popover text-popover-foreground mt-[1px]">
          {(() => {
            const feature = saeFeatures[String(popup.featureIndex)];
            const rgb = HIGHLIGHT_RGB;

            return (
              <>
                {/* Header */}
                <div className="px-2.5 pt-2 pb-1 border-b border-border/50">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="w-2 h-2 rounded-sm shrink-0"
                      style={{ backgroundColor: `rgb(${rgb.join(",")})` }}
                    />
                    <span className="font-medium opacity-50">
                      #{popup.featureIndex}
                    </span>
                    <span className="opacity-40 ml-auto">
                      {popup.activation.toFixed(1)}
                    </span>
                  </div>
                  {feature?.explanation && (
                    <p className="leading-snug">{feature.explanation}</p>
                  )}
                </div>

                {/* Activation examples — centered on max activating token, 2-line clamp */}
                {feature?.activations && feature.activations.length > 0 && (
                  <div className="px-2.5 py-1 divide-y divide-border/30">
                    {feature.activations.slice(0, 2).map((example, j) => {
                      // Center window of tokens around the max activating token
                      const center = example.maxValueTokenIndex;
                      const windowSize = 8;
                      const start = Math.max(0, center - windowSize);
                      const end = Math.min(example.tokens.length, center + windowSize + 1);
                      const slicedTokens = example.tokens.slice(start, end);
                      const slicedValues = example.values.slice(start, end);

                      return (
                        <div key={j} className="text-xs leading-snug py-1 overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {start > 0 && <span className="opacity-40">...</span>}
                          {slicedTokens.map((tok, k) => {
                            const val = slicedValues[k] || 0;
                            const opacity = example.maxValue > 0 ? Math.min(val / example.maxValue, 1) * 0.5 + 0.05 : 0;
                            return (
                              <span
                                key={k}
                                style={val > 0 ? { backgroundColor: `rgba(${rgb.join(",")},${opacity})` } : undefined}
                              >{tok.replace(/▁/g, " ")}</span>
                            );
                          })}
                          {end < example.tokens.length && <span className="opacity-40">...</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
