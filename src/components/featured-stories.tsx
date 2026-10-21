"use client"

import { useEffect, useState } from "react"

import useGetAllPosts from "@/hooks/useGetAllPosts"
import Loader from "./Loader/loader"
import type { StoryLike } from "@/components/story-card"
import { BlockHeading, PostCard } from "@/components/news-blocks"

// The front page shows the first few posts; this section shows a shuffled pick of the rest.
const FRONT_PAGE_COUNT = 5

export function FeaturedStories() {
  const { data: posts, loading } = useGetAllPosts()
  const [stories, setStories] = useState<StoryLike[]>([])

  useEffect(() => {
    if (!posts) return
    const pool = (posts.length > FRONT_PAGE_COUNT ? posts.slice(FRONT_PAGE_COUNT) : posts) as unknown as StoryLike[]
    setStories(
      pool
        .map((post) => ({ post, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ post }) => post),
    )
  }, [posts])

  if (loading) {
    return (
      <section className="py-16">
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </section>
    )
  }

  if (stories.length === 0) return null

  return (
    <section className="mt-8 border-t border-border bg-muted/60 py-8">
      <div className="mx-auto w-[95%] xl:w-[85%]">
        <BlockHeading title="Featured Posts" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stories.slice(0, 4).map((story) => (
            <PostCard key={story._id} story={story} />
          ))}
        </div>
      </div>
    </section>
  )
}
