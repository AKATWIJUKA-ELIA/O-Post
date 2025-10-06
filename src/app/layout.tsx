import type React from "react"
import type { Metadata } from "next"
import { Libre_Baskerville, Inter } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import ClientProviders from "./Providers"
import { Suspense } from "react"
import "./globals.css"
import "./styles.css"
import ConditionalFooter  from "@/components/ConditionalFooter/page"
import { Header } from "@/components/header"
import MessagePop from "@/components/MessagePop/page"

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
  title: "The O-Post - Professional News Platform",
  description: "Stay informed with trusted journalism and in-depth reporting",
//   generator: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${libreBaskerville.variable} overflow-x-hidden  text-foreground antialiased`}>
        <ClientProviders>
        <Header />
        <MessagePop />
        <Suspense fallback={null}>{children}</Suspense>
        {/* <Analytics /> */}
        <ConditionalFooter />
        </ClientProviders>
      </body>
    </html>
  )
}
