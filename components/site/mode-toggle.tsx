"use client";

import { useTheme } from "@/components/theme-provider";

// A hardware toggle: a small switch plate. The filled half is the mode you'd
// switch to; it slides across rather than swapping icons.
export function ModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className="mode-toggle__track">
        <span className="mode-toggle__knob" />
      </span>
      <span className="mode-toggle__label">{theme === "light" ? "LIGHT" : "DARK"}</span>
    </button>
  );
}
