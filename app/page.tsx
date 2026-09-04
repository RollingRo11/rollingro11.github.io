import Link from "next/link";
import { SiteHeader } from "@/components/site/header";
import { Watercolor } from "@/components/home/watercolor";

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

      <main className="site-main shell">
        <div className="plate">
          <Watercolor className="plate__specimen" />
        </div>

        <div className="stack intro">
          <p>
            Howdy! I&apos;m Rohan. I&apos;m a computer science student at Northeastern University,
            concentrated in artificial intelligence. I work on mechanistic interpretability: the
            field of research dedicated to understanding the internal computations of AI models.
          </p>

          <p>
            I&apos;m currently a research fellow with the{" "}
            <a href="https://baulab.info/" className="link" target="_blank" rel="noopener noreferrer">
              Bau Lab
            </a>
            , through the{" "}
            <a
              href="https://www.cbai.ai/"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cambridge&ndash;Boston Alignment Initiative
            </a>
            . I&apos;ve previously worked with{" "}
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

          <p>
            My email is{" "}
            <a href="mailto:kathuria.r@northeastern.edu" className="link">
              kathuria.r@northeastern.edu
            </a>
            . All of my code can be found on my{" "}
            <a
              href="https://github.com/RollingRo11"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            . You can also find me on Twitter{" "}
            <a href="https://x.com/rollingro11" className="link" target="_blank" rel="noopener noreferrer">
              @rollingro11
            </a>{" "}
            and{" "}
            <a
              href="https://linkedin.com/in/rohanekathuria"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            .
          </p>
        </div>

        <section>
          <p className="section-label">Elsewhere</p>
          <ul className="bullet-list">
            {elsewhere.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link" target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

      </main>
    </div>
  );
}
