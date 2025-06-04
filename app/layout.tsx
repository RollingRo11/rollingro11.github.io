import type React from "react"
import type { Metadata, Viewport } from "next"
import { Crimson_Pro } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeMetaUpdater } from "@/components/theme-meta-updater"

const crimsonPro = Crimson_Pro({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://rkathuria.com'),
  title: "Rohan Kathuria",
  description: "Portfolio of Rohan Kathuria",
  icons: {
    icon: "/favicon.svg",
  },
  generator: 'v0.dev',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rohan Kathuria'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    title: "Rohan Kathuria",
    description: "Portfolio",
    url: "https://rkathuria.com",
    siteName: "Rohan Kathuria",
    images: [
      {
        url: "/title.png",
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
    images: ["/title.png"],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f5f0e6'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#f5f0e6" />
      </head>
      <body className={crimsonPro.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ThemeMetaUpdater />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
