import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], display: 'swap' })

export const metadata: Metadata = {
  title: "Debasmita Behera | Digital Marketing Specialist",
  description:
    "Portfolio of Debasmita Behera, a Digital Marketing Specialist with expertise in SEO, SMO, and Email Marketing",
  generator: 'v0.dev',
  icons: {
    icon: '/image.png',
    apple: '/image.png'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0D0C13'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth-desktop">
      <body className={`${inter.className} overscroll-none`}>{children}</body>
    </html>
  )
}
