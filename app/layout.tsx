import type React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// DM Sans is the site face: wordmark, titles, and all reading text.
const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Lilex is the data face: HUD readouts, spec labels, code.
const lilex = localFont({
  // One face only: the italic and bold cuts were preloaded on every page and
  // never used. woff2 is a quarter the size of the ttf.
  src: [{ path: "./fonts/Lilex-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-lilex",
  display: "swap",
});

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
  // Kept as a single value so the provider can follow a manual toggle.
  themeColor: "#ffffff",
};

// Resolves the theme before first paint so there's no flash. Light is the
// default until the reader picks otherwise; the system preference is ignored.
const BOOT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var mode = saved === 'dark' ? 'dark' : 'light';
    var root = document.documentElement;
    root.classList.add('theme-' + mode);
    root.style.backgroundColor = mode === 'dark' ? '#131413' : '#ffffff';
  } catch (e) {
    document.documentElement.classList.add('theme-light');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${lilex.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
