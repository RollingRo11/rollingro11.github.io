"use client";

import Link from "next/link";
import { useCustomTheme } from "@/components/custom-theme-provider";

export default function Interpretability() {
  const { colorMode, setColorMode } = useCustomTheme();

  const sunAscii = "\u2726"; // ✦ BLACK FOUR POINTED STAR (shown in dark mode)
  const moonAscii = "\u2727"; // ✧ WHITE FOUR POINTED STAR (shown in light mode)

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-dvh selection:bg-blue-600 selection:text-white dark:bg-[#222129] dark:text-white dark:selection:bg-[#85BAA1] dark:selection:text-white bg-[rgb(238,238,238)] text-black">
      {/* Header with name and theme toggle */}
      <div
        className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 py-8 sm:py-12 lg:py-16 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-normal">Rohan Kathuria</h1>
          <button
            className="text-4xl bg-transparent border-none cursor-pointer focus:outline-none sm:hidden"
            style={{ fontFamily: "var(--font-departure-mono)" }}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            title="Toggle color mode"
          >
            {colorMode === "light" ? moonAscii : sunAscii}
          </button>
        </div>
        <div className="flex items-center gap-6 sm:gap-6 lg:gap-8 text-xl sm:text-2xl flex-wrap justify-center sm:justify-end">
          <Link
            href="https://github.com/RollingRo11"
            className="text-blue-600 dark:text-[#85BAA1] hover:underline tracking-wider"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </Link>
          <Link
            href="https://linkedin.com/in/rohanekathuria"
            className="text-blue-600 dark:text-[#85BAA1] hover:underline tracking-wider"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Link>
          <Link
            href="https://rkathuria.bearblog.dev/"
            className="text-blue-600 dark:text-[#85BAA1] hover:underline tracking-wider"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </Link>
          <button
            className="text-4xl bg-transparent border-none cursor-pointer focus:outline-none hidden sm:block"
            style={{ fontFamily: "var(--font-departure-mono)" }}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            title="Toggle color mode"
          >
            {colorMode === "light" ? moonAscii : sunAscii}
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 sm:pb-16 lg:pb-20 -mt-4 sm:-mt-6">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg sm:text-xl text-blue-600 dark:text-[#85BAA1] hover:underline mb-6"
        >
          <span>&larr;</span>
          <span>Back</span>
        </Link>

        {/* Page title */}
        <h2 className="text-3xl sm:text-4xl font-normal mb-6" style={{ fontFamily: "var(--font-crimson-pro)" }}>
          Why Mechanistic Interpretability?
        </h2>

        {/* Content */}
        <section className="space-y-4">
          <p className="text-lg sm:text-xl leading-relaxed">
            AI models are grown, not built. We build the environments, algorithms, and data pipelines to train models,
            but they "learn" their own way.
          </p>
          <p className="text-lg sm:text-xl leading-relaxed">
            Mechanistic Interpretability is the science of breaking down an AI model into human-interpretable
            mechanisms. It's an attempt to understand the connections the model is making so we can further understand
            how Artificial Intelligence thinks. For large language models, this research can yield a deeper
            understanding of model architecture, how models think, and how we can better construct or use models for
            certain tasks.
          </p>
          <p className="text-lg sm:text-xl leading-relaxed">
            I fully believe in (and am probably more interested in) long horizon/ambitious interpretability goals. I
            think fundamentally understanding what is happening inside these models will yield incredible byproducts of
            science for safety, alignment, and other fields of AI research. Just because this task sounds Sisyphean,
            doesn't mean we can't push the needle (or, the boulder) in a meaningful direction.
          </p>
          <p className="text-lg sm:text-xl leading-relaxed">Read more:</p>
          <ul className="text-lg sm:text-xl leading-relaxed list-disc list-inside space-y-2">
            <li>
              <Link
                href="https://www.darioamodei.com/post/the-urgency-of-interpretability#the-utility-of-interpretability"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Urgency of Interpretability
              </Link>{" "}
              (Dario Amodei)
            </li>
            <li>
              <Link
                href="https://www.alignmentforum.org/posts/Hy6PX43HGgmfiTaKu/an-ambitious-vision-for-interpretability"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                An Ambitious Vision for Interpretability
              </Link>{" "}
              (AI Alignment Forum)
            </li>
            <li>
              <Link
                href="https://web.stanford.edu/~cgpotts/blog/interp/"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Assessing Skeptical Views of Interpretability Research
              </Link>{" "}
              (Chris Potts)
            </li>
            <li>
              <Link
                href="https://dynalist.io/d/n2ZWtnoYHrU1s4vnFSAQ519J"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mechanistic Interpretability Resources
              </Link>{" "}
              (Neel Nanda)
            </li>
            <li>
              <Link
                href="https://www.alignmentforum.org/posts/jP9KDyMkchuv6tHwm/how-to-become-a-mechanistic-interpretability-researcher"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                How to Become a Mechanistic Interpretability Researcher
              </Link>{" "}
              (Neel Nanda)
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
