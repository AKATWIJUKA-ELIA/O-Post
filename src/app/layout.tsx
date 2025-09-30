import type React from "react"
import type { Metadata } from "next"
import { Libre_Baskerville, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import "./styles.css"
import { Footer } from "@/src/components/footer"
import { Header } from "@/src/components/header"

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "The Chronicle - Professional News Platform",
  description: "Stay informed with trusted journalism and in-depth reporting",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${libreBaskerville.variable}`}>
        <Header />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}
