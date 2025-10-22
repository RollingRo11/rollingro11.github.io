"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    const isDark = savedTheme !== null ? savedTheme === "true" : true;
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("darkMode", darkMode.toString());

    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeColorMeta);
    }

    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#222129";
      document.documentElement.style.backgroundColor = "#222129";
      themeColorMeta.setAttribute("content", "#222129");

      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (statusBarMeta) {
        statusBarMeta.setAttribute("content", "black-translucent");
      }
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "rgb(238, 238, 238)";
      document.documentElement.style.backgroundColor = "rgb(238, 238, 238)";
      themeColorMeta.setAttribute("content", "#eeeeee");

      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (statusBarMeta) {
        statusBarMeta.setAttribute("content", "default");
      }
    }

    document.body.offsetHeight;
  }, [darkMode, mounted]);

  return <ThemeContext.Provider value={{ darkMode, setDarkMode }}>{children}</ThemeContext.Provider>;
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider");
  }
  return context;
}
