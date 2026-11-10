import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rkathuria.com"),
  title: "Rohan Kathuria",
  description: "Mechanistic interpretability research and writing by Rohan Kathuria.",
  icons: {
    icon: [
      // New file names on purpose: browsers cache /favicon.svg hard.
      { url: "/bloom.svg", type: "image/svg+xml" },
      { url: "/bloom-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rohan Kathuria",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Rohan Kathuria",
    description: "Mechanistic interpretability research and writing.",
    url: "https://rkathuria.com",
    siteName: "Rohan Kathuria",
    images: [
      {
        url: "https://rkathuria.com/title.png?v=2",
        width: 1200,
        height: 630,
        alt: "Rohan Kathuria",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Kathuria",
    description: "Mechanistic interpretability research and writing.",
    images: ["https://rkathuria.com/title.png?v=2"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Matches the OS until the reader picks a theme; mode-toggle.tsx then
  // rewrites both tags to the chosen ground.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

// Resolves the theme before first paint so there's no flash: a saved Light or
// Dark choice wins, otherwise follow the OS. Mirrored in mode-toggle.tsx.
const BOOT_SCRIPT = `
(function () {
  var dark = false;
  try {
    var saved = localStorage.getItem('theme');
    dark = saved === 'dark' ||
      (saved !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  } catch (e) {}
  document.documentElement.classList.add(dark ? 'theme-dark' : 'theme-light');
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
