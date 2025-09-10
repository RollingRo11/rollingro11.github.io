"use client";

import Link from "next/link";
import { useCustomTheme } from "@/components/custom-theme-provider";

export default function Home() {
  const { darkMode, setDarkMode } = useCustomTheme();

  const sunAscii = "☼";
  const moonAscii = "☾";

  return (
    <div className="min-h-dvh selection:bg-blue-600 selection:text-white dark:bg-[#222129] dark:text-white dark:selection:bg-[#85BAA1] dark:selection:text-white bg-white text-black">
      {/* Header with name and theme toggle */}
      <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 py-8 sm:py-12 lg:py-16 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-normal">Rohan Kathuria</h1>
          <button
            className="text-2xl bg-transparent border-none cursor-pointer focus:outline-none font-mono sm:hidden"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? sunAscii : moonAscii}
          </button>
        </div>
        <div className="flex items-center gap-6 sm:gap-6 lg:gap-8 text-base sm:text-lg flex-wrap justify-center sm:justify-end">
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
            className="text-2xl bg-transparent border-none cursor-pointer focus:outline-none font-mono hidden sm:block"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? sunAscii : moonAscii}
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 sm:pb-16 lg:pb-20">
        {/* Intro paragraphs */}
        <section className="mb-8 lg:mb-10 space-y-4">
          <p className="text-lg sm:text-xl leading-relaxed">
            I'm a 2nd year at Northeastern University majoring in Computer Science with a concentration in Artificial
            intelligence. I like developing systems to understand neural networks.
          </p>
          <p className="text-lg sm:text-xl leading-relaxed">
            I am currently a Student Researcher under principal investigator{" "}
            <Link
              href="https://www.researchgate.net/profile/Nadim-Saad"
              className="text-blue-600 dark:text-[#85BAA1] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nadim Saad
            </Link>{" "}
            of Northeastern's Research in AI lab working under principal on understanding how models develop their
            responses.
          </p>
        </section>
        {/* Research section */}
        <section className="mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Research</h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1">Mechanistic Interpretability @ NEURAI Lab</h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">In Progress</p>
              <p className="text-lg sm:text-xl leading-relaxed">
                Training sparse crosscoders on Pythia, Gemma, and other open-source models to uncover how models might
                form their thoughts across layers.
              </p>
            </div>
          </div>
        </section>
        {/* Projects section */}
        <section className="mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Projects</h2>
          <div className="space-y-4">
            <div>
              <Link
                href="https://github.com/RollingRo11/attention-is-all-you-need"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline text-lg sm:text-xl font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Attention Is All You Need Implementation
              </Link>
              <p className="text-lg sm:text-xl leading-relaxed">
                My implementation of the transformer architecture from the seminal paper by Vaswani et al.
              </p>
            </div>

            <div>
              <Link
                href="https://github.com/RollingRo11/NP-Language-Model"
                className="text-blue-600 dark:text-[#85BAA1] hover:underline text-lg sm:text-xl font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Neural Probabilistic Language Model
              </Link>
              <p className="text-lg sm:text-xl leading-relaxed">
                Implementation of Bengio et al.'s foundational neural language model.
              </p>
            </div>
          </div>
        </section>
        {/* Other section */}
        <section className="mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Other things</h2>
          <ul className="space-y-1">
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
                    Founded a program pairing students with small businesses to learn to use AI tools
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
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Contact</h2>
          <p className="text-lg sm:text-xl">
            You can contact me at{" "}
            <Link
              href="mailto:kathuria.r@northeastern.edu"
              className="text-blue-600 dark:text-[#85BAA1] hover:underline"
            >
              kathuria.r@northeastern.edu
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
