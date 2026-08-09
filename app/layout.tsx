import type React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Crimson_Pro, Crimson_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Crimson Pro (variable) sets display: the wordmark, headings, and the small
// letterspaced labels. Crimson Text sets running prose at reading size.
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
  display: "swap",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson-text",
  display: "swap",
});

// Monospace survives for code only, where the grid is load-bearing.
const lilex = localFont({
  src: [
    { path: "./fonts/Lilex-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Lilex-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Lilex-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Lilex-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-lilex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rkathuria.com"),
  title: "Rohan Kathuria",
  description: "Mechanistic interpretability research and writing by Rohan Kathuria.",
  icons: {
    icon: "/favicon.svg",
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
        url: "https://rkathuria.com/title.png?v=1",
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
    images: ["https://rkathuria.com/title.png?v=1"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Kept as a single value so the provider can follow a manual toggle.
  themeColor: "#faf7f2",
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
    root.style.backgroundColor = mode === 'dark' ? '#17140f' : '#faf7f2';
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
      className={`${crimsonPro.variable} ${crimsonText.variable} ${lilex.variable}`}
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
