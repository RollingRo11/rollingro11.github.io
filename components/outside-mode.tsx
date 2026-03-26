"use client";

import { useEffect, useState, useCallback } from "react";
import { useCustomTheme } from "@/components/custom-theme-provider";

export function OutsideMode() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { colorMode } = useCustomTheme();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("outsideMode");
    if (saved === "true") setActive(true);
  }, []);

  const toggle = useCallback(() => {
    setActive((prev) => {
      const next = !prev;
      localStorage.setItem("outsideMode", String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "o" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  if (!mounted) return null;

  const isDark = colorMode === "dark";

  return (
    <div
      id="dappled-light"
      style={{
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        zIndex: 9999,
        opacity: active ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Warm sun glow — radiates from top-right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "radial-gradient(ellipse at 80% 10%, #1b293f 0%, transparent 60%)"
            : "radial-gradient(ellipse at 80% 10%, #f5d7a6 0%, transparent 60%)",
          opacity: 0.35,
          transition: "background 1s ease",
        }}
      />

      {/* Canopy layer 1 — large, covers top-right, fades down */}
      <div
        id="outside-leaves-1"
        className="outside-leaves"
        style={{
          position: "absolute",
          top: "-40%",
          left: "-20%",
          width: "160%",
          height: "160%",
          backgroundImage: "url(/leaves.png)",
          backgroundSize: "80% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "70% 20%",
          mixBlendMode: "multiply",
          opacity: isDark ? 0.22 : 0.12,
          filter: "blur(1px)",
          transition: "opacity 1s ease",
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 75%)",
        }}
      />

      {/* Canopy layer 2 — mirrored, offset left, more blur = farther branches */}
      <div
        id="outside-leaves-2"
        className="outside-leaves-secondary"
        style={{
          position: "absolute",
          top: "-30%",
          left: "-30%",
          width: "150%",
          height: "150%",
          backgroundImage: "url(/leaves.png)",
          backgroundSize: "70% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "30% 15%",
          mixBlendMode: "multiply",
          opacity: isDark ? 0.16 : 0.08,
          filter: "blur(3px)",
          transition: "opacity 1s ease",
          maskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 70%)",
        }}
      />

      {/* Canopy layer 3 — rotated, fills in gaps, very soft */}
      <div
        id="outside-leaves-3"
        className="outside-leaves-tertiary"
        style={{
          position: "absolute",
          top: "-50%",
          right: "-25%",
          width: "140%",
          height: "150%",
          backgroundImage: "url(/leaves.png)",
          backgroundSize: "60% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50% 25%",
          mixBlendMode: "multiply",
          opacity: isDark ? 0.12 : 0.06,
          filter: "blur(6px)",
          transition: "opacity 1s ease",
          maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 65%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 65%)",
        }}
      />

      {/* SVG wind filter */}
      <svg style={{ width: 0, height: 0, position: "absolute" }}>
        <defs>
          <filter id="outside-wind" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" numOctaves={2} seed={1}>
              <animate
                attributeName="baseFrequency"
                dur="20s"
                keyTimes="0;0.33;0.66;1"
                values="0.003 0.002;0.005 0.004;0.004 0.003;0.003 0.002"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic">
              <animate
                attributeName="scale"
                dur="24s"
                keyTimes="0;0.25;0.5;0.75;1"
                values="18;28;35;28;18"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
