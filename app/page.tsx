"use client";

import Link from "next/link";
import { BlogHeader } from "@/components/blog/blog-header";
import { Card, ActionListItem, Divider, RowSpaceBetween } from "@/components/srcl";

export default function Home() {
  const link = "srcl-link";

  return (
    <div className="srcl-page">
      <BlogHeader />

      <main className="srcl-main">
        <Card>
          <p>
            Howdy! I&apos;m a Computer Science student at Northeastern University concentrated in
            Artificial Intelligence. I work on{" "}
            <Link href="/interpretability" className={link}>
              mechanistic interpretability
            </Link>
            .
          </p>

          <p>
            I&apos;m currently working with the{" "}
            <a href="https://baulab.info/" className={link} target="_blank" rel="noopener noreferrer">
              Bau Lab
            </a>{" "}
            as a research fellow for the{" "}
            <a
              href="https://www.cbai.ai/summer-research-fellowship-26"
              className={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cambridge-Boston Alignment Initiative
            </a>
            .
          </p>

          <p>
            I&apos;ve previously worked with{" "}
            <a
              href="https://neurai.sites.northeastern.edu/our-team/rohan-kathuria/"
              className={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Northeastern&apos;s Research in AI Lab
            </a>{" "}
            on understanding cross-layer superposition, and with{" "}
            <a href="https://www.goodfire.ai/" className={link} target="_blank" rel="noopener noreferrer">
              Goodfire
            </a>{" "}
            on understanding LLM Evaluation Awareness.
          </p>

          <Divider style={{ margin: "0.5rem 0" }} />

          <p className="srcl-section-label">Other things</p>
          <ActionListItem href="https://aisst.ai/">
            <span className="srcl-ul">AISST</span>
          </ActionListItem>
          <ActionListItem href="https://generatenu.com/">
            Design @ <span className="srcl-ul">Generate</span>
          </ActionListItem>
          <ActionListItem href="https://www.ktpneu.org/">
            <span className="srcl-ul">Kappa Theta Pi @ Northeastern</span> · Tech Lead
          </ActionListItem>
          <ActionListItem href="https://www.rev.school/">
            <span className="srcl-ul">REV</span> · Cohort 4
          </ActionListItem>

          <Divider style={{ margin: "0.5rem 0" }} />

          <p className="srcl-section-label">Contact</p>
          <RowSpaceBetween>
            <span>kathuria.r@northeastern.edu</span>
            <span>
              <a
                href="https://linkedin.com/in/rohanekathuria"
                className={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin
              </a>
              {" / "}
              <a
                href="https://github.com/RollingRo11"
                className={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                github
              </a>
            </span>
          </RowSpaceBetween>
        </Card>
      </main>
    </div>
  );
}
