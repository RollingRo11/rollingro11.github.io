"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCustomTheme } from "@/components/custom-theme-provider";

interface BlogClientWrapperProps {
  children: React.ReactNode;
}

export default function BlogClientWrapper({ children }: BlogClientWrapperProps) {
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
        className="flex items-center justify-between mt-4 mb-3 px-4 lg:mb-8 lg:px-16"
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

      <main
        className="flex flex-col items-center px-4 pb-4 lg:p-8"
        style={{
          paddingLeft: "max(env(safe-area-inset-left), 1rem)",
          paddingRight: "max(env(safe-area-inset-right), 1rem)",
          paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
