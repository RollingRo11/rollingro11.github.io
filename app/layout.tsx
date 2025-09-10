import type React from "react";
import type { Metadata, Viewport } from "next";
import { Crimson_Pro } from "next/font/google";
import "./globals.css";
import { CustomThemeProvider } from "@/components/custom-theme-provider";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

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
  width: 1200,
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
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
              const savedTheme = localStorage.getItem('darkMode');
              const isDark = savedTheme !== null ? savedTheme === 'true' : true;

              if (isDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.backgroundColor = '#222129';
                document.body.style.backgroundColor = '#222129';
              } else {
                document.documentElement.style.backgroundColor = '#ffffff';
                document.body.style.backgroundColor = '#ffffff';
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
      <body className={crimsonPro.className}>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </body>
    </html>
  );
}
