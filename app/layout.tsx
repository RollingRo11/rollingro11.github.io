import type React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Crimson_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomThemeProvider } from "@/components/custom-theme-provider";


const codeNewRoman = localFont({
  src: "./fonts/cnr.otf",
  variable: "--font-code-new-roman",
  display: "swap",
});

const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
  display: "swap",
});

const paperMono = localFont({
  src: "./fonts/PaperMono-Regular.woff2",
  variable: "--font-paper-mono",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rkathuria.com"),
  title: "Rohan Kathuria",
  description: "Portfolio of Rohan Kathuria",
  icons: {
    icon: "/favicon.svg",
  },
  generator: "v0.dev",
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
    description: "Portfolio",
    url: "https://rkathuria.com",
    siteName: "Rohan Kathuria",
    images: [
      {
        url: "https://rkathuria.com/title.png?v=1",
        width: 1200,
        height: 630,
        alt: "Rohan.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Kathuria",
    description: "Portfolio",
    images: ["https://rkathuria.com/title.png?v=1"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${codeNewRoman.variable} ${departureMono.variable} ${crimsonPro.variable} ${paperMono.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const savedColorMode = localStorage.getItem('colorMode');
              let colorMode = savedColorMode;
              if (!colorMode) {
                const oldDarkMode = localStorage.getItem('darkMode');
                colorMode = oldDarkMode !== null ? (oldDarkMode === 'true' ? 'dark' : 'light') : 'dark';
              }
              const savedTint = localStorage.getItem('tint') || 'orange';
              const allowedTints = ['green','blue','red','yellow','purple','orange','pink'];

              // SRCL theme + tint classes on <html> (the inline script runs
              // before <body> exists, so we attach to documentElement to
              // avoid a FOUC. CSS selectors match either <html> or <body>.)
              const themeClass = colorMode === 'dark' ? 'theme-dark' : 'theme-light';
              document.documentElement.classList.add(themeClass);
              if (allowedTints.indexOf(savedTint) !== -1) {
                document.documentElement.classList.add('tint-' + savedTint);
              }

              if (colorMode === 'dark') {
                document.documentElement.classList.add('dark');
                if (savedTint === 'none') document.documentElement.style.backgroundColor = '#080808';
              } else {
                if (savedTint === 'none') document.documentElement.style.backgroundColor = '#ffffff';
              }
            })();
          `,
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body style={{ fontFamily: "var(--font-family-mono)" }}>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </body>
    </html>
  );
}
