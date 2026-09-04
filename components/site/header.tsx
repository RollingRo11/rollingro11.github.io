import Link from "next/link";
import { ModeToggle } from "@/components/site/mode-toggle";

// The rail: one hairline bar across the top, contents aligned to the column.
export function SiteHeader({ crumb }: { crumb?: string } = {}) {
  return (
    <header className="rail" data-rise>
      <div className="rail__inner shell">
        <p className="wordmark">
          <Link href="/" className="wordmark__link">
            Rohan Kathuria
          </Link>
          {crumb && <span className="wordmark__crumb">/ {crumb}</span>}
        </p>

        <nav className="rail__nav" aria-label="Site">
          <Link href="/blog/" className="rail__link">
            Writing
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
