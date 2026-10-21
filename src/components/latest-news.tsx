"use client"

import useGetAllPosts from "@/hooks/useGetAllPosts"
import type { StoryLike } from "@/components/story-card"
import { BlockHeading, CompactRow, FeatureCard } from "@/components/news-blocks"

/** Two columns of the newest stories on the left, one large spotlight story on the right. */
export function LatestNews() {
  const { data: posts } = useGetAllPosts()

  if (!posts || posts.length === 0) return null

  // GetAllPosts returns newest first
  const stories = posts as unknown as StoryLike[]
  const latest = stories.slice(0, 8)
  const spotlight = stories[8] ?? stories[stories.length - 1]
  const half = Math.ceil(latest.length / 2)

  return (
    <section className="pb-10 pt-2">
      <div className="mx-auto w-[95%] xl:w-[85%]">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-4">
          <div className="lg:col-span-2">
            <BlockHeading title="Latest updates" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                {latest.slice(0, half).map((story) => (
                  <CompactRow key={story._id} story={story} />
                ))}
              </div>
              <div className="space-y-2">
                {latest.slice(half).map((story) => (
                  <CompactRow key={story._id} story={story} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <BlockHeading title="In case you missed it" />
            <FeatureCard story={spotlight} className="flex-1" />
          </div>
        </div>
      </div>
    </section>
  )
}
