"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const sunAscii = '☼';
  const moonAscii = '☾';

  return (
    <div className={`min-h-screen selection:bg-coral selection:text-black dark:bg-[#0a1a12] dark:text-white dark:selection:bg-[#b6e2d3] dark:selection:text-black`} style={{
      paddingTop: 'env(safe-area-inset-top)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      backgroundColor: darkMode ? '#0a1a12' : undefined
    }}>
      <div className="flex items-center justify-between mt-8 mb-4 px-8 lg:mb-8 lg:px-16">
        <div className="text-2xl font-medium">
          Rohan Kathuria
        </div>
        <button
          className="text-3xl bg-transparent border-none cursor-pointer focus:outline-none font-mono whitespace-pre text-left p-2"
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {darkMode ? sunAscii : moonAscii}
        </button>
      </div>
      {/* Main content - completely centered */}
      <main className="flex flex-col items-center p-8 lg:p-16">
        <div className="w-full max-w-4xl">
          {/* About section */}
          <section id="about" className="mb-16 pt-8 lg:mb-32 lg:pt-20">
            <div className="space-y-8 text-left">
              <p className="text-xl sm:text-4xl leading-relaxed">
                I read this quote that said <i>"we are the universe trying to understand itself." </i> I think the most
                promising thing about being able to interpret artificial intelligence, is that we one day may gain a
                deeper understanding of our own intelligence.
              </p>
              <p className="text-xl sm:text-4xl leading-relaxed">
                I'm <span className="bg-[#E8A598] dark:bg-[#b6e2d3] text-black px-1">Rohan</span>. I'm a student at Northeastern University majoring in Computer Science with a concentration in
                Artificial Intelligence. I like to train neural networks that understand other neural networks.
              </p>
            </div>
          </section>

          {/* Research section */}
          <section id="research" className="mb-32">
            <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-left">Research</h2>
            <div className="space-y-8 text-left">
              <div>
                <h3 className="text-xl sm:text-3xl font-semibold mb-4">Paper Implementations</h3>
                <p className="mb-4 text-lg sm:text-2xl leading-relaxed">
                  Currently implementing a multitude of popular machine learning papers:
                </p>
                <ul className="list-disc pl-8 space-y-2">
                  <li className="text-base sm:text-xl leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/NP-Language-Model"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      A Neural Probabalistic Language Model (Bengio et al.)
                    </Link>
                  </li>
                  <li className="text-base sm:text-xl leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/dropout"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Dropout (Srivastava et al.)
                    </Link>
                  </li>
                  <li className="text-base sm:text-xl leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/alexnet"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Alexnet: ImageNet Classification with Deep Convolutional Networks (Krizhevsky et al.)
                    </Link>
                  </li>
                  <li className="text-base sm:text-xl leading-relaxed">
                    <Link
                      href="https://github.com/RollingRo11/ADAM"
                      className="text-black dark:text-white hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ADAM: A Method for Stochastic Optimization (P. Kingma & Ba)
                    </Link>
                  </li>
                  <li className="text-base sm:text-xl leading-relaxed">
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
                <h3 className="text-xl sm:text-3xl font-semibold mb-4">Mechanistic Interpretability @ NEURAI Lab</h3>
                <p className="mb-4 text-lg sm:text-2xl leading-relaxed">
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
                  to train interpretability techniques to explain the internal mechanics of neural networks.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-3xl font-semibold mb-4">Quantitative Research @ Mathematics Department</h3>
                <p className="mb-4 text-lg sm:text-2xl leading-relaxed">
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
          <section id="experience" className="mb-32">
            <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-left">Experience</h2>
            <div className="space-y-8 text-left">
              <div>
                <h3 className="text-xl sm:text-3xl font-semibold mb-4">Northeastern University Artificial Intelligence Clinic</h3>
                <p className="text-black dark:text-white mb-4 text-base sm:text-xl">Founder + AI Consultant • Nov 2024 - Present</p>
                <p className="mb-4 text-lg sm:text-2xl leading-relaxed">
                  I worked with Northeastern University Oakland staff to launch a program for small businesses in the
                  Oakland area to come to Northeastern's Oakland Campus, get paired 1-1 with students, and learn to use
                  AI tools in everyday activities.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-3xl font-semibold mb-4">Northeastern University Oakland Makerspace</h3>
                <p className="text-black dark:text-white mb-4 text-base sm:text-xl">Shop Assistant • Oct 2024 - Apr 2025</p>
                <p className="mb-4 text-lg sm:text-2xl leading-relaxed">
                  I spent a majority of my time training students to use 3d printers, laser cutters, and soldering
                  irons. I also 3d printed tools and shelves for the makerspace, and helped organize events for makers
                  around the campus to come innovate, socialize, and build.
                </p>
              </div>
            </div>
          </section>

          {/* Reading section */}
          <section id="reading" className="mb-32">
            <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-left">Reading</h2>
            <div className="space-y-6 text-left">
              <ul className="space-y-2">
                <h4 className="text-xl sm:text-3xl font-semibold mb-3">Recent News</h4>
                <li className="flex items-center text-base sm:text-lg leading-snug">
                  <Link
                    href="https://news.northeastern.edu/2025/04/02/student-ai-expertise-business-clinic/"
                    className="text-black dark:text-white hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    This article published in Northeastern's global news about the AI Clinic
                  </Link>
                  <span className="ml-auto text-base sm:text-xl text-black dark:text-white">(2025)</span>
                </li>

                <h4 className="text-xl sm:text-3xl font-semibold mb-3 mt-6">Rohan Recommends</h4>
                <li className="flex items-center text-base sm:text-lg leading-snug">
                  <Link
                    href="https://transformer-circuits.pub/"
                    className="text-black dark:text-white hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Anything from Anthropic's Transformer Circuits thread
                  </Link>
                  <span className="ml-auto text-base sm:text-xl text-black dark:text-white">(2020 - present)</span>
                </li>
                <li className="flex items-center text-base sm:text-lg leading-snug">
                  <Link
                    href="https://www.darioamodei.com/essay/machines-of-loving-grace"
                    className="text-black dark:text-white hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dario Amodei's "Machines of Loving Grace"
                  </Link>
                  <span className="ml-auto text-base sm:text-xl text-black dark:text-white">(2024)</span>
                </li>
                <li className="flex items-center text-base sm:text-lg leading-snug">
                  <Link
                    href="https://felleisen.org/matthias/Thoughts/py.html"
                    className="text-black dark:text-white hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Matthias Felleisen's "Python!"
                  </Link>
                  <span className="ml-auto text-base sm:text-xl text-black dark:text-white">(2024)</span>
                </li>
                <li className="flex items-center text-base sm:text-lg leading-snug">
                  <Link
                    href="https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)"
                    className="text-black dark:text-white hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    My favorite book
                  </Link>
                  <span className="ml-auto text-base sm:text-xl text-black dark:text-white">(1951)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-black dark:border-white pt-8 text-base sm:text-xl text-black text-center">
            <p className="mb-4 text-lg sm:text-2xl text-black dark:text-white">Feel free to reach out!</p>
            <div className="space-y-2">
              <p className="text-base sm:text-xl">
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
