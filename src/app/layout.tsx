import type React from "react"
import type { Metadata, Viewport } from "next"
import { Libre_Baskerville, Inter } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import ClientProviders from "./Providers"
import { Suspense } from "react"
import "./globals.css"
import "./styles.css"
import ConditionalFooter  from "@/components/ConditionalFooter/page"
import { Header } from "@/components/header"
import MessagePop from "@/components/MessagePop/page"
import { BASE_URL } from "@/lib/urls"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo"

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
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["Uganda news", "news", "politics", "business", "sports", "technology", "culture", "Bugema University", SITE_NAME],
  publisher: "O-Media",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "news",
}

export const viewport: Viewport = {
  themeColor: "#c8102e",
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
