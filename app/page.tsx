import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/header";
import { Plate } from "@/components/home/plate";

const elsewhere = [
  { href: "https://aisst.ai/", title: "AISST" },
  { href: "https://generatenu.com/", title: "Generate" },
  { href: "https://www.ktpneu.org/", title: "Kappa Theta Pi" },
  { href: "https://rev.school/", title: "REV" },
];

// The site's stem mark (public/stem.svg) turned on its side, as the divider
// between the intro and the links below it. Strokes are heavier than the
// original so they stay as solid as the dots at this small size.
function StemRule() {
  return (
    <svg className="stem-rule" viewBox="0 27 100 46" aria-hidden="true">
      <g transform="rotate(90 50 50)" fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M50 92V8" strokeWidth="4" />
        <path
          d="M50 80C28 80 28 62 50 62M50 58C72 58 72 40 50 40M50 36C28 36 28 18 50 18"
          strokeWidth="3"
        />
        <g fill="currentColor" stroke="none">
          <circle cx="33.5" cy="71" r="4.4" />
          <circle cx="66.5" cy="49" r="4.4" />
          <circle cx="33.5" cy="27" r="4.4" />
          <circle cx="50" cy="8" r="4.6" />
          <circle cx="50" cy="92" r="4.6" />
        </g>
      </g>
    </svg>
  );
}

function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <div className="page">
      <SiteHeader />

      <main className="home shell">
        <Plate />

        <div className="prose">
          <p>
            Hey! I&apos;m Rohan. I&apos;m a computer science student at Northeastern concentrated in
            artificial intelligence. I work on{" "}
            <Out href="https://en.wikipedia.org/wiki/Mechanistic_interpretability">
              mechanistic interpretability
            </Out>
            .
          </p>

          <p>
            I&apos;m currently a researcher at <Out href="https://parallx.ai/">Parallax</Out>.
            I&apos;ve previously worked with the <Out href="https://baulab.info/">Bau Lab</Out>,
            through the{" "}
            <Out href="https://www.cbai.ai/">Cambridge&ndash;Boston Alignment Initiative</Out>,{" "}
            <Out href="https://neurai.sites.northeastern.edu/our-team/rohan-kathuria/">
              Northeastern&apos;s Research in AI Lab
            </Out>{" "}
            on cross-layer superposition, and with <Out href="https://www.goodfire.ai/">Goodfire</Out>{" "}
            on understanding evaluation awareness in language models.
          </p>

          <p>
            My email is <a href="mailto:kathuria.r@northeastern.edu">kathuria.r@northeastern.edu</a>.
            All of my code can be found on my <Out href="https://github.com/RollingRo11">GitHub</Out>.
            You can also find me on Twitter <Out href="https://x.com/rollingro11">@rollingro11</Out>{" "}
            and <Out href="https://linkedin.com/in/rohanekathuria">LinkedIn</Out>.
          </p>

          <StemRule />

          <ul>
            {elsewhere.map((item) => (
              <li key={item.href}>
                <Out href={item.href}>{item.title}</Out>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
