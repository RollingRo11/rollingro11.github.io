"use client";

import Link from "next/link";
import Image from "next/image";
import { useCustomTheme } from "@/components/custom-theme-provider";

export default function Design() {
  const { colorMode, setColorMode } = useCustomTheme();

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
          <Link
            href="https://rkathuria.bearblog.dev/"
            className="text-blue-600 dark:text-[#85BAA1] hover:underline tracking-wider"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
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

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 sm:pb-16 lg:pb-20 -mt-4 sm:-mt-6">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg sm:text-xl text-blue-600 dark:text-[#85BAA1] hover:underline mb-6"
        >
          <span>&larr;</span>
          <span>Back</span>
        </Link>

        {/* Page title */}
        <h2
          className="text-3xl sm:text-4xl font-normal mb-6"
          style={{ fontFamily: "var(--font-crimson-pro)" }}
        >
          Design Work
        </h2>

        {/* Content */}
        <section className="space-y-8">
          <p className="text-lg sm:text-xl leading-relaxed">
            A collection of my design work.
          </p>

          {/* This Website */}
          <div className="space-y-4">
            <h3
              className="text-2xl sm:text-3xl font-normal"
              style={{ fontFamily: "var(--font-crimson-pro)" }}
            >
              This Website
            </h3>

            {/* Screenshots */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Image
                  src="/desktop.png"
                  alt="Desktop view of this website"
                  width={800}
                  height={500}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 w-full"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Desktop</p>
              </div>
              <div className="space-y-2">
                <Image
                  src="/mobile.png"
                  alt="Mobile view of this website"
                  width={800}
                  height={500}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 w-full"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Mobile</p>
              </div>
            </div>

            {/* Fonts */}
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-medium">Fonts</h4>
              <p className="text-base sm:text-lg">
                <span style={{ fontFamily: "var(--font-crimson-pro)" }}>Crimson Pro</span>
                {" / "}
                <span style={{ fontFamily: "var(--font-paper-mono)" }}>Paper Mono</span>
                {" / "}
                <span style={{ fontFamily: "var(--font-departure-mono)" }}>Departure Mono</span>
              </p>
            </div>

            {/* Color Palette */}
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-medium">Color Palette</h4>
              <div className="grid grid-cols-5 gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#EEEEEE" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#EEEEEE</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#222129" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#222129</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#000000" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#000000</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#FFFFFF</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#2563EB" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#2563EB</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#85BAA1" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#85BAA1</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#9CA3AF" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#9CA3AF</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#4B5563" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#4B5563</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#D1D5DB" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#D1D5DB</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#374151" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#374151</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
