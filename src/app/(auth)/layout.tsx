import type { Metadata } from "next"

// Account pages have no value in search results
export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
