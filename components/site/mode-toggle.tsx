"use client";

import { useEffect, useRef, useState } from "react";

// Auto follows the OS and is the default; Light and Dark pin a choice. The
// boot script in app/layout.tsx applies the same rule before first paint, so
// this only takes over once the reader clicks or the OS setting changes.
//
// Auto sits between the two, like the knob: clicks bounce Light → Auto →
// Dark → Auto → Light, so leaving Auto heads away from the side it came from.

type Pref = "system" | "light" | "dark";

const LABEL: Record<Pref, string> = { system: "Auto", light: "Light", dark: "Dark" };
// Kept in step with --ground in app/globals.css.
const GROUND = { light: "#ffffff", dark: "#0b0b0b" };

export function ModeToggle() {
  // null until mounted: the server can't know the saved choice, and applying
  // a guess first would flash the wrong theme.
  const [pref, setPref] = useState<Pref | null>(null);
  // The pinned side Auto was entered from; null until the first click.
  const cameFrom = useRef<"light" | "dark" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setPref(saved === "light" || saved === "dark" ? saved : "system");
  }, []);

  useEffect(() => {
    if (!pref) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = pref === "dark" || (pref === "system" && media.matches);
      const root = document.documentElement;
      root.classList.toggle("theme-dark", dark);
      root.classList.toggle("theme-light", !dark);
      document
        .querySelectorAll('meta[name="theme-color"]')
        .forEach((m) => m.setAttribute("content", dark ? GROUND.dark : GROUND.light));
    };
    apply();
    if (pref !== "system") return;
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [pref]);

  const current = pref ?? "system";
  // Reads the page, so only called once mounted (pref is set by then).
  const nextPref = (): Pref => {
    if (current !== "system") return "system";
    if (cameFrom.current) return cameFrom.current === "light" ? "dark" : "light";
    // No history yet: go to whichever theme isn't showing.
    return document.documentElement.classList.contains("theme-dark") ? "light" : "dark";
  };

  const cycle = () => {
    const next = nextPref();
    if (current !== "system") cameFrom.current = current;
    setPref(next);
    if (next === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      className="mode-toggle"
      data-pref={current}
      onClick={cycle}
      aria-label={pref ? `Theme: ${LABEL[pref]}. Switch to ${LABEL[nextPref()]}.` : "Theme"}
    >
      <span className="mode-toggle__track">
        <span className="mode-toggle__knob" />
      </span>
      <span className="mode-toggle__label label">{LABEL[current]}</span>
    </button>
  );
}
