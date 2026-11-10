"use client";

import { useEffect, useRef, useState } from "react";

// The front-page watercolor: a network of pigment blooms with one circuit
// traced in orange. It was painted once with p5.brush (seed 31337) and saved
// as /plate.webp, so visitors download a 45 KB image instead of a WebGL
// painter. It dries in — fades up out of a blur — once the image has loaded.
// Dark mode inverts it in CSS.
export function Plate() {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish loading before hydration attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className="plate">
      <img
        ref={ref}
        src="/plate.webp"
        width={1376}
        height={608}
        alt=""
        fetchPriority="high"
        className={loaded ? "plate__img plate__img--dry" : "plate__img"}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
