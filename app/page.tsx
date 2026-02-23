"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { useCustomTheme } from "@/components/custom-theme-provider";

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

  return (
    <div className="min-h-dvh selection:bg-blue-600 selection:text-white dark:bg-[#222129] dark:text-white dark:selection:bg-[#85BAA1] dark:selection:text-white bg-white text-black">
      {/* Header area aligned with text content */}
      <div
        className="max-w-[52rem] mx-auto pl-[calc(1.5rem+2rem+1rem)] sm:pl-[calc(2.5rem+2.5rem+1.25rem)] lg:pl-[calc(5rem+2.5rem+1.25rem)] pr-6 sm:pr-10 lg:pr-20 pt-6 sm:pt-8"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        <div className="flex items-baseline justify-between mt-8 mb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-normal">Rohan Kathuria</h1>
            <button
              className="sm:hidden text-3xl bg-transparent border-none cursor-pointer focus:outline-none"
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
          <div className="hidden sm:flex items-center gap-6 lg:gap-8 text-xl sm:text-2xl">
            <Link
              href="https://linkedin.com/in/rohanekathuria"
              className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70 tracking-wider"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>
            <Link
              href="/blog/"
              className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70 tracking-wider"
            >
              Blog
            </Link>
            <button
              className="text-2xl bg-transparent border-none cursor-pointer focus:outline-none"
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
          {/* Continuous vertical line */}
          <div className="absolute left-8 sm:left-10 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" />

          <div className="space-y-1">
            {(() => {
              const lines: Array<
                | { type: "content"; content: React.ReactNode; center?: boolean; header?: boolean }
                | { type: "spacer"; height: string }
              > = [
                // Intro
                {
                  type: "content",
                  content: (
                    <p className="text-lg sm:text-xl leading-relaxed">
                      Howdy! I'm a 2nd year CS student at Northeastern University focused on{" "}
                      <Link
                        href="/interpretability"
                        className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70"
                      >
                        mechanistic interpretability.
                      </Link>{" "}
                      I'm currently a research fellow at the{" "}
                      <Link
                        href="https://sparai.org/"
                        className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Supervised Program for Alignment Research
                      </Link>{" "}
                      working under Santiago Aranguri (PhD @ NYU, Goodfire) on decreasing model evaluation awareness.
                      I'm also a technical fellow at{" "}
                      <Link
                        href="https://aisst.ai/"
                        className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Harvard's AI Safety Student Team
                      </Link>
                      .
                    </p>
                  ),
                },
                { type: "spacer", height: "h-2" },
                {
                  type: "content",
                  content: (
                    <p className="text-lg sm:text-xl leading-relaxed">
                      I was previously at Northeastern's{" "}
                      <Link
                        href="https://neurai.sites.northeastern.edu/"
                        className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Research in AI Lab
                      </Link>{" "}
                      in Silicon Valley working on understanding cross-layer superposition.
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
                    <div className="text-lg sm:text-xl font-medium">
                      •{" "}
                      <Link
                        href="https://generatenu.com/"
                        className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70"
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
                    <div className="text-lg sm:text-xl font-medium">
                      •{" "}
                      <Link
                        href="https://www.ktpneu.org/"
                        className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Kappa Theta Pi
                      </Link>{" "}
                      @ Northeastern - Gamma Class
                    </div>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <div className="text-lg sm:text-xl font-medium">
                      •{" "}
                      <Link
                        href="https://www.rev.school/"
                        className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        REV
                      </Link>{" "}
                      Cohort 4
                    </div>
                  ),
                },
                { type: "spacer", height: "h-4" },
                {
                  type: "content",
                  center: true,
                  content: (
                    <p className="text-lg sm:text-xl">
                      You can contact me at{" "}
                      <Link
                        href="mailto:kathuria.r@northeastern.edu"
                        className="text-blue-600 no-underline hover:underline dark:text-current dark:underline dark:decoration-2 dark:decoration-current/40 dark:hover:decoration-current/70"
                      >
                        kathuria.r@northeastern.edu
                      </Link>
                      {"."}
                    </p>
                  ),
                },
              ];

              let lineNum = 0;
              return lines.map((line, i) => {
                if (line.type === "spacer") {
                  return (
                    <div key={i} className={`flex ${line.height}`}>
                      <div className="w-8 sm:w-10 shrink-0" />
                      <div className="pl-4 sm:pl-5 flex-1" />
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
                      className={`w-8 sm:w-10 text-right pr-3 sm:pr-4 select-none shrink-0 text-sm sm:text-base ${transitionEnabled ? "transition-colors" : ""} ${hoveredLine === currentLineNum ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}`}
                      style={{
                        fontFamily: "var(--font-departure-mono)",
                        transform: `translateY(${line.header ? "-2px" : "1px"})`,
                      }}
                    >
                      {displayNum}
                    </span>
                    <div className="pl-4 sm:pl-5 flex-1">{line.content}</div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
