import Link from "next/link";
import { SiteHeader } from "@/components/site/header";

const elsewhere = [
  { href: "https://aisst.ai/", title: "AISST" },
  { href: "https://generatenu.com/", title: "Generate" },
  { href: "https://www.ktpneu.org/", title: "Kappa Theta Pi" },
  { href: "https://rev.school/", title: "REV" },
];

export default function Home() {
  return (
    <div className="page">
      <SiteHeader />

      <main className="site-main site-main--large shell">
        <div className="stack" data-rise style={{ "--rise-i": 1 } as React.CSSProperties}>
          <p>
            Howdy! I&apos;m Rohan. I&apos;m a computer science student at Northeastern University,
            concentrated in artificial intelligence. I work on{" "}
            <Link href="/interpretability/" className="link">
              mechanistic interpretability
            </Link>
            .
          </p>

          <p>
            I&apos;m currently a research fellow with the{" "}
            <a href="https://baulab.info/" className="link" target="_blank" rel="noopener noreferrer">
              Bau Lab
            </a>
            , through the{" "}
            <a
              href="https://www.cbai.ai/summer-research-fellowship-26"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cambridge&ndash;Boston Alignment Initiative
            </a>
            .
          </p>

          <p>
            I&apos;ve previously worked with{" "}
            <a
              href="https://neurai.sites.northeastern.edu/our-team/rohan-kathuria/"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Northeastern&apos;s Research in AI Lab
            </a>{" "}
            on cross-layer superposition, and with{" "}
            <a href="https://www.goodfire.ai/" className="link" target="_blank" rel="noopener noreferrer">
              Goodfire
            </a>{" "}
            on understanding evaluation awareness in language models.
          </p>
        </div>

        <section data-rise style={{ "--rise-i": 2 } as React.CSSProperties}>
          <p className="section-label">Elsewhere</p>
          <ul className="link-list link-list--bullets focus-group">
            {elsewhere.map((item) => (
              <li key={item.href} className="focus-item">
                <a href={item.href} className="link-row" target="_blank" rel="noopener noreferrer">
                  <span className="link-row__title">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section data-rise style={{ "--rise-i": 3 } as React.CSSProperties}>
          <p className="section-label">Contact</p>
          <div className="contact">
            <a href="mailto:kathuria.r@northeastern.edu" className="link">
              kathuria.r@northeastern.edu
            </a>
            <span className="contact__links">
              <a
                href="https://linkedin.com/in/rohanekathuria"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/RollingRo11"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
