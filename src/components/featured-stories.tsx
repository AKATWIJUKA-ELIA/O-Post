"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Bookmark } from "lucide-react"

import useGetAllPosts from "@/hooks/useGetAllPosts"
import { getUserById } from "@/lib/convex"
import { Id } from "../../convex/_generated/dataModel"
import { PostWithAuthor } from "@/lib/types"
import { formatDate, truncateString } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Loader from "./Loader/loader"

const FALLBACK_IMAGE = "/placeholder.svg"

export function FeaturedStories() {
  const { data: posts, loading } = useGetAllPosts()
  const [withAuthors, setWithAuthors] = useState<PostWithAuthor[]>([])

  useEffect(() => {
    if (!posts) return
    const randomizedPosts = posts
      .map((post) => ({ post, sort: Math.random() })) .reverse()
      .sort((a, b) => a.sort - b.sort)
      .map(({ post }) => post)
     setWithAuthors(randomizedPosts)
  }, [posts])

  const leadStory = withAuthors[1] ?? withAuthors[0]
  const supportingStories = useMemo(() => {
    const trimmed = leadStory ? withAuthors.filter((story) => story._id !== leadStory._id) : withAuthors
    return trimmed
  }, [withAuthors, leadStory])

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container flex items-center justify-center">
          <Loader />
        </div>
      </section>
    )
  }

  if (!withAuthors.length || !leadStory) {
    return null
  }

  return (
    <section className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/3 via-slate-900/3 to-transparent" aria-hidden="true" />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Daily brief</p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">Featured stories</h2>
          </div>
          {/* <Button variant="ghost" asChild className="rounded-full">
            <Link href="/news" className="inline-flex items-center gap-2">
              View all reports
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button> */}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                          {/* Supporting grid */}
          <div className="space-y-4">
            {supportingStories.slice(0,4).map((story) => (
              <Link
                key={String(story._id)}
                href={`/news/${story._id}`}
                className="group flex gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm transition hover:border-primary/40"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={story.postImage || FALLBACK_IMAGE}
                    alt={story.title}
                    fill
                    sizes="96px"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{story.category}</p>
                    <h4 className="font-semibold text-foreground transition group-hover:text-primary">
                      {truncateString(story.title, 110)}
                    </h4>
                    <h4 className=" text-foreground transition group-hover:text-primary">
                      {truncateString(story.content, 110)}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{story.author?.username ?? "Staff Reporter"}</span>
                    <span>•</span>
                    <time>{formatDate(story._creationTime ?? 0)}</time>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Lead feature */}
          <article className="group rounded-3xl border border-border/50 bg-card/70 shadow-xl backdrop-blur">
            <div className="relative h-80 overflow-hidden rounded-3xl bg-muted">
              <Image
                src={leadStory.postImage || FALLBACK_IMAGE}
                alt={leadStory.title}
                fill
                sizes="(max-width:1024px) 100vw, 55vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute left-6 right-6 bottom-6 flex flex-col gap-3 text-white">
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
                  <Badge variant="outline" className="border-white/50 text-white">
                    {leadStory.category}
                  </Badge>
                  <span className="text-white/60">{leadStory.author?.username ?? "Editorial Desk"}</span>
                  <span className="text-white/40">•</span>
                  <time className="text-white/70">{formatDate(leadStory._creationTime ?? 0)}</time>
                </div>
                <Link href={`/news/${leadStory._id}`}>
                  <h3 className="font-serif text-3xl leading-tight drop-shadow-lg transition group-hover:text-amber-200">
                    {leadStory.title}
                  </h3>
                </Link>
              </div>
            </div>
            <div className="space-y-4 p-8">
              <p className="text-lg text-muted-foreground">
                {truncateString(leadStory.excerpt ?? "", 220)}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Updated {formatDate(leadStory._creationTime ?? 0)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Bookmark className="h-4 w-4" /> Editorial spotlight
                </span>
              </div>
              <Button asChild className="rounded-full px-6">
                <Link href={`/news/${leadStory._id}`}>
                  Continue reading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>

        </div>

        {/* Secondary grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {supportingStories.slice(4, 10).map((story) => (
            <article
              key={`secondary-${String(story._id)}`}
              className="group rounded-2xl border border-border/50 bg-card/70 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={story.postImage || FALLBACK_IMAGE}
                  alt={story.title}
                  fill
                  sizes="(max-width:768px) 100vw, 30vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {story.category}
                </Badge>
                <Link href={`/news/${story._id}`}>
                  <h3 className="font-serif text-xl font-semibold text-foreground transition group-hover:text-primary">
                    {story.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">{truncateString(story.excerpt ?? "", 140)}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{story.author?.username ?? "News Desk"}</span>
                  <span>•</span>
                  <time>{formatDate(story._creationTime ?? 0)}</time>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
