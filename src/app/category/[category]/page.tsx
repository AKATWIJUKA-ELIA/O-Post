"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock, Search, SlidersHorizontal } from "lucide-react"

import useGetPostsByCategory from "@/hooks/useGetPostsByCategory"
import { formatDate, truncateString } from "@/lib/utils"
import type { Id } from "../../../../convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Loader from "@/components/Loader/loader"

interface PageProps {
  params: {
    category: string
  }
}

const FALLBACK_IMAGE = "/placeholder.svg"

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
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <Loader />
      </section>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-background text-center">
        <p className="text-lg text-muted-foreground">
          No stories found for <span className="font-semibold text-foreground">{displayCategory}</span>.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/news">Browse all news</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-background text-white relative">
        
      <section className="relative overflow-hidden py-16">
        <Image src={filteredPosts[0].postImage||""} width={100} height={100} alt=""  className={`absolute inset-0 object-cover  flex`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_50%)]" aria-hidden="true" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white">
            Category
          </Badge>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">{displayCategory}</h1>
              <p className="max-w-2xl text-base text-white/70">
                {CATEGORY_DESCRIPTIONS[slug] || CATEGORY_DESCRIPTIONS[normalizedSlug.toLowerCase()] ||
                  "Curated reporting, analysis, and perspectives from the O-Post newsroom."}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <span>
                  {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                </span>
                {spotlight && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Updated {formatDate(spotlight._creationTime ?? Date.now())}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="rounded-full border-white/30 text-slate-900 hover:bg-white/10">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to front page
                </Link>
              </Button>
              <Button asChild className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                <Link href="/news">
                  Latest news <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 rounded-t-[32px] bg-background px-4 py-10 shadow-2xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search within ${displayCategory}`}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={sort} onValueChange={(value: "latest" | "oldest") => setSort(value)}>
                <SelectTrigger className="w-40 rounded-2xl border-border">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-2xl border-border text-muted-foreground" disabled>
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
          </div>

          {spotlight && (
            <article className="mb-10 grid gap-6 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl lg:grid-cols-[1.6fr_1fr]">
              <div className="relative h-80 overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={spotlight.postImage || FALLBACK_IMAGE}
                  alt={spotlight.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
                  <Badge variant="outline" className="border-white/40 text-white">
                    Spotlight
                  </Badge>
                  <Link href={`/news/${spotlight._id as Id<"posts">}`}>
                    <h2 className="font-serif text-3xl leading-tight text-white">
                      {spotlight.title}
                    </h2>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4">
                <p className="text-base text-muted-foreground">
                  {truncateString(spotlight.excerpt ?? spotlight.content ?? "", 260)}
                </p>
                <div className="text-sm text-muted-foreground">
                  {formatDate(spotlight._creationTime ?? 0)}
                </div>
                <Button asChild className="rounded-full">
                  <Link href={`/news/${spotlight._id as Id<"posts">}`}>
                    Read analysis <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remaining.map((post) => (
              <article
                key={String(post._id)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-sm transition hover:-translate-y-1 hover:border-primary/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.postImage || FALLBACK_IMAGE}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, 30vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col space-y-3 p-4">
                  <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
                    {displayCategory}
                  </Badge>
                  <Link href={`/news/${post._id as Id<"posts">}`}>
                    <h3 className="font-serif text-xl font-semibold text-foreground transition group-hover:text-primary">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{truncateString(post.excerpt ?? post.content ?? "", 140)}</p>
                  <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(post._creationTime ?? 0)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {remaining.length === 0 && spotlight && (
            <div className="rounded-3xl border border-dashed border-border/60 p-8 text-center text-muted-foreground">
              You’re all caught up. Bookmark this desk for the next update.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}