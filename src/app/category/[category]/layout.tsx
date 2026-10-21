import type { Metadata } from "next"

import { SITE_NAME, absoluteUrl, titleCase } from "@/lib/seo"

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const slug = decodeURIComponent(params.category)
  const name = titleCase(slug)
  const url = absoluteUrl(`/category/${encodeURIComponent(slug.toLowerCase())}`)
  const description = `The latest ${name} news, reporting and analysis from ${SITE_NAME}.`

  return {
    title: `${name} News`,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${name} News | ${SITE_NAME}`, description, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title: `${name} News | ${SITE_NAME}`, description },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
