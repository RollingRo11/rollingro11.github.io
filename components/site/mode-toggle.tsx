"use client";

import { useTheme } from "@/components/theme-provider";

// A half-filled disc: the filled side is the mode you'd switch to. It rotates
// through the change rather than swapping icons.
export function ModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M8 1a7 7 0 0 0 0 14z" fill="currentColor" />
      </svg>
    </button>
  );
}
