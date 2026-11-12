import type React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/site/mode-toggle";

// The rail: wordmark and nav, aligned to the reading column. Blog pages pass
// `back`, which takes the place of the Writing link. `lead` goes before the
// wordmark, such as the notes contents toggle.
export function SiteHeader({
  crumb,
  back,
  lead,
}: { crumb?: string; back?: string; lead?: React.ReactNode } = {}) {
  const wordmark = (
    <p className="wordmark">
      <Link href="/">Rohan Kathuria</Link>
      {crumb && <span className="wordmark__crumb label">/ {crumb}</span>}
    </p>
  );

  return (
    <header className="rail shell">
      {lead ? (
        <div className="rail__start">
          {lead}
          {wordmark}
        </div>
      ) : (
        wordmark
      )}

      <nav className="rail__nav" aria-label="Site">
        {back ? (
          <Link href={back} className="rail__link label">
            ← Back
          </Link>
        ) : (
          <Link href="/blog/" className="rail__link label">
            Writing
          </Link>
        )}
        <ModeToggle />
      </nav>
    </header>
  );
}
