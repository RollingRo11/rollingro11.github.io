import Link from "next/link";
import { ModeToggle } from "@/components/site/mode-toggle";

export function SiteHeader({ crumb, wide }: { crumb?: string; wide?: boolean } = {}) {
  return (
    <header className={`site-header shell${wide ? " shell--wide" : ""}`} data-rise>
      <div className="site-header__row">
        <p className="wordmark">
          <Link href="/" className="wordmark__link">
            Rohan Kathuria
          </Link>
          {crumb && (
            <span>
              <span className="wordmark__sep">/</span>
              <span className="wordmark__crumb">{crumb}</span>
            </span>
          )}
        </p>

        <nav className="site-nav">
          <Link href="/blog/" className="site-nav__link">
            Writing
          </Link>
          <ModeToggle />
        </nav>
      </div>
      <div className="site-header__rule" />
    </header>
  );
}
