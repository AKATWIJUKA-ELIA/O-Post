"use client"

import { useMemo } from "react"

import useGetAllPosts from "@/hooks/useGetAllPosts"
import type { StoryLike } from "@/components/story-card"
import { BlockHeading, CompactRow, FeatureCard } from "@/components/news-blocks"

const toTitle = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

/** Two category "desks": the busiest gets a lead image plus a list, the next gets a list. */
export function CategoryGrid() {
  const { data: posts } = useGetAllPosts()

  const desks = useMemo(() => {
    if (!posts) return []
    const map = new Map<string, StoryLike[]>()
    for (const post of posts as unknown as StoryLike[]) {
      const key = post.category?.trim().toLowerCase() || "general"
      map.set(key, [...(map.get(key) ?? []), post])
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 2)
  }, [posts])

  if (desks.length === 0) return null

  const [first, second] = desks

  return (
    <section className="mx-auto w-[95%] xl:w-[85%] py-8">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-4">
        <div className="lg:col-span-2">
          <BlockHeading title={toTitle(first[0])} />
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard story={first[1][0]} />
            <div className="space-y-2">
              {first[1].slice(1, 5).map((story) => (
                <CompactRow key={story._id} story={story} />
              ))}
            </div>
          </div>
        </div>

        {second && (
          <div>
            <BlockHeading title={toTitle(second[0])} />
            <div className="space-y-2">
              {second[1].slice(0, 5).map((story) => (
                <CompactRow key={story._id} story={story} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
