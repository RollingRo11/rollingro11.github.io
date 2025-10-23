import type React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CustomThemeProvider } from "@/components/custom-theme-provider";

const paperMono = localFont({
  src: "./fonts/PaperMono-Regular.woff2",
  variable: "--font-paper-mono",
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
  themeColor: "#eeeeee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const savedTheme = localStorage.getItem('darkMode');
              const isDark = savedTheme !== null ? savedTheme === 'true' : true;

              if (isDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.backgroundColor = '#222129';
                document.body.style.backgroundColor = '#222129';
              } else {
                document.documentElement.style.backgroundColor = 'rgb(238, 238, 238)';
                document.body.style.backgroundColor = 'rgb(238, 238, 238)';
              }
            })();
          `,
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#eeeeee" />
      </head>
      <body className={paperMono.className}>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </body>
    </html>
  );
}
