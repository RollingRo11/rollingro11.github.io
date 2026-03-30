"use client";

import Link from "next/link";
import { useCustomTheme } from "@/components/custom-theme-provider";

export function BlogHeader() {
  const { colorMode, setColorMode } = useCustomTheme();

  const sunAscii = "\u2600";
  const moonAscii = "\u263E";

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <div
      className="max-w-[52rem] mx-auto pl-6 sm:pl-[calc(2.5rem+2.5rem+1.25rem)] lg:pl-[calc(5rem+2.5rem+1.25rem)] pr-6 sm:pr-10 lg:pr-20 pt-6 sm:pt-8"
      style={{ fontFamily: "var(--font-crimson-pro)" }}
    >
      <div className="flex items-baseline justify-between mt-8 mb-6">
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-normal no-underline"
          style={{ color: "inherit" }}
        >
          Rohan Kathuria
        </Link>
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
  );
}
