import Link from "next/link";
import { ModeToggle } from "@/components/site/mode-toggle";

// The rail: wordmark and nav, aligned to the reading column. Blog pages pass
// `back`, which takes the place of the Writing link.
export function SiteHeader({ crumb, back }: { crumb?: string; back?: string } = {}) {
  return (
    <header className="rail shell">
      <p className="wordmark">
        <Link href="/">Rohan Kathuria</Link>
        {crumb && <span className="wordmark__crumb label">/ {crumb}</span>}
      </p>

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
