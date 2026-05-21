"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ColorMode = "light" | "dark";
export type Tint = "none" | "green" | "blue" | "red" | "yellow" | "purple" | "orange" | "pink";

export const TINTS: { value: Tint; label: string }[] = [
  { value: "none", label: "None" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "yellow", label: "Yellow" },
  { value: "pink", label: "Pink" },
];

interface ThemeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  tint: Tint;
  setTint: (tint: Tint) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const TINT_CLASSES = TINTS.filter((t) => t.value !== "none").map((t) => `tint-${t.value}`);

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [tint, setTint] = useState<Tint>("orange");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("colorMode");
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

    const savedTint = localStorage.getItem("tint");
    if (savedTint && TINTS.some((t) => t.value === savedTint)) {
      setTint(savedTint as Tint);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("colorMode", colorMode);
    localStorage.setItem("tint", tint);

    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeColorMeta);
    }

    // SRCL theme + tint classes — set on documentElement (the inline boot
    // script targets this too, no FOUC). The .theme-*/.tint-* selectors
    // match either <html> or <body>.
    const html = document.documentElement;
    const body = document.body;

    html.classList.remove("dark", "theme-light", "theme-dark", ...TINT_CLASSES);
    body.classList.remove("theme-light", "theme-dark", ...TINT_CLASSES);

    const themeClass = colorMode === "dark" ? "theme-dark" : "theme-light";
    html.classList.add(themeClass);
    body.classList.add(themeClass);
    if (colorMode === "dark") html.classList.add("dark");
    if (tint !== "none") {
      html.classList.add(`tint-${tint}`);
      body.classList.add(`tint-${tint}`);
    }

    // Background color matches the resolved theme. With a tint, the resolved
    // background is derived via oklch() and we let the CSS handle it — clear
    // the inline override so the var() shines through.
    if (tint === "none") {
      const bg = colorMode === "dark" ? "#080808" : "#ffffff";
      html.style.backgroundColor = bg;
      body.style.backgroundColor = bg;
      themeColorMeta.setAttribute("content", bg);
    } else {
      html.style.backgroundColor = "";
      body.style.backgroundColor = "";
    }

    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBarMeta) {
      statusBarMeta.setAttribute("content", colorMode === "dark" ? "black-translucent" : "default");
    }

    // Force a reflow so re-derived theme variables apply consistently
    // across iframes / canvases.
    void document.body.offsetHeight;
  }, [colorMode, tint, mounted]);

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode, tint, setTint }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider");
  }
  return context;
}
