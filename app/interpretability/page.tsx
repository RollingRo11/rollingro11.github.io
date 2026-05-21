import { BlogHeader } from "@/components/blog/blog-header";
import { Card, ActionListItem, Divider } from "@/components/srcl";

export default function Interpretability() {
  return (
    <div className="srcl-page">
      <BlogHeader crumb="Interpretability?" />

      <main className="srcl-main">
        <Card title="Why Mechanistic Interpretability?">
          <p>
            AI models are grown, not built. We build the environments, algorithms, and data pipelines
            to train models, but they &ldquo;learn&rdquo; their own way.
          </p>
          <p>
            Mechanistic Interpretability is the science of breaking down an AI model into
            human-interpretable mechanisms in order to decipher those learnings. It&apos;s an attempt
            to understand the connections the model is making so we can further grasp how Artificial
            Intelligence thinks. For large language models, this research can yield findings that
            improve model architecture, post-training decisions, and navigating limitations and
            safety risks on certain tasks.
          </p>
          <p>
            I fully believe in (and am probably more interested in) long-horizon, ambitious
            interpretability goals. Fundamentally understanding what is happening inside these models
            will yield incredible byproducts of science for safety, alignment, and other fields of AI
            research. Just because this task sounds Sisyphean doesn&apos;t mean we can&apos;t push
            the needle &mdash; or the boulder &mdash; in a meaningful direction.
          </p>

          <Divider type="double" style={{ margin: "0.75rem 0" }} />

          <p className="srcl-section-label">Read more</p>
          <ActionListItem href="https://www.darioamodei.com/post/the-urgency-of-interpretability#the-utility-of-interpretability">
            <span className="srcl-ul">The Urgency of Interpretability</span> &nbsp;·&nbsp; Dario Amodei
          </ActionListItem>
          <ActionListItem href="https://www.alignmentforum.org/posts/Hy6PX43HGgmfiTaKu/an-ambitious-vision-for-interpretability">
            <span className="srcl-ul">An Ambitious Vision for Interpretability</span> &nbsp;·&nbsp; AI Alignment Forum
          </ActionListItem>
          <ActionListItem href="https://web.stanford.edu/~cgpotts/blog/interp/">
            <span className="srcl-ul">Assessing Skeptical Views of Interpretability Research</span> &nbsp;·&nbsp; Chris Potts
          </ActionListItem>
          <ActionListItem href="https://dynalist.io/d/n2ZWtnoYHrU1s4vnFSAQ519J">
            <span className="srcl-ul">Mechanistic Interpretability Resources</span> &nbsp;·&nbsp; Neel Nanda
          </ActionListItem>
          <ActionListItem href="https://www.alignmentforum.org/posts/jP9KDyMkchuv6tHwm/how-to-become-a-mechanistic-interpretability-researcher">
            <span className="srcl-ul">How to Become a Mechanistic Interpretability Researcher</span> &nbsp;·&nbsp; Neel Nanda
          </ActionListItem>
        </Card>
      </main>
    </div>
  );
}
