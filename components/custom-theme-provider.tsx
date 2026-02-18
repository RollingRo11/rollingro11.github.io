"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ColorMode = "light" | "dark";

interface ThemeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("colorMode");
    // Migrate old darkMode setting if it exists
    if (!savedTheme) {
      const oldDarkMode = localStorage.getItem("darkMode");
      if (oldDarkMode !== null) {
        const mode = oldDarkMode === "true" ? "dark" : "light";
        setColorMode(mode);
        localStorage.setItem("colorMode", mode);
        localStorage.removeItem("darkMode");
      } else {
        setColorMode("dark");
      }
    } else {
      setColorMode(savedTheme as ColorMode);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("colorMode", colorMode);

    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeColorMeta);
    }

    // Remove all mode classes first
    document.documentElement.classList.remove("dark");

    if (colorMode === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.background = "";
      document.documentElement.style.background = "";
      document.body.style.backgroundColor = "#222129";
      document.documentElement.style.backgroundColor = "#222129";
      themeColorMeta.setAttribute("content", "#222129");

      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (statusBarMeta) {
        statusBarMeta.setAttribute("content", "black-translucent");
      }
    } else {
      // light mode
      document.body.style.background = "";
      document.documentElement.style.background = "";
      document.body.style.backgroundColor = "rgb(255, 255, 255)";
      document.documentElement.style.backgroundColor = "rgb(255, 255, 255)";
      themeColorMeta.setAttribute("content", "#ffffff");

      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (statusBarMeta) {
        statusBarMeta.setAttribute("content", "default");
      }
    }

    document.body.offsetHeight;
  }, [colorMode, mounted]);

  return <ThemeContext.Provider value={{ colorMode, setColorMode }}>{children}</ThemeContext.Provider>;
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider");
  }
  return context;
}
