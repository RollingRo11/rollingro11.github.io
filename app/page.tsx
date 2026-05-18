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

  const sunAscii = "☀";
  const moonAscii = "☾";

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  const linkClass = "text-blue-600 no-underline hover:underline dark:text-inherit dark:underline";

  return (
    <div className="min-h-dvh selection:bg-blue-600 selection:text-white dark:bg-[#222129] dark:text-white dark:selection:bg-[#85BAA1] dark:selection:text-white bg-white text-black">
      {/* Header area aligned with text content */}
      <div
        className="max-w-[52rem] mx-auto pl-6 sm:pl-[calc(2.5rem+2.5rem+1.25rem)] lg:pl-[calc(5rem+2.5rem+1.25rem)] pr-6 sm:pr-10 lg:pr-20 pt-6 sm:pt-8"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        <div className="flex items-baseline justify-between mt-8 mb-6">
          <h1 className="text-2xl sm:text-3xl font-normal group/name">Rohan<span className="hidden group-hover/name:inline"> [Emrick]</span> Kathuria</h1>
          <nav className="flex items-center gap-5">
            <Link
              href="/blog/"
              className="text-xl opacity-70 hover:opacity-100 transition-opacity no-underline"
              style={{ color: "inherit" }}
            >
              Blog
            </Link>
            <button
              className="bg-transparent border-none cursor-pointer focus:outline-none flex items-center justify-center w-[1.5em] h-[1.5em] text-xl p-0"
              style={{ fontFamily: "var(--font-departure-mono)" }}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              title="Toggle color mode"
            >
              <span
                className="leading-none"
                style={
                  colorMode === "light"
                    ? { fontSize: "1.35em", position: "relative", top: "1px", left: "-1px" }
                    : { fontSize: "1.75em", position: "relative", top: "2px" }
                }
              >
                {colorMode === "light" ? moonAscii : sunAscii}
              </span>
            </button>
          </nav>
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
                | { type: "content"; content: React.ReactNode; header?: boolean }
                | { type: "spacer"; height: string }
              > = [
                {
                  type: "content",
                  content: (
                    <p className="text-2xl sm:text-2xl leading-relaxed">
                      Howdy! I&apos;m a 2nd year CS student at Northeastern University focused on{" "}
                      <Link href="/interpretability" className={linkClass}>
                        mechanistic interpretability.
                      </Link>{" "}
                      I&apos;m currently a research fellow at the{" "}
                      <Link
                        href="https://sparai.org/"
                        className={linkClass}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Supervised Program for Alignment Research
                      </Link>{" "}
                      working under Santiago Aranguri (PhD @ NYU, Goodfire) on decreasing model evaluation
                      awareness. I&apos;m also a technical fellow at{" "}
                      <Link
                        href="https://aisst.ai/"
                        className={linkClass}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Harvard&apos;s AI Safety Student Team
                      </Link>
                      .
                    </p>
                  ),
                },
                { type: "spacer", height: "h-2" },
                {
                  type: "content",
                  content: (
                    <p className="text-2xl sm:text-2xl leading-relaxed">
                      I was previously at{" "}
                      <Link
                        href="https://neurai.sites.northeastern.edu/our-team/rohan-kathuria/"
                        className={linkClass}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Northeastern&apos;s Research in AI Lab
                      </Link>{" "}
                      in Silicon Valley working on understanding cross-layer superposition.
                    </p>
                  ),
                },
                { type: "spacer", height: "h-4" },
                {
                  type: "content",
                  header: true,
                  content: (
                    <h2 className="text-2xl sm:text-3xl font-normal" style={{ fontFamily: "var(--font-crimson-pro)" }}>
                      Other things
                    </h2>
                  ),
                },
                {
                  type: "content",
                  content: (
                    <div className="text-2xl sm:text-2xl">
                      • Design @{" "}
                      <Link
                        href="https://generatenu.com/"
                        className={linkClass}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Generate
                      </Link>
                    </div>
                  ),
                },
                {
                  type: "content",
                  content: (
                    <div className="text-2xl sm:text-2xl">
                      •{" "}
                      <Link
                        href="https://www.ktpneu.org/"
                        className={linkClass}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Kappa Theta Pi
                      </Link>{" "}
                      @ Northeastern, Tech Lead
                    </div>
                  ),
                },
                {
                  type: "content",
                  content: (
                    <div className="text-2xl sm:text-2xl">
                      •{" "}
                      <Link
                        href="https://www.rev.school/"
                        className={linkClass}
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
                  content: (
                    <p className="text-2xl sm:text-2xl leading-relaxed">
                      kathuria.r@northeastern.edu
                      {" | "}
                      <Link
                        href="https://linkedin.com/in/rohanekathuria"
                        className={linkClass}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        linkedin
                      </Link>
                      {" | "}
                      <Link
                        href="https://github.com/RollingRo11"
                        className={linkClass}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        github
                      </Link>
                    </p>
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
                      className={`hidden sm:block w-8 sm:w-10 text-right pr-3 sm:pr-4 select-none shrink-0 text-sm sm:text-base ${transitionEnabled ? "transition-colors" : ""} ${hoveredLine === currentLineNum ? "text-black dark:text-gray-200" : "text-gray-400 dark:text-gray-600"}`}
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
    </div>
  );
}
