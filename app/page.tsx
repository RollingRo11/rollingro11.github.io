"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { useCustomTheme, ColorMode } from "@/components/custom-theme-provider";

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

  const sunAscii = "\u2726"; // ✦ BLACK FOUR POINTED STAR (shown in dark mode)
  const moonAscii = "\u2727"; // ✧ WHITE FOUR POINTED STAR (shown in light mode)

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-dvh selection:bg-blue-600 selection:text-white dark:bg-[#222129] dark:text-white dark:selection:bg-[#85BAA1] dark:selection:text-white bg-[rgb(238,238,238)] text-black">
      {/* Header with name and theme toggle */}
      <div
        className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 py-8 sm:py-12 lg:py-16 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-normal">Rohan Kathuria</h1>
          <button
            className="text-4xl bg-transparent border-none cursor-pointer focus:outline-none sm:hidden"
            style={{ fontFamily: "var(--font-departure-mono)" }}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            title="Toggle color mode"
          >
            {colorMode === "light" ? moonAscii : sunAscii}
          </button>
        </div>
        <div className="flex items-center gap-6 sm:gap-6 lg:gap-8 text-xl sm:text-2xl flex-wrap justify-center sm:justify-end">
          <Link
            href="https://github.com/RollingRo11"
            className="text-blue-600 dark:text-[#85BAA1] hover:underline tracking-wider"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </Link>
          <Link
            href="https://linkedin.com/in/rohanekathuria"
            className="text-blue-600 dark:text-[#85BAA1] hover:underline tracking-wider"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Link>
          <button
            className="text-4xl bg-transparent border-none cursor-pointer focus:outline-none hidden sm:block"
            style={{ fontFamily: "var(--font-departure-mono)" }}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            title="Toggle color mode"
          >
            {colorMode === "light" ? moonAscii : sunAscii}
          </button>
        </div>
      </div>

      {/* Main content with line numbers */}
      <main className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 sm:pb-16 lg:pb-20">
        <div className="relative">
          {/* Continuous vertical line */}
          <div className="absolute left-8 sm:left-10 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" />

          <div className="space-y-1">
            {(() => {
              const lines: Array<
                { type: "content"; content: React.ReactNode; center?: boolean } | { type: "spacer"; height: string }
              > = [
                // Intro
                {
                  type: "content",
                  content: (
                    <p className="text-lg sm:text-xl leading-relaxed">
                      I'm a 2nd year undergraduate student at Northeastern University majoring in Computer Science with
                      a concentration in Artificial intelligence. I'm currently working on{" "}
                      <Link href="/interpretability" className="text-blue-600 dark:text-[#85BAA1] hover:underline">
                        mechanistic interpretability
                      </Link>{" "}
                      research in the hopes that we can understand the superintelligence we might one day create.
                    </p>
                  ),
                },
                { type: "spacer", height: "h-4" },
                // Research
                {
                  type: "content",
                  center: true,
                  content: (
                    <h2 className="text-3xl sm:text-4xl font-normal" style={{ fontFamily: "var(--font-crimson-pro)" }}>
                      Research
                    </h2>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <h3 className="text-lg sm:text-xl font-normal">Mechanistic Interpretability @ the NEURAI Lab</h3>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">In Progress</p>,
                },
                {
                  type: "content",
                  content: (
                    <p className="text-lg sm:text-xl leading-relaxed">
                      Building tools and performing research to understand how models develop their thoughts over time.
                    </p>
                  ),
                },
                { type: "spacer", height: "h-4" },
                // Projects
                {
                  type: "content",
                  center: true,
                  content: (
                    <h2 className="text-3xl sm:text-4xl font-normal" style={{ fontFamily: "var(--font-crimson-pro)" }}>
                      Projects
                    </h2>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <Link
                      href="https://github.com/RollingRo11/crosslayer-features"
                      className="text-blue-600 dark:text-[#85BAA1] hover:underline text-lg sm:text-xl font-medium block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sparse Crosscoders
                    </Link>
                  ),
                },
                {
                  type: "content",
                  content: (
                    <p className="text-lg sm:text-xl leading-relaxed">
                      Development repository used to train acausal{" "}
                      <Link
                        href="https://transformer-circuits.pub/2024/crosscoders/index.html"
                        className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        crosscoders
                      </Link>{" "}
                      at all layers of a language model.
                    </p>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <Link
                      href="https://github.com/RollingRo11/llama2"
                      className="text-blue-600 dark:text-[#85BAA1] hover:underline text-lg sm:text-xl font-medium block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Llama 2
                    </Link>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: <p className="text-lg sm:text-xl leading-relaxed">Meta's Llama2 model from scratch.</p>,
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <Link
                      href="https://github.com/RollingRo11/attention-is-all-you-need"
                      className="text-blue-600 dark:text-[#85BAA1] hover:underline text-lg sm:text-xl font-medium block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Attention Is All You Need
                    </Link>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <p className="text-lg sm:text-xl leading-relaxed">
                      Simple implementation of the transformer architecture.
                    </p>
                  ),
                },
                { type: "spacer", height: "h-4" },
                // Other things
                {
                  type: "content",
                  center: true,
                  content: (
                    <h2 className="text-3xl sm:text-4xl font-normal" style={{ fontFamily: "var(--font-crimson-pro)" }}>
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
                      <Link href="/design" className="text-blue-600 dark:text-[#85BAA1] hover:underline">
                        Design Portfolio!
                      </Link>
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
                        href="https://rkathuria.bearblog.dev/"
                        className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Blog!
                      </Link>
                    </div>
                  ),
                },
                { type: "spacer", height: "h-2" },
                {
                  type: "content",
                  center: true,
                  content: (
                    <div className="text-lg sm:text-xl font-medium">
                      •{" "}
                      <Link
                        href="https://generatenu.com/"
                        className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Generate
                      </Link>{" "}
                      Design
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
                        className="text-blue-600 dark:text-[#85BAA1] hover:underline"
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
                        className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        REV
                      </Link>{" "}
                      Cohort 4
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
                        href="https://news.northeastern.edu/2025/04/02/student-ai-expertise-business-clinic/"
                        className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Northeastern University Artificial Intelligence Clinic
                      </Link>
                    </div>
                  ),
                },
                {
                  type: "content",
                  content: (
                    <p className="text-lg sm:text-xl leading-relaxed pl-4">
                      (Founded a program that teaches small busineses how to use AI tools).
                    </p>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <div className="text-lg sm:text-xl font-medium">
                      •{" "}
                      <Link
                        href="https://makerspaces.northeastern.edu/spaces/oakland/"
                        className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Northeastern University Oakland Makerspace
                      </Link>
                    </div>
                  ),
                },
                { type: "spacer", height: "h-4" },
                // Contact
                {
                  type: "content",
                  center: true,
                  content: (
                    <h2 className="text-3xl sm:text-4xl font-normal" style={{ fontFamily: "var(--font-crimson-pro)" }}>
                      Contact
                    </h2>
                  ),
                },
                {
                  type: "content",
                  center: true,
                  content: (
                    <p className="text-lg sm:text-xl">
                      You can contact me at{" "}
                      <Link
                        href="mailto:kathuria.r@northeastern.edu"
                        className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                      >
                        rohan.kathuria@live.com
                      </Link>
                      {"."}
                    </p>
                  ),
                },
              ];

              // Build line number mapping (only content lines get numbers)
              const lineNumbers: number[] = [];
              let num = 0;
              lines.forEach((line) => {
                if (line.type === "content") {
                  num++;
                  lineNumbers.push(num);
                } else {
                  lineNumbers.push(-1); // spacer
                }
              });

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

                // Calculate display number
                let displayNum: number | string = currentLineNum;
                if (hoveredLine !== null) {
                  const diff = currentLineNum - hoveredLine;
                  displayNum = diff === 0 ? currentLineNum : Math.abs(diff);
                }

                return (
                  <div
                    key={i}
                    className={`flex ${line.center ? "items-center" : "items-start"} cursor-default`}
                    onMouseEnter={() => handleLineEnter(currentLineNum)}
                    onMouseLeave={handleLineLeave}
                  >
                    <span
                      className={`w-8 sm:w-10 text-right pr-3 sm:pr-4 select-none shrink-0 text-sm sm:text-base ${transitionEnabled ? "transition-colors" : ""} ${!line.center ? "pt-1" : ""} ${hoveredLine === currentLineNum ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-600"}`}
                      style={{ fontFamily: "var(--font-departure-mono)" }}
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
