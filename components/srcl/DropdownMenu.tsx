"use client";

import * as React from "react";
import styles from "./DropdownMenu.module.css";
import ActionListItem from "./ActionListItem";

export type DropdownItem = {
  label: React.ReactNode;
  value: string;
  selected?: boolean;
};

type DropdownMenuProps = {
  label: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  "aria-label"?: string;
};

export default function DropdownMenu({ label, items, onSelect, ...rest }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const getItems = React.useCallback(
    () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
    [],
  );

  // Focus the selected item (or first) when the menu opens.
  React.useEffect(() => {
    if (!open) return;
    const els = getItems();
    if (els.length === 0) return;
    const selectedIndex = items.findIndex((i) => i.selected);
    (els[selectedIndex >= 0 ? selectedIndex : 0] ?? els[0]).focus();
  }, [open, items, getItems]);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const els = getItems();
    if (els.length === 0) return;
    const idx = els.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        els[idx < els.length - 1 ? idx + 1 : 0].focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        els[idx > 0 ? idx - 1 : els.length - 1].focus();
        break;
      case "Home":
        e.preventDefault();
        els[0].focus();
        break;
      case "End":
        e.preventDefault();
        els[els.length - 1].focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        (document.activeElement as HTMLElement)?.click();
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        {...rest}
      >
        {label}
        <span className={styles.caret} aria-hidden="true">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div className={styles.menu} role="menu" ref={menuRef} onKeyDown={onMenuKeyDown}>
          {items.map((item) => (
            <ActionListItem
              key={item.value}
              flush
              role="menuitem"
              icon={item.selected ? "⊹" : " "}
              onClick={() => {
                onSelect(item.value);
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              {item.label}
            </ActionListItem>
          ))}
          <footer className={styles.footer}>↑↓ to move · ⏎ to select · esc to close</footer>
        </div>
      )}
    </div>
  );
}
