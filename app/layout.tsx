import type React from "react"
import type { Metadata } from "next"
import { Crimson_Pro } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const crimsonPro = Crimson_Pro({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rohan Kathuria",
  description: "Portfolio of Rohan Kathuria",
  icons: {
    icon: "/favicon.svg",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={crimsonPro.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
