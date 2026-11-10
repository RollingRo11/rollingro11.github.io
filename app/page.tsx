import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/header";
import { Plate } from "@/components/home/plate";

const elsewhere = [
  { href: "https://aisst.ai/", title: "AISST" },
  { href: "https://generatenu.com/", title: "Generate" },
  { href: "https://www.ktpneu.org/", title: "Kappa Theta Pi" },
  { href: "https://rev.school/", title: "REV" },
];

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

          <section>
            <p className="label">Elsewhere</p>
            <ul>
              {elsewhere.map((item) => (
                <li key={item.href}>
                  <Out href={item.href}>{item.title}</Out>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
