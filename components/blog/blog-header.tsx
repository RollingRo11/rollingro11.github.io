"use client";

import Link from "next/link";
import { ThemePicker } from "@/components/theme-picker";

export function BlogHeader({ crumb, wide }: { crumb?: string; wide?: boolean } = {}) {
  return (
    <header className={`srcl-header ${wide ? "srcl-header--wide" : ""}`.trim()}>
      <div className="srcl-header-row">
        <h1 className="srcl-header-title">
          <Link href="/" className="srcl-header-link srcl-name group/name">
            Rohan<span className="hidden group-hover/name:inline"> [Emrick]</span> Kathuria
          </Link>
          {crumb && (
            <>
              <span className="srcl-header-crumb-sep">/</span>
              <span className="srcl-header-crumb">{crumb}</span>
            </>
          )}
        </h1>
        <nav className="srcl-header-nav">
          <Link href="/blog/" className="srcl-header-navlink">
            Blog
          </Link>
          <ThemePicker />
        </nav>
      </div>
      <div className="srcl-header-hairline" />
    </header>
  );
}
