"use client"
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  ThumbsDown,
  ThumbsUp,
  Link2,
  ShareIcon,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import useGetPostById from "@/hooks/useGetPostById"
import { Id } from "../../../../convex/_generated/dataModel"
import { formatDate } from "@/lib/utils"
import { getUserById } from "@/lib/convex"
import { useEffect, useMemo, useState } from "react"
import { User } from "@/lib/types"
import useInteractWithPost from "@/hooks/useInteractWithPost"
import Lodear from "@/components/Loader/loader"
import { CommentSection } from "@/components/CommentSection/Comments"
import { useAppSelector } from "@/hooks"
import { handleShare } from "@/lib/utils"
import { BASE_URL } from "@/lib/urls"
import useGetPostsByCategory from "@/hooks/useGetPostsByCategory"
import { useNotification } from "@/app/NotificationContext"
import {getPostById } from "@/lib/convex"
import { Metadata } from 'next';
interface PageProps {
  params: {
    id: string;
  };
}
 export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 const { id } = params
  const news = await getPostById(id as Id<"posts">);
                        return {
                                title: news.post?.title||"O-Media",
                                description: news.post?.excerpt || "",
                                openGraph: {
                                title: news.post?.title,
                                description: news.post?.excerpt || "",
                                images: [news.post?.postImage|| '/default-og-image.jpg'],
                                url: `${BASE_URL}/news/${news.post?._id}`,
                                type: "website"
                                }
                                }
                        };

