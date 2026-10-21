import type { MetadataRoute } from "next"

import { absoluteUrl, getAllPostsForSeo } from "@/lib/seo"

// Rebuild the sitemap at most once an hour
export const revalidate = 3600

const SECTIONS = ["world", "politics", "business", "technology", "culture", "science", "health", "sports", "travel", "opinion", "lifestyle", "education"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsForSeo()

  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/news/${post._id}`),
    lastModified: new Date(post.updatedAt ?? post._creationTime),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [
    { url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.4 },
    ...SECTIONS.map((slug) => ({
      url: absoluteUrl(`/category/${slug}`),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...articles,
  ]
}
