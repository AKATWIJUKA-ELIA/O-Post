"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

import useGetPostsByCategory from "@/hooks/useGetPostsByCategory"
import type { StoryLike } from "@/components/story-card"
import { OverlayCard, PostCard } from "@/components/news-blocks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Loader from "@/components/Loader/loader"

interface PageProps {
  params: {
    category: string
  }
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  world: "Global coverage on geopolitics, diplomacy, and climate",
  politics: "Power, policy, and the people shaping our nations",
  business: "Boardrooms to trading floors, follow the money",
  technology: "Innovation, AI breakthroughs, and digital culture",
  culture: "Arts, fashion, and the stories moving society",
  science: "Discoveries expanding the frontiers of knowledge",
  health: "Wellness, medicine, and public health insights",
  sports: "Victories, rivalries, and the culture around the game",
  travel: "Destinations, design, and experiences worldwide",
  opinion: "Editorial viewpoints from the newsroom and beyond",
}

const toTitleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

export default function CategoryPage({ params }: PageProps) {
  const slug = decodeURIComponent(params.category)
  const normalizedSlug = slug.replace(/-/g, " ")
  const displayCategory = toTitleCase(normalizedSlug)

  const { data: posts, loading } = useGetPostsByCategory(slug)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"latest" | "oldest">("latest")

  const filteredPosts = useMemo(() => {
    if (!posts) return []
    const q = query.trim().toLowerCase()
    const base = posts.filter((post) =>
      q.length === 0
        ? true
        : [post.title, post.excerpt, post.content]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(q)),
    )

    return base.sort((a, b) => {
      const timeA = a._creationTime ?? 0
      const timeB = b._creationTime ?? 0
      return sort === "latest" ? timeB - timeA : timeA - timeB
    })
  }, [posts, query, sort])

  const spotlight = filteredPosts[0]
  const remaining = filteredPosts.slice(1)

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </section>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg text-muted-foreground">
          No stories found for <span className="font-semibold text-foreground">{displayCategory}</span>.
        </p>
        <Button asChild variant="outline">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to front page
          </Link>
        </Button>
      </section>
    )
  }

  const stories = filteredPosts as unknown as StoryLike[]
  const [lead, ...rest] = stories

  return (
    <div className="bg-[#f4f4f6]">
      <header className="relative overflow-hidden border-b-4 border-crimson bg-[#16161d] text-white">
        <div className="mx-auto w-[95%] xl:w-[85%] py-10">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-crimson">Section</p>
          <h1 className="mt-1 font-serif text-4xl font-bold tracking-tight sm:text-5xl">{displayCategory}</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            {CATEGORY_DESCRIPTIONS[slug] ||
              CATEGORY_DESCRIPTIONS[normalizedSlug.toLowerCase()] ||
              "Reporting, analysis and perspectives from the O-Post newsroom."}
          </p>
        </div>
      </header>

      <div className="mx-auto w-[95%] xl:w-[85%] py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
          </p>
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${displayCategory}`}
                aria-label={`Search ${displayCategory}`}
                className="pl-9"
              />
            </div>
            <Select value={sort} onValueChange={(value) => setSort(value as "latest" | "oldest")}>
              <SelectTrigger className="w-[130px]" aria-label="Sort order">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!lead ? (
          <p className="py-16 text-center text-muted-foreground">No articles match your search.</p>
        ) : (
          <>
            <OverlayCard story={lead} size="lg" className="mb-8 aspect-[16/9] max-h-[32rem] w-full" />
            {rest.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {rest.map((story) => (
                  <PostCard key={story._id} story={story} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
