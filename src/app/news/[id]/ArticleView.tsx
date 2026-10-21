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
  Link2
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import type { DwonloadPost } from "@/lib/types"

interface ArticleViewProps {
  id: string
  /** Post fetched on the server, so the article is in the initial HTML for crawlers and previews. */
  initialArticle: DwonloadPost | null
}

export default function ArticleView({ id, initialArticle }: ArticleViewProps) {
  const { data: liveArticle } = useGetPostById(id as Id<"posts">)
  const article = liveArticle ?? initialArticle
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
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`
    }
  ]

  const iconButton =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"

  return (
    <div className="min-h-screen bg-[#f4f4f6]">
      <main className="mx-auto w-[95%] xl:w-[85%] py-8 lg:py-12">
        <Link
          href={`/category/${encodeURIComponent(article.category)}`}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {article.category}
        </Link>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0 bg-card p-5 shadow-sm sm:p-8">
            <header className="mx-auto max-w-3xl">
              <p className="kicker">{article.category}</p>
              <h1 className="mt-3 text-balance font-serif text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="mt-5 text-pretty text-xl leading-relaxed text-muted-foreground">{article.excerpt}</p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={Author?.profilePicture || undefined} alt={Author?.username || "Author"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {Author?.username?.charAt(0).toUpperCase() ?? "O"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">By {Author?.username || "Contributor"}</p>
                    <p className="text-muted-foreground">
                      <time>{formatDate(article._creationTime || 0)}</time> · {estimatedReadTime} min read
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {shareOptions.map(({ label, icon: Icon, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={iconButton}>
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">Share on {label}</span>
                    </a>
                  ))}
                  <button onClick={() => sharePost(articleUrl, article.title)} className={iconButton}>
                    <Link2 className="h-4 w-4" />
                    <span className="sr-only">Copy or share link</span>
                  </button>
                </div>
              </div>
            </header>

            <figure className="my-8">
              <img
                src={article.postImage || "/placeholder.svg"}
                alt={article.title}
                className="max-h-[560px] w-full bg-muted object-cover"
              />
            </figure>

            <div className="mx-auto max-w-3xl">
              <div className="space-y-6 font-serif text-lg leading-[1.85] text-foreground">
                {article.content
                  .split("\n")
                  .filter((para) => para.trim().length > 0)
                  .map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
                <span className="text-sm font-semibold text-foreground">Was this story useful?</span>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleLike}>
                  <ThumbsUp className="h-4 w-4" />
                  Yes ({article.upvotes ?? 0})
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleDisLike}>
                  <ThumbsDown className="h-4 w-4" />
                  No ({article.downvotes ?? 0})
                </Button>
              </div>

              <section className="mt-12 border-t-2 border-foreground pt-6">
                <h2 className="font-serif text-2xl font-bold">Discussion</h2>
                <p className="mb-6 mt-1 text-sm text-muted-foreground">Share your point of view with the community.</p>
                <CommentSection postId={article._id} userId={user?.User_id as Id<"users">} />
              </section>
            </div>
          </article>

          <aside>
            <div className="lg:sticky lg:top-20">
              <div className="mb-3 flex items-center gap-3"><span className="h-0.5 w-6 bg-crimson" /><h2 className="text-sm font-bold uppercase tracking-wide">More in {article.category}</h2><span className="h-px flex-1 bg-border" /></div>
              {loading && <p className="py-4 text-sm text-muted-foreground">Loading related stories…</p>}
              {!loading && filteredRelated.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">More stories will be added soon.</p>
              )}
              <div className="divide-y divide-border bg-card px-4 shadow-sm">
                {filteredRelated.slice(0, 5).map((story) => (
                  <Link key={story._id} href={`/news/${story._id}`} className="group block py-4">
                    <h3 className="font-serif text-base font-bold leading-snug text-foreground transition group-hover:text-primary group-hover:underline group-hover:underline-offset-4">
                      {story.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(story._creationTime)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
