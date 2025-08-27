"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCustomTheme } from "@/components/custom-theme-provider";

export default function Home() {
  const { darkMode, setDarkMode } = useCustomTheme();
  const pathname = usePathname();

  const sunAscii = "☼";
  const moonAscii = "☾";

  return (
    <div
      className={`min-h-dvh selection:bg-coral selection:text-black dark:bg-[#0a1a12] dark:text-white dark:selection:bg-[#b6e2d3] dark:selection:text-black bg-[#f5f0e6]`}
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className="flex items-center justify-between mt-2 mb-2 px-4 lg:mb-4 lg:px-16"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingLeft: "max(env(safe-area-inset-left), 1rem)",
          paddingRight: "max(env(safe-area-inset-right), 1rem)",
        }}
      >
        <div className="flex items-center text-lg font-medium">
          <Link href="/" className={`${pathname === "/" ? "" : "hover:underline"}`}>
            Rohan Kathuria
          </Link>
          <span className="mx-3">|</span>
          <Link href="/blog" className={`${pathname.startsWith("/blog") ? "" : "hover:underline"}`}>
            Blog
          </Link>
        </div>
        <button
          className="text-lg bg-transparent border-none cursor-pointer focus:outline-none font-mono whitespace-pre text-left p-2"
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {darkMode ? sunAscii : moonAscii}
        </button>
      </div>
      {/* Main content - completely centered */}
      <main
        className="flex flex-col items-center px-4 pb-4 lg:px-8 lg:pb-6"
        style={{
          paddingLeft: "max(env(safe-area-inset-left), 1rem)",
          paddingRight: "max(env(safe-area-inset-right), 1rem)",
          paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
        }}
      >
        <div className="w-full max-w-2xl px-2 sm:px-0">
          {/* About section */}
          <section id="about" className="mb-3 pt-1 lg:mb-5 lg:pt-3">
            <div className="space-y-1 text-left">
              <p className="text-base sm:text-2xl leading-relaxed">
                I'm Rohan. I'm a freshman at Northeastern University majoring in Computer Science with a concentration
                in Artificial Intelligence. I like to train neural networks that help us understand other neural
                networks!
              </p>
            </div>
          </section>

          {/* Research section */}
          <section id="research" className="mb-5">
            <h2 className="text-lg sm:text-3xl font-bold mb-1 text-left">Research</h2>
            <div className="space-y-1 text-left">
              <div>
                <h3 className="text-base sm:text-xl font-semibold mb-0.5">Paper Implementations</h3>
                <p className="mb-1 text-sm sm:text-lg leading-tight">
                  My implementations of some popular machine learning papers:
                </p>
                <ul className="list-disc pl-6 space-y-0">
                  <li className="text-sm sm:text-lg leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/NP-Language-Model"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      A Neural Probabalistic Language Model (Bengio et al.)
                    </Link>
                  </li>
                  <li className="text-sm sm:text-lg leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/dropout"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Dropout (Srivastava et al.)
                    </Link>
                  </li>
                  <li className="text-sm sm:text-lg leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/alexnet"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Alexnet: ImageNet Classification with Deep Convolutional Networks (Krizhevsky et al.)
                    </Link>
                  </li>
                  <li className="text-sm sm:text-lg leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/ADAM"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ADAM: A Method for Stochastic Optimization (P. Kingma & Ba)
                    </Link>
                  </li>
                  <li className="text-sm sm:text-lg leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/attention-is-all-you-need"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Attention Is All You Need (Vaswani et al.)
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base sm:text-xl font-semibold mb-0.5">Mechanistic Interpretability @ NEURAI Lab</h3>
                <p className="mb-1 text-sm sm:text-lg leading-tight">
                  Currently working with Artificial Intelligence Professor{" "}
                  <Link
                    href="https://www.researchgate.net/profile/Nadim-Saad"
                    className="text-black dark:text-white hover:underline inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nadim Saad
                  </Link>{" "}
                  and the{" "}
                  <Link
                    href="https://neurai.sites.northeastern.edu/our-team-2/"
                    className="text-black dark:text-white hover:underline inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NEURAI Lab
                  </Link>{" "}
                  to develop automatic systems for labeling attributions explored by cross-layer transcoders.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-xl font-semibold mb-0.5">
                  Combinatorics Research @ Khoury College of Computer Sciences
                </h3>
                <p className="mb-1 text-sm sm:text-lg leading-tight">
                  Currently working with Mathematics Professor{" "}
                  <Link
                    href="https://scholar.google.com/citations?user=CyxXUkgAAAAJ&hl=en"
                    className="text-black dark:text-white hover:underline inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nathaniel Gallup
                  </Link>{" "}
                  to prove Infinite Matrix Schubert Varieties are Cohen Macaulay.
                </p>
              </div>
            </div>
          </section>

          {/* Experience section */}
          <section id="experience" className="mb-5">
            <h2 className="text-lg sm:text-3xl font-bold mb-1 text-left">Experience</h2>
            <div className="space-y-1 text-left">
              <div>
                <h3 className="text-base sm:text-xl font-semibold mb-0.5">
                  Northeastern University Artificial Intelligence Clinic
                </h3>
                <p className="text-black dark:text-white mb-0 text-sm sm:text-base">
                  Founder + AI Consultant • Nov 2024 - Present
                </p>
                <p className="mb-1 text-sm sm:text-lg leading-tight">
                  I worked with Northeastern University Oakland staff to launch a program for small businesses in the
                  Oakland area to come to Northeastern's Oakland Campus, get paired 1-1 with students, and learn to use
                  AI tools in everyday activities.
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-xl font-semibold mb-0.5">Northeastern University Oakland Makerspace</h3>
                <p className="text-black dark:text-white mb-0 text-sm sm:text-base">
                  Shop Assistant • Oct 2024 - Apr 2025
                </p>
                <p className="mb-1 text-sm sm:text-lg leading-tight">
                  I spent a majority of my time training students to use 3d printers, laser cutters, and soldering
                  irons. I also 3d printed tools and shelves for the makerspace, and helped organize events for makers
                  around the campus to come innovate, socialize, and build.
                </p>
              </div>
            </div>
          </section>

          {/* Reading section */}
          <section id="reading" className="mb-5">
            <h2 className="text-lg sm:text-3xl font-bold mb-1 text-left">Reading</h2>
            <div className="space-y-0 text-left">
              <ul className="space-y-0">
                <h4 className="text-base sm:text-xl font-semibold mb-0.5">Recent News</h4>
                <li className="block sm:flex sm:items-center text-sm sm:text-lg leading-snug">
                  <Link
                    href="https://news.northeastern.edu/2025/04/02/student-ai-expertise-business-clinic/"
                    className="text-black dark:text-white hover:underline block sm:inline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    This article published in Northeastern's global news about the AI Clinic
                  </Link>
                  <span className="block sm:ml-auto text-sm sm:text-lg text-black dark:text-white mt-1 sm:mt-0">
                    (2025)
                  </span>
                </li>

                <h4 className="text-base sm:text-xl font-semibold mb-0.5 mt-1">Rohan Recommends</h4>
                <li className="block sm:flex sm:items-center text-sm sm:text-lg leading-snug">
                  <Link
                    href="https://www.darioamodei.com/post/the-urgency-of-interpretability#top"
                    className="text-black dark:text-white hover:underline block sm:inline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dario Amodei's "The Urgency of Interpretability"
                  </Link>
                  <span className="block sm:ml-auto text-sm sm:text-lg text-black dark:text-white mt-1 sm:mt-0">
                    (2025)
                  </span>
                </li>
                <li className="block sm:flex sm:items-center text-sm sm:text-lg leading-snug">
                  <Link
                    href="https://felleisen.org/matthias/Thoughts/py.html"
                    className="text-black dark:text-white hover:underline block sm:inline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Matthias Felleisen's "Python!"
                  </Link>
                  <span className="block sm:ml-auto text-sm sm:text-lg text-black dark:text-white mt-1 sm:mt-0">
                    (2024)
                  </span>
                </li>
                <li className="block sm:flex sm:items-center text-sm sm:text-lg leading-snug">
                  <Link
                    href="https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)"
                    className="text-black dark:text-white hover:underline block sm:inline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Isaac Asimov's "Foundation"
                  </Link>
                  <span className="block sm:ml-auto text-sm sm:text-lg text-black dark:text-white mt-1 sm:mt-0">
                    (1951)
                  </span>
                </li>
                <li className="block sm:flex sm:items-center text-sm sm:text-lg leading-snug">
                  <Link
                    href="https://en.wikipedia.org/wiki/Brave_New_World"
                    className="text-black dark:text-white hover:underline block sm:inline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Aldous Huxley's "Brave New World"
                  </Link>
                  <span className="block sm:ml-auto text-sm sm:text-lg text-black dark:text-white mt-1 sm:mt-0">
                    (1932)
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-black dark:border-white pt-5 text-xs sm:text-xs text-black text-center">
            <p className="mb-1 text-base sm:text-xl text-black dark:text-white">Feel free to reach out!</p>
            <div className="space-y-1">
              <p className="text-sm sm:text-base">
                <Link href="mailto:rohan.kathuria@live.com" className="text-black dark:text-white hover:underline">
                  rohan.kathuria@live.com
                </Link>{" "}
                <span className="text-black dark:text-white">|</span>{" "}
                <Link href="mailto:kathuria.r@northeastern.edu" className="text-black dark:text-white hover:underline">
                  kathuria.r@northeastern.edu
                </Link>{" "}
                <span className="text-black dark:text-white">|</span>{" "}
                <Link
                  href="https://www.linkedin.com/in/rohanekathuria"
                  className="text-black dark:text-white hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
