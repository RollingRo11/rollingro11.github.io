"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // Ref for sections to observe
  const sectionsRef = useRef<HTMLElement[]>([]);
  // Track active section
  const [activeSection, setActiveSection] = useState<string>("about");
  // Track if sidebar is being hovered
  const [isHovered, setIsHovered] = useState(false);
  // Track if we're currently scrolling
  const isScrollingRef = useRef(false);
  // Track the last clicked section
  const lastClickedRef = useRef<string | null>(null);

  // List of sections in order
  const sections = [
    { id: "about", label: "About" },
    { id: "research", label: "Research" },
    { id: "experience", label: "Experience" },
    { id: "talks", label: "Reading" },
  ];

  // Helper to get class for nav-link
  const getNavLinkClass = (sectionId: string, idx: number) => {
    if (isHovered) return "nav-link px-4 py-2";

    const activeIdx = sections.findIndex((s) => s.id === activeSection);
    if (sectionId === activeSection) return "nav-link current px-4 py-2";
    if (Math.abs(idx - activeIdx) === 1) return "nav-link adjacent px-4 py-2";
    return "nav-link px-4 py-2";
  };

  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    lastClickedRef.current = sectionId;
    isScrollingRef.current = true;

    // Clear the clicked section after scrolling ends
    setTimeout(() => {
      isScrollingRef.current = false;
      lastClickedRef.current = null;
    }, 1000); // Wait for scroll to complete
  };

  useEffect(() => {
    // Setup intersection observer for animations
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    // Scroll spy functionality
    const handleScroll = () => {
      // If we just clicked a section, don't update active section
      if (isScrollingRef.current && lastClickedRef.current) {
        return;
      }

      // Get current scroll position
      const scrollY = window.scrollY;

      // Get window height
      const windowHeight = window.innerHeight;

      // Calculate the middle of the viewport
      const viewportMiddle = scrollY + windowHeight / 2;

      // Find which section is currently at the middle of the viewport
      let currentSection = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      sectionsRef.current.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionMiddle = sectionTop + sectionHeight / 2;

        // Calculate distance from section middle to viewport middle
        const distance = Math.abs(viewportMiddle - sectionMiddle);

        // If this section is closer to the middle than the previous closest
        if (distance < closestDistance) {
          closestDistance = distance;
          currentSection = section.getAttribute("id");
        }
      });

      // Special case for top of page - if we're near the top, always highlight About
      if (scrollY < 100) {
        currentSection = "about";
      }

      // Special case for bottom of page - if we're near the bottom, highlight Reading
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= documentHeight - 100) {
        currentSection = "talks";
      }

      // Update active section
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Store all sections in ref
    sectionsRef.current = Array.from(document.querySelectorAll("section"));

    // Initial check on page load
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left sidebar navigation - cylinder effect */}
      <nav className="w-full lg:w-64 lg:fixed lg:h-screen p-6 lg:flex lg:flex-col">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-10">Rohan</h1>
        </div>
        <div className="flex-1 flex items-center -mt-20">
          <div
            className="hidden lg:flex flex-col sidebar-cylinder text-sm w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {sections.map((section, idx) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className={getNavLinkClass(section.id, idx)}
                data-section={section.id}
                onClick={() => handleSectionClick(section.id)}
              >
                {section.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content - centered with max-width */}
      <main className="flex-1 p-6 lg:p-10 lg:ml-64 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {/* About section */}
          <section id="about" className="mb-20 pt-20 lg:pt-32 scroll-mt-6 section-fade">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">About</h2>
            <div className="space-y-4">
              <p className="text-sm sm:text-base">
                I'm a student at Northeastern University, majoring in Computer Science with a concentration in
                Artificial Intelligence. I'm interested in training deep neural nets to build tools that connect people
                to intelligence. I believe in creating tech that empowers people, not replaces them.
              </p>
              <p className="text-sm sm:text-base">
                I'm interested in LLMs, VLMs, Reasoning models, and generally the field of language modeling. I'm
                also really into voice models and anything to do with sound! Besides tuning hyperparams, you'll probably
                catch me watching an Formula 1 race, soccer game, or playing video games!
              </p>
            </div>
          </section>
          {/* Research section */}
          <section id="research" className="mb-20 scroll-mt-6 section-fade">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Research</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Paper Implementations</h3>
                <p className="mb-2 text-sm sm:text-base">Currently implementing a multitude of popular machine learning papers:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="text-sm sm:text-base">
                    <Link
                      href="https://github.com/RollingRo11/NP-Language-Model"
                      className="flex items-center text-gray-700 hover:underline"
                    >
                      A Neural Probabalistic Language Model (Bengio et al.)
                    </Link>
                  </li>
                  <li className="text-sm sm:text-base">
                    <Link
                      href="https://github.com/RollingRo11/dropout"
                      className="flex items-center text-gray-700 hover:underline"
                    >
                      Dropout (Srivastava et al.)
                    </Link>
                  </li>
                  <li className="text-sm sm:text-base">
                    <Link
                      href="https://github.com/RollingRo11/alexnet"
                      className="flex items-center text-gray-700 hover:underline"
                    >
                      Alexnet: ImageNet Classification with Deep Convolutional Networks (Krizhevsky et al.)
                    </Link>
                  </li>
                  <li className="text-sm sm:text-base">
                    <Link
                      href="https://github.com/RollingRo11/ADAM"
                      className="flex items-center text-gray-700 hover:underline"
                    >
                      ADAM: A Method for Stochastic Optimization (P. Kingma & Ba)
                    </Link>
                  </li>
                  <li className="text-sm sm:text-base">
                    <Link
                      href="https://github.com/RollingRo11/attention-is-all-you-need"
                      className="flex items-center text-gray-700 hover:underline"
                    >
                      Attention Is All You Need (Vaswani et al.)
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Combinatorics</h3>
                <p className="mb-2">
                  Currently working with{" "}
                  <Link
                    href="https://scholar.google.com/citations?user=CyxXUkgAAAAJ&hl=en"
                    className="text-gray-700 hover:underline inline-flex items-center"
                  >
                    Mathematics Professor Nathaniel Gallup
                  </Link>{" "}
                  to prove that Infinite Matrix Schubert Varieties are Cohen-Macaulay.
                </p>
                <ul className="list-disc pl-5 space-y-1"></ul>
              </div>
            </div>
          </section>

          {/* Experience section */}
          <section id="experience" className="mb-20 scroll-mt-6 section-fade">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Northeastern University Artificial Intelligence Clinic</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Founder + AI Consultant • Nov 2024 - Present</p>
                <p className="mb-2 text-sm sm:text-base">
                  I worked with Northeastern University Oakland staff to launch a program for small businesses in the
                  Oakland area to come to Northeastern's Oakland Campus, get paired 1-1 with students, and learn to use
                  many popular AI tools (ChatGPT, Claude, Adobe Creative Cloud), and some less popular ones (SalesForce
                  AgentForce, Relevance AI). (See article at the bottom of the page!)
                </p>
                <p className="mb-2 text-sm sm:text-base">
                  We're currently expanding the Artificial Intelligence Clinic to work with the City of Oakland, and
                  expand Artificial Intelligence trainings across the Bay Area!
                </p>
                <p className="mb-2 text-sm sm:text-base">
                  We're also currently designing a course curriculum for Northeastern University so students can learn
                  from instructors on how to use these tools, and how to consult with companies, before they spend a
                  semester working with small businesses in the area.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Northeastern University Oakland Makerspace</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Shop Assistant • Oct 2024 - Apr 2025</p>
                <p className="mb-2 text-sm sm:text-base">
                  I spent a majority of my time helping students with 3d printers, 3d printing tools and parts for the
                  makerspace, and developing a camera system that tracks projects as they are printed.
                </p>
              </div>
            </div>
          </section>


          {/*
          <section id="projects" className="mb-20 scroll-mt-6 section-fade">
            <h2 className="text-3xl font-bold mb-6">Projects</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">TinyML Framework</h3>
                <p className="mb-2">
                  An extremely simple, fast-growing neural network framework with over 20,000 GitHub stars. It breaks
                  down complex operations into simple, understandable components.
                </p>
                <div className="text-sm text-gray-600">
                  Key features:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>ElementwiseOps: operate on 1-3 tensors and run elementwise</li>
                    <li>ReduceOps: operate on one tensor and return a smaller tensor</li>
                    <li>MovementOps: virtual ops that operate on one tensor and move data around</li>
                  </ul>
                </div>
                <div className="mt-2">
                  <Link href="#" className="text-gray-700 hover:underline inline-flex items-center">
                    GitHub Repository <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">AI Research Platform</h3>
                <p className="mb-2">
                  A collaborative platform for AI researchers to share code, models, and results. Built with a focus on
                  reproducibility and open science principles.
                </p>
                <div className="mt-2">
                  <Link href="#" className="text-gray-700 hover:underline inline-flex items-center">
                    Project Website <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
*/}
          {/* Talks & Interviews section */}
          <section id="talks" className="mb-20 scroll-mt-6 section-fade">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Notable Reading</h2>
            <div>
              <ul className="space-y-3">
                <li className="flex items-center text-sm sm:text-base">
                  <Link
                    href="https://news.northeastern.edu/2025/04/02/student-ai-expertise-business-clinic/"
                    className="flex items-center text-gray-700 hover:underline"
                  >
                    This article published in Northeastern's global news about the AI Clinic
                  </Link>
                  <span className="ml-auto text-xs sm:text-sm text-gray-600">(2025)</span>
                </li>

                <h4 className="text-lg sm:text-xl font-semibold mb-2">Rohan Recommends</h4>
                <li className="flex items-center text-sm sm:text-base">
                  <Link
                    href="https://www.darioamodei.com/essay/machines-of-loving-grace#basic-assumptions-and-framework"
                    className="flex items-center text-gray-700 hover:underline"
                  >
                    Dario Amodei's "Machines of Loving Grace"
                  </Link>
                  <span className="ml-auto text-xs sm:text-sm text-gray-600">(2025)</span>
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <Link
                    href="https://felleisen.org/matthias/Thoughts/py.html"
                    className="flex items-center text-gray-700 hover:underline"
                  >
                    Matthias Felleisen's "Python!"
                  </Link>
                  <span className="ml-auto text-xs sm:text-sm text-gray-600">(2024)</span>
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <Link
                    href="https://en.wikipedia.org/wiki/Brave_New_World"
                    className="flex items-center text-gray-700 hover:underline"
                  >
                    My favorite book
                  </Link>
                  <span className="ml-auto text-xs sm:text-sm text-gray-600">(1932)</span>
                </li>
              </ul>
            </div>
          </section>
          {/* Footer */}
          <footer className="border-t pt-6 text-sm text-gray-500">
            <p className="mb-4">
              Feel free to reach out if you wanna talk F1, Barca/Bayern, or Machine/Deep Learning!
            </p>
            <div className="space-y-2">
              <p>
                <Link href="mailto:rohan.kathuria@live.com" className="text-gray-700 hover:underline">
                  rohan.kathuria@live.com
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
