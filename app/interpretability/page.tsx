import { SiteHeader } from "@/components/site/header";

export const metadata = {
  title: "Interpretability — Rohan Kathuria",
  description: "Why mechanistic interpretability is worth working on.",
};

const reading = [
  {
    href: "https://www.darioamodei.com/post/the-urgency-of-interpretability#the-utility-of-interpretability",
    title: "The Urgency of Interpretability",
    note: "Dario Amodei",
  },
  {
    href: "https://www.alignmentforum.org/posts/Hy6PX43HGgmfiTaKu/an-ambitious-vision-for-interpretability",
    title: "An Ambitious Vision for Interpretability",
    note: "AI Alignment Forum",
  },
  {
    href: "https://web.stanford.edu/~cgpotts/blog/interp/",
    title: "Assessing Skeptical Views of Interpretability Research",
    note: "Chris Potts",
  },
  {
    href: "https://dynalist.io/d/n2ZWtnoYHrU1s4vnFSAQ519J",
    title: "Mechanistic Interpretability Resources",
    note: "Neel Nanda",
  },
  {
    href: "https://www.alignmentforum.org/posts/jP9KDyMkchuv6tHwm/how-to-become-a-mechanistic-interpretability-researcher",
    title: "How to Become a Mechanistic Interpretability Researcher",
    note: "Neel Nanda",
  },
];

export default function Interpretability() {
  return (
    <div className="page">
      <SiteHeader crumb="Interpretability" />

      <main className="site-main shell">
        <div className="stack" data-rise style={{ "--rise-i": 1 } as React.CSSProperties}>
          <h1 className="page-title">Why mechanistic interpretability?</h1>

          <p className="lede">
            AI models are grown, not built. We build the environments, algorithms, and data pipelines
            that train them, but they learn their own way.
          </p>

          <p>
            Mechanistic interpretability is the science of breaking a model down into
            human-interpretable mechanisms in order to decipher those learnings. It&apos;s an attempt
            to understand the connections a model is making, so we can grasp how artificial
            intelligence thinks. For large language models, this research yields findings that
            improve architecture, inform post-training decisions, and surface limitations and safety
            risks on specific tasks.
          </p>

          <p>
            I fully believe in — and am probably more interested in — the long-horizon, ambitious
            interpretability goals. Fundamentally understanding what happens inside these models will
            yield incredible byproducts for safety, alignment, and the rest of AI research. Just
            because the task sounds Sisyphean doesn&apos;t mean we can&apos;t push the needle, or the
            boulder, in a meaningful direction.
          </p>
        </div>

        <section data-rise style={{ "--rise-i": 2 } as React.CSSProperties}>
          <p className="section-label">Read more</p>
          <ul className="link-list focus-group">
            {reading.map((item) => (
              <li key={item.href} className="focus-item">
                <a href={item.href} className="link-row" target="_blank" rel="noopener noreferrer">
                  <span className="link-row__main">
                    <span className="link-row__title">{item.title}</span>
                    <span className="link-row__note">{item.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