export default function NewsArticlePage({ params }: PageProps) {
  const { id } = params
  const { data: article } = useGetPostById(id as Id<"posts">)
  const [Author, setAuthor] = useState<User | null>(null)
  const { likePost, disLikePost } = useInteractWithPost()
  const user = useAppSelector((state) => state.user.user)
  const { data: relatedArticles, loading } = useGetPostsByCategory(article?.category || "")
  const { setNotification } = useNotification()

  useEffect(() => {
    async function fetchAuthor() {
      if (!article?.authorId) return
      const response = await getUserById(article.authorId as Id<"users">)
      setAuthor(response.user)
    }
    fetchAuthor()
  }, [article])

  const articleUrl = `${BASE_URL}/news/${id}`

  const estimatedReadTime = useMemo(() => {
    if (!article?.content) return 3
    const words = article.content.split(/\s+/).length
    return Math.max(3, Math.ceil(words / 200))
  }, [article?.content])


  const filteredRelated = useMemo(() => {
    if (!relatedArticles || !article?._id) return []
    return relatedArticles.filter((related) => related._id !== article._id)
  }, [relatedArticles, article?._id])

  const handleLike = async () => {
    if (!article) return
    if (!user) {
      setNotification({ status: "info", message: "Please login to like" })
      return
    }
    const response = await likePost(article._id, user?.User_id as Id<"users">)
    if (!response.success) {
      setNotification({ status: "error", message: response.message || "Something went wrong" })
    }
  }

  const handleDisLike = async () => {
    if (!article) return
    if (!user) {
      setNotification({ status: "info", message: "Please login to dislike" })
      return
    }
    const response = await disLikePost(article._id, user?.User_id as Id<"users">)
    if (!response.success) {
      setNotification({ status: "error", message: response.message || "Something went wrong" })
    }
  }

  const sharePost = (link: string, name: string) => {
    return handleShare(link, name)
  }

 

  if (!article)
    return (
      <div className="flex h-screen items-center justify-center">
        <Lodear />
      </div>
    )

  const shareOptions = [
    {
      label: "Twitter",
      icon: Twitter,
      color: "text-sky-500",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`
    },
    {
      label: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      color: "text-sky-700",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`
    }
  ]

  const metadataItems = [
    { label: "Published", value: formatDate(article?._creationTime || 0) },
    { label: "Category", value: article?.category },
    { label: "Estimated read", value: `${estimatedReadTime} min read` }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-2xl border border-transparent transition hover:border-border hover:bg-primary/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to feed
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sharePost(articleUrl, article.title)}
            className="gap-2 rounded-2xl border-primary/20 bg-transparent text-primary transition hover:bg-primary/10"
          >
            <Share2 className="h-4 w-4" />
            Quick share
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.9fr)]">
          <article className="space-y-10">
            <section className="rounded-3xl border border-border/70 bg-card/80 p-8 shadow-xl shadow-primary/5 backdrop-blur">
              <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{article?.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(article?._creationTime || 0)}
                </span>
                <span>•</span>
                <span>{estimatedReadTime} min read</span>
              </div>
              <h1 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                {article?.title}
              </h1>
              {article?.excerpt && (
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={Author?.profilePicture || "/placeholder.svg"} alt={Author?.username || "Author"} />
                    <AvatarFallback>
                      {Author?.username
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Written by</p>
                    <p className="text-lg font-semibold text-foreground">{Author?.username || "Contributor"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleLike}>
                    <ThumbsUp className="h-4 w-4" />
                    Appreciate ({article?.upvotes ?? 0})
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleDisLike}>
                    <ThumbsDown className="h-4 w-4" />
                    Not helpful ({article?.downvotes ?? 0})
                  </Button>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-border/70">
              <div className="relative">
                <img
                  src={article?.postImage || "/placeholder.svg"}
                  alt={article?.title}
                  className="h-full w-full max-h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm uppercase tracking-wide text-white/80">On the record</p>
                  <p className="text-lg font-semibold">{article?.category}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border/70 bg-card/80 p-8 shadow-md shadow-primary/5">
              <div className="grid gap-6 sm:grid-cols-3">
                {metadataItems.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/60 bg-background/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-8" />
             <div className="prose prose-lg max-w-none">
            <p  className="mb-6 text-pretty leading-relaxed text-foreground">
              {article?.content.split("\n").map((para, idx) => (
                <span key={idx}>
                  {para}
                  <br />
                  <br />
                </span>
              ))}
            </p>
        </div>
            </section>

            <section className="rounded-3xl border border-border/70 bg-card/80 p-8 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">Join the discussion</h3>
                  <p className="text-muted-foreground">Share your point of view with the community.</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => sharePost(articleUrl, article.title)}
                  className="gap-2 rounded-full bg-primary/90 text-primary-foreground"
                >
                  <ShareIcon className="h-4 w-4" />
                  Share story
                </Button>
              </div>
              <Separator className="my-6" />
              <CommentSection postId={article?._id} userId={user?.User_id as Id<"users">} />
            </section>
          </article>

          <aside className="space-y-6">
             

            <div className="rounded-3xl border border-border/70 bg-card/80 p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Story metrics</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/40 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Positive reactions</p>
                    <p className="text-2xl font-semibold">{article?.upvotes ?? 0}</p>
                  </div>
                  <ThumbsUp className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/40 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Skeptical votes</p>
                    <p className="text-2xl font-semibold">{article?.downvotes ?? 0}</p>
                  </div>
                  <ThumbsDown className="h-5 w-5 text-destructive" />
                </div>
                <div className="rounded-2xl border border-dashed border-border/60 bg-background/30 p-4 text-sm text-muted-foreground">
                  Enjoying the coverage? Share it with your circle to keep independent journalism thriving.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card/80 p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Spotlight</p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">More from this topic</h3>
              <div className="mt-4 space-y-4">
                {loading && <p className="text-sm text-muted-foreground">Loading related stories…</p>}
                {!loading && filteredRelated.length === 0 && (
                  <p className="text-sm text-muted-foreground">We will add more related stories soon.</p>
                )}
                {filteredRelated.slice(0, 3).map((story) => (
                  <Link
                    key={story._id}
                    href={`/news/${story._id}`}
                    className="group block rounded-2xl border border-border/60 bg-background/30 p-4 transition hover:border-primary/40"
                  >
                    <p className="text-xs text-muted-foreground">{formatDate(story._creationTime)}</p>
                    <p className="mt-2 line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                      {story.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <section className="border-t border-border/60 bg-muted/40 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Keep reading</p>
              <h2 className="text-3xl font-serif font-semibold text-foreground">Related articles curated for you</h2>
            </div>
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              View all
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
          {relatedArticles && relatedArticles.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRelated.slice(0, 6).map((related) => (
                <Link
                  key={related._id}
                  href={`/news/${related._id}`}
                  className="group flex flex-col rounded-3xl border border-border/70 bg-card/80 p-6 transition hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">{related.category}</span>
                    <span>{formatDate(related._creationTime)}</span>
                  </div>
                  <h3 className="flex-1 text-balance text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-muted-foreground">No related articles found.</p>
          )}
        </div>
      </section>
    </div>
  )
}
