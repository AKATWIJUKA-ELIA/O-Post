"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Radio } from "lucide-react"

import useGetAllPosts from "@/hooks/useGetAllPosts"
import Loader from "./Loader/loader"
import type { StoryLike } from "@/components/story-card"
import { BlockHeading, OverlayCard, TextTile, TrendingItem } from "@/components/news-blocks"

const toTitle = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

export function HeroSection() {
  const { data: posts } = useGetAllPosts()
  const stories = useMemo(() => (posts ?? []) as unknown as StoryLike[], [posts])

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>()
    stories.forEach((s) => {
      const key = s.category?.trim().toLowerCase() || "general"
      counts.set(key, (counts.get(key) ?? 0) + 1)
    })
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([slug]) => slug)
  }, [stories])

  const trending = useMemo(
    () =>
      [...(posts ?? [])]
        .sort((a, b) => (b.upvotes ?? 0) - (b.downvotes ?? 0) - ((a.upvotes ?? 0) - (a.downvotes ?? 0)))
        .slice(0, 5) as unknown as StoryLike[],
    [posts],
  )

  if (!posts) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (stories.length === 0) {
    return <div className="flex h-[40vh] w-full items-center justify-center text-muted-foreground">No stories to display yet.</div>
  }

  const main = stories[0]
  const editors = stories.slice(1, 4)
  const breaking = stories.slice(0, 4)

  return (
    <section>
      {/* Popular tags */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex w-[95%] xl:w-[85%] items-center gap-4 py-2.5">
          <span className="flex-shrink-0 text-xs font-bold text-foreground">Popular Tags</span>
          <ul className="no-scrollbar flex gap-4 overflow-x-auto text-xs text-muted-foreground">
            {popularTags.map((slug) => (
              <li key={slug} className="flex-shrink-0">
                <Link href={`/category/${encodeURIComponent(slug)}`} className="transition hover:text-crimson">
                  # {toTitle(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto w-[95%] xl:w-[85%]">
        {/* Breaking news ticker */}
        <div className="mt-5 flex items-stretch overflow-hidden border border-border bg-card shadow-sm">
          <div className="flex flex-shrink-0 items-center gap-2 bg-crimson px-3 text-[0.68rem] font-bold uppercase tracking-wider text-white sm:px-4">
            <Radio className="h-4 w-4" />
            <span>Breaking<span className="hidden sm:inline"> news</span></span>
          </div>
          <div className="grid min-w-0 flex-1 divide-x divide-border md:grid-cols-2 xl:grid-cols-4">
            {breaking.map((story, i) => (
              <Link
                key={story._id}
                href={`/news/${story._id}`}
                className={`group items-center gap-2.5 p-2 ${i === 0 ? "flex" : i < 2 ? "hidden md:flex" : "hidden xl:flex"}`}
              >
                <span className="relative h-12 w-14 flex-shrink-0 overflow-hidden bg-muted">
                  <Image src={story.postImage || "/placeholder.svg"} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="line-clamp-2 text-xs font-semibold leading-snug text-foreground transition group-hover:text-crimson">
                  {story.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Three-column front page */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.05fr)] lg:gap-4">
          <div className="order-2 lg:order-1">
            <BlockHeading title="Editor's Picks" />
            <div className="space-y-2">
              {editors[0] && <OverlayCard story={editors[0]} className="aspect-[4/3]" />}
              {editors.slice(1).map((story) => (
                <TextTile key={story._id} story={story} />
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <BlockHeading title="Main News" />
            <OverlayCard story={main} size="lg" className="aspect-[4/3] lg:aspect-auto lg:h-[calc(100%-2.25rem)] lg:min-h-[28rem]" />
          </div>

          <div className="order-3">
            <BlockHeading title="Trending Now" />
            <div className="space-y-2">
              {trending.map((story, i) => (
                <TrendingItem key={story._id} story={story} rank={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
