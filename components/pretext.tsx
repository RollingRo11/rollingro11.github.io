"use client";

import React from "react";
import { usePretextLayout } from "@/hooks/use-pretext";

type PretextProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * Wraps any HTML element and uses pretext to compute + set its height.
 * Reads the element's computed font, extracts text content, and uses
 * pretext's layout engine. Recomputes on resize via ResizeObserver.
 */
export function Pretext({ as: Tag = "div", children, ...props }: PretextProps) {
  const ref = usePretextLayout();
  return React.createElement(Tag, { ref, ...props }, children);
}
