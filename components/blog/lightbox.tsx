"use client";

// Click a figure to see it filling the screen. One native <dialog> and one
// delegated listener per article: no per-image handlers, no extra request
// (the popup reuses the figure's already-loaded src) and no work at all until
// a figure is clicked. The dialog brings Esc-to-close and focus handling.

import { useEffect, useRef } from "react";

export function Lightbox() {
  const dialog = useRef<HTMLDialogElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prose = dialog.current?.previousElementSibling;
    if (!prose) return;
    const onClick = (e: Event) => {
      const target = e.target;
      if (!(target instanceof HTMLImageElement) || target.closest("a")) return;
      const big = img.current!;
      big.src = target.currentSrc || target.src;
      big.alt = target.alt;
      big.toggleAttribute("data-invert", target.hasAttribute("data-invert"));
      dialog.current!.showModal();
    };
    prose.addEventListener("click", onClick);
    return () => prose.removeEventListener("click", onClick);
  }, []);

  return (
    <dialog ref={dialog} className="lightbox" onClick={() => dialog.current!.close()}>
      <img ref={img} alt="" decoding="sync" />
    </dialog>
  );
}
