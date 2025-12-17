"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCustomTheme } from "@/components/custom-theme-provider";

export default function Design() {
  const { colorMode, setColorMode } = useCustomTheme();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

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
              className="text-3xl sm:text-4xl font-normal"
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
                  className="rounded-lg border border-gray-300 dark:border-gray-700 w-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage({ src: "/desktop.png", alt: "Desktop view of this website" })}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Desktop</p>
              </div>
              <div className="space-y-2">
                <Image
                  src="/mobile.png"
                  alt="Mobile view of this website"
                  width={800}
                  height={500}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 w-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage({ src: "/mobile.png", alt: "Mobile view of this website" })}
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

          {/* Crosscoder Latent Dashboard */}
          <div className="space-y-4">
            <h3
              className="text-3xl sm:text-4xl font-normal"
              style={{ fontFamily: "var(--font-crimson-pro)" }}
            >
              Crosscoder Latent Dashboard
            </h3>

            {/* Screenshot */}
            <div className="space-y-2">
              <Image
                src="/crosscoder.png"
                alt="Crosscoder Latent Dashboard"
                width={800}
                height={500}
                className="rounded-lg border border-gray-300 dark:border-gray-700 w-full cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage({ src: "/crosscoder.png", alt: "Crosscoder Latent Dashboard" })}
              />
            </div>

            {/* Fonts */}
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-medium">Fonts</h4>
              <p className="text-base sm:text-lg">
                <span>System UI</span>
                {" / "}
                <span style={{ fontFamily: "monospace" }}>SF Mono</span>
                {" / "}
                <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span>
              </p>
            </div>

            {/* Color Palette */}
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-medium">Color Palette</h4>
              <div className="grid grid-cols-5 gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#ffffff" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#FFFFFF</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#F5F5F5</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#1a1a1a" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#1A1A1A</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#666666" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#666666</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#e1e4e8" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#E1E4E8</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#0969da" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#0969DA</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#28a745" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#28A745</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#667eea" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#667EEA</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#764ba2" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#764BA2</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#ff6b6b" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#FF6B6B</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layer Experiments */}
          <div className="space-y-4">
            <h3
              className="text-3xl sm:text-4xl font-normal"
              style={{ fontFamily: "var(--font-crimson-pro)" }}
            >
              Layer Experiments
            </h3>

            {/* Screenshots */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Image
                  src="/conceptlayer.png"
                  alt="Layer Experiments - Layer View"
                  width={800}
                  height={500}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 w-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage({ src: "/conceptlayer.png", alt: "Layer Experiments - Layer View" })}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Layer</p>
              </div>
              <div className="space-y-2">
                <Image
                  src="/conceptfeature.png"
                  alt="Layer Experiments - Feature View"
                  width={800}
                  height={500}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 w-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage({ src: "/conceptfeature.png", alt: "Layer Experiments - Feature View" })}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Feature</p>
              </div>
              <div className="space-y-2">
                <Image
                  src="/conceptsubjoiner.png"
                  alt="Layer Experiments - Subjoiner View"
                  width={800}
                  height={500}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 w-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage({ src: "/conceptsubjoiner.png", alt: "Layer Experiments - Subjoiner View" })}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Subjoiner</p>
              </div>
            </div>

            {/* Fonts */}
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-medium">Fonts</h4>
              <p className="text-base sm:text-lg">
                <span style={{ fontFamily: "monospace" }}>IBM Plex Mono</span>
              </p>
            </div>

            {/* Color Palette */}
            <div className="space-y-2">
              <h4 className="text-lg sm:text-xl font-medium">Color Palette</h4>
              <div className="grid grid-cols-5 gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#111111" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#111111</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#1a1a1a" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#1A1A1A</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#222222" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#222222</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#cccccc" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#CCCCCC</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#888888" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#888888</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#44aa77" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#44AA77</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#44aa99" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#44AA99</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#aa7744" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#AA7744</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#aa5555" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#AA5555</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: "#333333" }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">#333333</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer min-h-dvh h-full w-full"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
