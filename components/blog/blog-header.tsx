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
    <header
      className="blog-header"
      style={{ fontFamily: "var(--font-crimson-pro)" }}
    >
      <Link href="/" className="blog-header-name">
        Rohan Kathuria
      </Link>
      <nav className="blog-header-nav">
        <Link href="/" className="blog-header-link">
          Home
        </Link>
        <Link href="/blog/" className="blog-header-link">
          Blog
        </Link>
        <button
          className="blog-header-toggle"
          style={{ fontFamily: "var(--font-departure-mono)" }}
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
        >
          <span
            style={colorMode === "light" ? { fontSize: "0.75em" } : undefined}
          >
            {colorMode === "light" ? moonAscii : sunAscii}
          </span>
        </button>
      </nav>
    </header>
  );
}
