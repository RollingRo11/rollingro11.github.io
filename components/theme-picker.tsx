"use client";

import { useCustomTheme, TINTS, type Tint } from "@/components/custom-theme-provider";
import { DropdownMenu } from "@/components/srcl";
import styles from "./theme-picker.module.css";

export function ThemePicker() {
  const { colorMode, setColorMode, tint, setTint } = useCustomTheme();
  const currentTint = TINTS.find((t) => t.value === tint) ?? TINTS[0];

  return (
    <div className={styles.root}>
      <DropdownMenu
        aria-label="Theme tint"
        label={currentTint.label}
        items={TINTS.map((t) => ({ label: t.label, value: t.value, selected: t.value === tint }))}
        onSelect={(v) => setTint(v as Tint)}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
        aria-label="Toggle color mode"
        title="Toggle color mode"
      >
        <span className={styles.toggleBox}>
          {colorMode === "dark" && <span className={styles.toggleBoxFilled} />}
        </span>
      </button>
    </div>
  );
}
