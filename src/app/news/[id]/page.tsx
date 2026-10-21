import type { Metadata } from "next"
import { notFound } from "next/navigation"

import ArticleView from "./ArticleView"
import { SITE_NAME, absoluteUrl, getAuthorNameForSeo, getPostForSeo, summarize, titleCase } from "@/lib/seo"
import type { DwonloadPost } from "@/lib/types"

interface PageProps {
  params: { id: string }
}

// Re-fetch at most every 5 minutes so edits show up in previews and search results
export const revalidate = 300

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostForSeo(params.id)
  if (!post) {
    return { title: "Article not found", robots: { index: false, follow: true } }
  }

  const url = absoluteUrl(`/news/${post._id}`)
  const description = summarize(post.excerpt || post.content)
  const author = await getAuthorNameForSeo(post.authorId)
  const images = post.postImage ? [{ url: post.postImage, alt: post.title }] : undefined
  const published = new Date(post._creationTime).toISOString()
  const modified = post.updatedAt ? new Date(post.updatedAt).toISOString() : published

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    authors: author ? [{ name: author }] : undefined,
    keywords: [post.category, SITE_NAME, "Uganda news"].filter(Boolean),
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: published,
      modifiedTime: modified,
      section: titleCase(post.category || "News"),
      authors: author ? [author] : undefined,
      // When a post has no image, the site-wide default from app/opengraph-image is used
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.postImage && { images: [post.postImage] }),
    },
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const post = await getPostForSeo(params.id)
  if (!post) notFound()

  const author = await getAuthorNameForSeo(post.authorId)
  const url = absoluteUrl(`/news/${post._id}`)
  const published = new Date(post._creationTime).toISOString()

  // Structured data so search engines can show this as a news article (headline, image, date, author)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        headline: post.title.slice(0, 110),
        description: summarize(post.excerpt || post.content),
        image: post.postImage ? [post.postImage] : [absoluteUrl("/opengraph-image")],
        datePublished: published,
        dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : published,
        articleSection: titleCase(post.category || "News"),
        author: { "@type": "Person", name: author ?? `${SITE_NAME} Staff` },
        publisher: {
          "@type": "NewsMediaOrganization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: titleCase(post.category || "News"),
            item: absoluteUrl(`/category/${encodeURIComponent((post.category || "news").toLowerCase())}`),
          },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so post text can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ArticleView id={params.id} initialArticle={post as unknown as DwonloadPost} />
    </>
  )
}
