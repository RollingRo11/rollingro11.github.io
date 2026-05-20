"use client";

import Link from "next/link";
import { useCustomTheme } from "@/components/custom-theme-provider";

export function BlogHeader({ crumb }: { crumb?: string } = {}) {
  const { colorMode, setColorMode } = useCustomTheme();

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <div
      className="relative z-10 max-w-[52rem] mx-auto pl-6 sm:pl-[calc(2.5rem+2.5rem+1.25rem)] lg:pl-[calc(5rem+2.5rem+1.25rem)] pr-6 sm:pr-10 lg:pr-20 pt-6 sm:pt-8"
      style={{ fontFamily: "var(--font-crimson-pro)" }}
    >
      <div className="flex items-baseline justify-between mt-8 mb-6">
        <h1 className="text-2xl sm:text-3xl font-normal">
          <Link
            href="/"
            className="no-underline group/name"
            style={{ color: "inherit" }}
          >
            Rohan<span className="hidden group-hover/name:inline"> [Emrick]</span> Kathuria
          </Link>
          {crumb && (
            <>
              <span className="opacity-50"> / </span>
              <span>{crumb}</span>
            </>
          )}
        </h1>
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
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            title="Toggle color mode"
          >
            {/* Both circles share an identical outer ring; the sun adds an
                inner dot. CSS shapes — guaranteed same center, no font fallback. */}
            <span className="relative block w-[14px] h-[14px] rounded-full border-[1.5px] border-current">
              {colorMode === "dark" && (
                <span className="absolute inset-[3px] rounded-full bg-current" />
              )}
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
