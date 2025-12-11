"use client";

import Link from "next/link";
import { useCustomTheme, ColorMode } from "@/components/custom-theme-provider";

export default function Home() {
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
      <main className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 sm:pb-16 lg:pb-20">
        {/* Intro paragraphs */}
        <section className="mb-8 lg:mb-10 space-y-4">
          <p className="text-lg sm:text-xl leading-relaxed">
            I'm a 2nd year undergraduate student at Northeastern University majoring in Computer Science with a
            concentration in Artificial intelligence. I'm currently working on{" "}
            <Link href="/interpretability" className="text-blue-600 dark:text-[#85BAA1] hover:underline">
              mechanistic interpretability
            </Link>{" "}
            research in the hopes that we can someday understand the superintelligence might one day create.
          </p>
        </section>
        {/* Research section */}
        <section className="mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl font-normal mb-4" style={{ fontFamily: "var(--font-crimson-pro)" }}>
            Research
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-lg sm:text-xl font-normal mb-1">Mechanistic Interpretability @ the NEURAI Lab</h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">In Progress</p>
              <p className="text-lg sm:text-xl leading-relaxed">
                Building tools and performing research to understand how models develop their thoughts over time.
              </p>
            </div>
          </div>
        </section>
        {/* Projects section */}
        <section className="mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl font-normal mb-4" style={{ fontFamily: "var(--font-crimson-pro)" }}>
            Projects
          </h2>
          <div className="space-y-4">
            <div>
              <Link
                href="https://github.com/RollingRo11/crosslayer-features"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline text-lg sm:text-xl font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sparse Crosscoders
              </Link>
              <p className="text-lg sm:text-xl leading-relaxed">
                Development repository used to train acausal{" "}
                <Link
                  href="https://transformer-circuits.pub/2024/crosscoders/index.html"
                  className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  crosscoders
                </Link>{" "}
                at all layers of language models.
              </p>
            </div>
            <div>
              <Link
                href="https://github.com/RollingRo11/llama2"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline text-lg sm:text-xl font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Llama 2
              </Link>
              <p className="text-lg sm:text-xl leading-relaxed">Meta's Llama2 model from scratch.</p>
            </div>

            <div>
              <Link
                href="https://github.com/RollingRo11/attention-is-all-you-need"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline text-lg sm:text-xl font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Attention Is All You Need
              </Link>
              <p className="text-lg sm:text-xl leading-relaxed">
                Simple implementation of the transformer architecture.
              </p>
            </div>
          </div>
        </section>
        {/* Other section */}
        <section className="mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl font-normal mb-4" style={{ fontFamily: "var(--font-crimson-pro)" }}>
            Other things
          </h2>
          <ul className="space-y-1 mb-4">
            <li className="flex">
              <span className="mr-2 mt-1">•</span>
              <div>
                <div className="text-lg sm:text-xl font-medium">
                  <Link href="/design" className="text-blue-600 dark:text-[#85BAA1] hover:underline">
                    Design Portfolio!
                  </Link>
                </div>
              </div>
            </li>
            <li className="flex">
              <span className="mr-2 mt-1">•</span>
              <div>
                <div className="text-lg sm:text-xl font-medium">
                  <Link
                    href="https://rkathuria.bearblog.dev/"
                    className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blog!
                  </Link>
                </div>
              </div>
            </li>
          </ul>
          <ul className="space-y-1">
            <li className="flex">
              <span className="mr-2 mt-1">•</span>
              <div>
                <div className="text-lg sm:text-xl font-medium">
                  <Link
                    href="https://www.ktpneu.org/"
                    className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kappa Theta Pi
                  </Link>{" "}
                  @ Northeastern - Gamma Class
                </div>
              </div>
            </li>
            <li className="flex">
              <span className="mr-2 mt-1">•</span>
              <div>
                <div className="text-lg sm:text-xl font-medium">
                  <Link
                    href="https://www.rev.school/"
                    className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    REV
                  </Link>{" "}
                  Cohort 4
                </div>
              </div>
            </li>

            <li className="flex">
              <span className="mr-2 mt-1">•</span>
              <div>
                <div className="text-lg sm:text-xl font-medium">
                  <Link
                    href="https://news.northeastern.edu/2025/04/02/student-ai-expertise-business-clinic/"
                    className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Northeastern University Artificial Intelligence Clinic
                  </Link>
                  <div className="text-lg sm:text-xl leading-relaxed">
                    Founded a program that teaches small busineses how to use AI tools.
                  </div>
                </div>
              </div>
            </li>
            <li className="flex">
              <span className="mr-2 mt-1">•</span>
              <div>
                <div className="text-lg sm:text-xl font-medium">
                  <Link
                    href="https://makerspaces.northeastern.edu/spaces/oakland/"
                    className="text-blue-600 dark:text-[#85BAA1] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Northeastern University Oakland Makerspace
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </section>
        {/* Contact section */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-normal mb-4" style={{ fontFamily: "var(--font-crimson-pro)" }}>
            Contact
          </h2>
          <p className="text-lg sm:text-xl">
            You can contact me at{" "}
            <Link
              href="mailto:kathuria.r@northeastern.edu"
              className="text-blue-600 dark:text-[#85BAA1] hover:underline"
            >
              rohan.kathuria@live.com
            </Link>
            {"."}
          </p>
        </section>
      </main>
    </div>
  );
}
