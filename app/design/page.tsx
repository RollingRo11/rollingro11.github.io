"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BlogHeader } from "@/components/blog/blog-header";
import { Card, RowSpaceBetween } from "@/components/srcl";

type Sample = {
  title: string;
  images: { src: string; alt: string; caption?: string }[];
  fonts: React.ReactNode;
  colors: string[];
};

const samples: Sample[] = [
  {
    title: "This Website",
    images: [
      { src: "/desktop.avif", alt: "Desktop view of this website", caption: "Desktop" },
      { src: "/mobile.avif", alt: "Mobile view of this website", caption: "Mobile" },
    ],
    fonts: (
      <>
        <span style={{ fontFamily: "var(--font-geist-mono)" }}>Geist Mono</span>
        {" · "}
        <span style={{ fontFamily: "var(--font-crimson-pro)" }}>Crimson Pro</span>
        {" · "}
        <span style={{ fontFamily: "var(--font-departure-mono)" }}>Departure Mono</span>
      </>
    ),
    colors: ["#FFFFFF", "#080808", "#EEEEEE", "#E4E4E4", "#3A3A3A", "#262626", "#39FF44"],
  },
  {
    title: "Crosscoder Latent Dashboard",
    images: [{ src: "/crosscoder.avif", alt: "Crosscoder Latent Dashboard" }],
    fonts: (
      <>
        System UI · <span style={{ fontFamily: "monospace" }}>SF Mono</span> ·{" "}
        <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span>
      </>
    ),
    colors: ["#FFFFFF", "#F5F5F5", "#1A1A1A", "#666666", "#E1E4E8", "#0969DA", "#28A745"],
  },
  {
    title: "Layer Experiments",
    images: [
      { src: "/conceptlayer.avif", alt: "Layer Experiments — Layer View", caption: "Layer" },
      { src: "/conceptfeature.avif", alt: "Layer Experiments — Feature View", caption: "Feature" },
      { src: "/conceptsubjoiner.avif", alt: "Layer Experiments — Subjoiner View", caption: "Subjoiner" },
    ],
    fonts: <span style={{ fontFamily: "monospace" }}>IBM Plex Mono</span>,
    colors: ["#111111", "#1A1A1A", "#222222", "#CCCCCC", "#888888", "#44AA77", "#44AA99"],
  },
];

export default function Design() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const openImage = (src: string, alt: string) => {
    if (window.innerWidth >= 640) setSelectedImage({ src, alt });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <div className="srcl-page">
      <BlogHeader crumb="Design" />

      <main className="srcl-main">
        <Card title="Design Work">
          <p>A collection of my design work.</p>
        </Card>

        {samples.map((sample, i) => (
          <Card key={sample.title} title={sample.title}>
            <div className="srcl-design-images">
              {sample.images.map((img) => (
                <figure key={img.src}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={500}
                    sizes="(max-width: 640px) 100vw, 768px"
                    className="srcl-design-image"
                    onClick={() => openImage(img.src, img.alt)}
                  />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>

            <RowSpaceBetween className="srcl-design-meta">
              <span className="srcl-design-label">Fonts</span>
              <span>{sample.fonts}</span>
            </RowSpaceBetween>

            <div className="srcl-design-palette">
              <span className="srcl-design-label">Palette</span>
              <div className="srcl-design-swatches">
                {sample.colors.map((c) => (
                  <div key={c} className="srcl-design-swatch">
                    <span className="srcl-design-swatch-block" style={{ backgroundColor: c }} />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        <Card title="Back">
          <Link href="/" className="srcl-link">
            ← home
          </Link>
        </Card>
      </main>

      {selectedImage && (
        <div className="srcl-modal" onClick={() => setSelectedImage(null)}>
          <div className="srcl-modal-inner">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1920}
              height={1080}
              sizes="90vw"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => setSelectedImage(null)} aria-label="Close" className="srcl-modal-close">
              [ CLOSE ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
