import type React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Crimson_Pro } from "next/font/google";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const savedColorMode = localStorage.getItem('colorMode');
              // Migrate old darkMode setting if it exists
              let colorMode = savedColorMode;
              if (!colorMode) {
                const oldDarkMode = localStorage.getItem('darkMode');
                colorMode = oldDarkMode !== null ? (oldDarkMode === 'true' ? 'dark' : 'light') : 'dark';
              }

              if (colorMode === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.style.backgroundColor = '#222129';
                document.body.style.backgroundColor = '#222129';
              } else {
                document.documentElement.style.backgroundColor = 'rgb(255, 255, 255)';
                document.body.style.backgroundColor = 'rgb(255, 255, 255)';
              }
            })();
          `,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${codeNewRoman.variable} ${departureMono.variable} ${crimsonPro.variable} ${paperMono.variable}`} style={{ fontFamily: "'Inter', sans-serif" }}>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </body>
    </html>
  );
}
