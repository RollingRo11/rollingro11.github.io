"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
  position: number;
}

const AXIS_X = 15;
const DOT_SIZE = 3;
const DOT_GAP = 5;
const FIRST_SEGMENT_TOP_OFFSET_PX = -18;
const PAD_TOP = 6;
const PAD_BOTTOM = 8;
const TRACK_RANGE = 100 - PAD_TOP - PAD_BOTTOM;
const BAR_SIZE_PCT = 12; // fixed length of the scrollbar (as % of track)
const HOVER_ZONE_WIDTH_PX = 340;
const LABEL_START_X_PX = AXIS_X + 11;
const CONTENT_GAP_PX = 28;
const MIN_SAFE_TEXT_WIDTH_PX = 180;

export function BlogScrollbar({ title }: { title?: string }) {
  const [headings, setHeadings] = useState<HeadingInfo[]>([]);
  const [isNear, setIsNear] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [displayDotPositions, setDisplayDotPositions] = useState<number[]>([]);
  const [isScrollbarEnabled, setIsScrollbarEnabled] = useState(true);
  const [safeTextWidth, setSafeTextWidth] = useState<number | null>(null);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressSegRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);

  const getSafeTextWidth = useCallback(() => {
    const content = document.querySelector(".blog-post-container");
    if (!(content instanceof HTMLElement)) return null;
    const contentLeft = content.getBoundingClientRect().left;
    return Math.max(0, contentLeft - LABEL_START_X_PX - CONTENT_GAP_PX);
  }, []);

  useLayoutEffect(() => {
    const scan = () => {
      const els = Array.from(
        document.querySelectorAll(
          ".blog-prose h1[id], .blog-prose h2[id], .blog-prose h3[id]"
        )
      ).filter((el) => !el.closest("[data-footnotes]"));
      const docHeight = document.documentElement.scrollHeight;

      const parsed: HeadingInfo[] = els.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          id: el.id,
          text: el.textContent || "",
          level: parseInt(el.tagName.substring(1)),
          position: (rect.top + window.scrollY) / docHeight,
        };
      });

      setHeadings(parsed);
    };

    scan();
    window.addEventListener("resize", scan);
    return () => {
      window.removeEventListener("resize", scan);
    };
  }, []);

  const dotPositions = useMemo(
    () => headings.map((h) => PAD_TOP + h.position * TRACK_RANGE),
    [headings]
  );

  const shownDotPositions = useMemo(() => {
    if (displayDotPositions.length === dotPositions.length) {
      return displayDotPositions;
    }
    return dotPositions;
  }, [displayDotPositions, dotPositions]);

  const headingTrackPositions = useMemo(
    () =>
      headings.map((h, i) => ({
        id: h.id,
        trackPos: shownDotPositions[i],
      })),
    [headings, shownDotPositions]
  );

  const segments = useMemo(() => {
    const next: { top: number; bottom: number }[] = [];
    if (shownDotPositions.length > 0) {
      next.push({ top: PAD_TOP, bottom: shownDotPositions[0] });
    }
    for (let i = 0; i < shownDotPositions.length - 1; i++) {
      next.push({ top: shownDotPositions[i], bottom: shownDotPositions[i + 1] });
    }
    if (shownDotPositions.length > 0) {
      next.push({
        top: shownDotPositions[shownDotPositions.length - 1],
        bottom: 100 - PAD_BOTTOM,
      });
    }
    return next;
  }, [shownDotPositions]);

  if (progressSegRefs.current.length !== segments.length) {
    progressSegRefs.current = new Array(segments.length).fill(null);
  }
  if (labelRefs.current.length !== headings.length) {
    labelRefs.current = new Array(headings.length).fill(null);
  }

  useEffect(() => {
    if (headings.length === 0) return;
    let raf = 0;

    const recalc = () => {
      const viewportH = window.innerHeight || 1;
      const topBoundPx = (PAD_TOP / 100) * viewportH;
      const bottomBoundPx = ((100 - PAD_BOTTOM) / 100) * viewportH;
      const baseCentersPx = dotPositions.map((p) => (p / 100) * viewportH);

      const heights = labelRefs.current.map((el) => {
        if (!el) return 18;
        return Math.max(18, el.getBoundingClientRect().height);
      });

      const MIN_GAP_PX = 8;
      const adjustedPx = [...baseCentersPx];

      // Forward pass: push down to avoid overlap.
      for (let i = 1; i < adjustedPx.length; i++) {
        const minCenter =
          adjustedPx[i - 1] + (heights[i - 1] + heights[i]) / 2 + MIN_GAP_PX;
        if (adjustedPx[i] < minCenter) adjustedPx[i] = minCenter;
      }

      // If we overflow bottom, shift entire set upward.
      const overflow = adjustedPx[adjustedPx.length - 1] - bottomBoundPx;
      if (overflow > 0) {
        for (let i = 0; i < adjustedPx.length; i++) {
          adjustedPx[i] -= overflow;
        }
      }

      // Keep top bounded.
      if (adjustedPx[0] < topBoundPx) {
        const shift = topBoundPx - adjustedPx[0];
        for (let i = 0; i < adjustedPx.length; i++) {
          adjustedPx[i] += shift;
        }
      }

      // Re-run forward pass after boundary shifts.
      for (let i = 1; i < adjustedPx.length; i++) {
        const minCenter =
          adjustedPx[i - 1] + (heights[i - 1] + heights[i]) / 2 + MIN_GAP_PX;
        if (adjustedPx[i] < minCenter) adjustedPx[i] = minCenter;
      }

      // Final clamp if forward pass pushed past bottom again.
      const finalOverflow = adjustedPx[adjustedPx.length - 1] - bottomBoundPx;
      if (finalOverflow > 0) {
        for (let i = 0; i < adjustedPx.length; i++) {
          adjustedPx[i] -= finalOverflow;
        }
      }

      const adjustedPct = adjustedPx.map((px) => (px / viewportH) * 100);

      // Avoid pointless state updates.
      setDisplayDotPositions((prev) => {
        if (prev.length === adjustedPct.length) {
          let changed = false;
          for (let i = 0; i < prev.length; i++) {
            if (Math.abs(prev[i] - adjustedPct[i]) > 0.05) {
              changed = true;
              break;
            }
          }
          if (!changed) return prev;
        }
        return adjustedPct;
      });
    };

    raf = requestAnimationFrame(recalc);
    const onResize = () => requestAnimationFrame(recalc);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [headings, dotPositions, isNear]);

  useEffect(() => {
    const ZOOM_HIDE_THRESHOLD = 1.35;
    const WIDTH_HIDE_THRESHOLD = 1024;

    const updateEnabled = () => {
      const viewportWidth = window.innerWidth;
      const zoomScale = window.visualViewport?.scale ?? 1;
      const measuredSafeWidth = getSafeTextWidth();
      if (measuredSafeWidth !== null) {
        setSafeTextWidth(measuredSafeWidth);
      }
      const shouldDisable =
        viewportWidth < WIDTH_HIDE_THRESHOLD ||
        zoomScale >= ZOOM_HIDE_THRESHOLD ||
        (measuredSafeWidth !== null && measuredSafeWidth < MIN_SAFE_TEXT_WIDTH_PX);
      setIsScrollbarEnabled(!shouldDisable);
    };

    const initRaf = requestAnimationFrame(updateEnabled);
    window.addEventListener("resize", updateEnabled);
    window.visualViewport?.addEventListener("resize", updateEnabled);

    return () => {
      cancelAnimationFrame(initRaf);
      window.removeEventListener("resize", updateEnabled);
      window.visualViewport?.removeEventListener("resize", updateEnabled);
    };
  }, [getSafeTextWidth]);

  useEffect(() => {
    const setNear = (value: boolean) => {
      if (value) {
        if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
        setIsNear(true);
      } else {
        if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
        fadeTimeout.current = setTimeout(() => setIsNear(false), 2400);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isScrollbarEnabled) return;
      setNear(e.clientX <= HOVER_ZONE_WIDTH_PX);
    };

    const onWindowLeave = () => setNear(false);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onWindowLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onWindowLeave);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [isScrollbarEnabled]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight;
        const scrollable = docHeight - window.innerHeight;
        const frac = scrollable > 0 ? window.scrollY / scrollable : 0;

        // Map [0,1] → track, keeping bar fully on the track
        const usableRange = TRACK_RANGE - BAR_SIZE_PCT;
        const barTopPct = PAD_TOP + frac * usableRange;
        const barBottomPct = barTopPct + BAR_SIZE_PCT;
        const barCenterPct = (barTopPct + barBottomPct) / 2;

        progressSegRefs.current.forEach((el, i) => {
          const seg = segments[i];
          if (!el || !seg) return;

          const overlapTop = Math.max(seg.top, barTopPct);
          const overlapBottom = Math.min(seg.bottom, barBottomPct);

          if (overlapBottom <= overlapTop) {
            el.style.opacity = "0";
            return;
          }

          const topGap = i === 0 ? FIRST_SEGMENT_TOP_OFFSET_PX : DOT_GAP;
          const bottomGap = DOT_GAP;

          el.style.opacity = "1";
          el.style.top = `calc(${overlapTop}% + ${topGap}px)`;
          el.style.height = `calc(${overlapBottom - overlapTop}% - ${topGap + bottomGap}px)`;
        });

        let newActive: string | null = null;
        if (headingTrackPositions.length > 0) {
          const overlapping = headingTrackPositions.filter(
            (h) => h.trackPos >= barTopPct && h.trackPos <= barBottomPct
          );

          const candidates =
            overlapping.length > 0 ? overlapping : headingTrackPositions;

          let best = candidates[0];
          let bestDist = Math.abs(candidates[0].trackPos - barCenterPct);
          for (let i = 1; i < candidates.length; i++) {
            const dist = Math.abs(candidates[i].trackPos - barCenterPct);
            if (dist < bestDist) {
              best = candidates[i];
              bestDist = dist;
            }
          }
          newActive = best.id;
        }

        if (newActive !== activeRef.current) {
          activeRef.current = newActive;
          setActiveId(newActive);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [headingTrackPositions, segments]);

  const scrollTo = useCallback((trackPos: number) => {
    const docHeight = document.documentElement.scrollHeight;
    const scrollable = docHeight - window.innerHeight;
    if (scrollable <= 0) return;

    // Invert the bar-position mapping so clicking a heading dot
    // places the moving bar directly over that dot.
    const usableRange = TRACK_RANGE - BAR_SIZE_PCT;
    const desiredBarTop = Math.min(
      PAD_TOP + usableRange,
      Math.max(PAD_TOP, trackPos - BAR_SIZE_PCT / 2)
    );
    const frac = usableRange > 0 ? (desiredBarTop - PAD_TOP) / usableRange : 0;
    const targetScrollY = frac * scrollable;

    window.scrollTo({
      top: Math.max(0, targetScrollY),
      behavior: "smooth",
    });
  }, []);

  if (!isScrollbarEnabled || headings.length === 0) return null;
  const halfDot = DOT_SIZE / 2;
  const scrollbarStyle = safeTextWidth !== null
    ? ({ ["--blog-scrollbar-safe-width" as string]: `${safeTextWidth}px` } as CSSProperties)
    : undefined;

  return (
    <div className="blog-scrollbar" aria-hidden="true" style={scrollbarStyle}>
      <div className="blog-scrollbar-hover-zone" />

      {title && (
        <div
          className={`blog-scrollbar-title ${isNear ? "visible" : ""}`}
          style={{ top: `${PAD_TOP + 0.5}%`, left: AXIS_X + 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {title}
        </div>
      )}

      {/* Light track with gaps at dots */}
      {segments.map((seg, i) => {
        const topGap = i === 0 ? FIRST_SEGMENT_TOP_OFFSET_PX : DOT_GAP;
        const bottomGap = DOT_GAP;
        const cssTop = `calc(${seg.top}% + ${topGap}px)`;
        const cssHeight = `calc(${seg.bottom - seg.top}% - ${topGap + bottomGap}px)`;
        return (
          <div key={`seg-${i}`}>
            <div
              className="blog-scrollbar-segment"
              style={{ left: AXIS_X - 0.5, top: cssTop, height: cssHeight }}
            />
            <div
              ref={(el) => {
                progressSegRefs.current[i] = el;
              }}
              className="blog-scrollbar-progress"
              style={{
                left: AXIS_X - 1,
                top: cssTop,
                height: cssHeight,
                opacity: 0,
              }}
            />
          </div>
        );
      })}

      {headings.map((h, i) => {
        const isActive = activeId === h.id;

        return (
          <button
            key={h.id}
            className="blog-scrollbar-dot-wrapper"
            style={{
              top: `${shownDotPositions[i]}%`,
              left: AXIS_X - halfDot,
            }}
            onClick={() => scrollTo(shownDotPositions[i])}
            tabIndex={-1}
          >
            <span
              className={`blog-scrollbar-dot ${isActive ? "active" : ""}`}
              style={{ width: DOT_SIZE, height: DOT_SIZE }}
            />
            <span
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className={`blog-scrollbar-label ${isNear ? "visible" : ""} ${isActive ? "active" : ""}`}
              style={{ paddingLeft: 0 }}
            >
              {h.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}

