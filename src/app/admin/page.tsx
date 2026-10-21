"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Trash2, Share2, PenSquare, FileText, FolderOpen, ThumbsUp, CalendarClock } from "lucide-react"
import { useMemo } from "react"
import Link from "next/link"
import useGetAllPosts from "@/hooks/useGetAllPosts"
import { formatShortDate, timeAgo } from "@/lib/utils"
import { PostWithAuthor } from "@/lib/types"
import { deletePost } from "@/lib/convex"
import { Id } from "../../../convex/_generated/dataModel"
import { useNotification } from "../NotificationContext"
import { handleShare } from "@/lib/utils"
import { BASE_URL } from "@/lib/urls"

const PostList=() =>{
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const {data:posts} = useGetAllPosts();
  const [PostsWithAuthors, setPostsWithAuthors] = useState<PostWithAuthor[]>([]);
  const {setNotification} = useNotification();

  useEffect(() => {
    if (posts) {
      setPostsWithAuthors(posts);
      setLoading(false);
    }
  }, [posts]);

  useEffect(() => {
        if (posts) {
                setLoading(false)
        }
  }, [posts])
        const handleDelete = (postId: Id<"posts">) => async () => {
                   const confirmed = typeof window !== "undefined"
            ? window.confirm("This action cannot be undone. Are you sure you want to delete this post?")
            : false;
          if (!confirmed) return;
          
                const res = await deletePost(postId);
                        if(!res?.success){
                                setNotification({
                                status: "info",
                                message: res?.message||"ssssomething went wrong",
                         });
                                return;
                        }
                        setPostsWithAuthors((prevPosts) => prevPosts.filter((post) => post._id !== postId));
                        setNotification({ 
                                status: "success",
                                message: "Post deleted successfully."
                         });
        }



  const categoryKey = (category: string) => category?.trim().toLowerCase() || "general"

  const categories = useMemo(
    () => Array.from(new Set(PostsWithAuthors.map((post) => categoryKey(post.category)))).sort(),
    [PostsWithAuthors],
  )

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return [
      { label: "Total articles", value: PostsWithAuthors.length, icon: FileText, accent: "bg-primary/10 text-primary" },
      { label: "Categories", value: categories.length, icon: FolderOpen, accent: "bg-sky-500/10 text-sky-600" },
      {
        label: "Total upvotes",
        value: PostsWithAuthors.reduce((sum, post) => sum + (post.upvotes ?? 0), 0),
        icon: ThumbsUp,
        accent: "bg-emerald-500/10 text-emerald-600",
      },
      {
        label: "Published this week",
        value: PostsWithAuthors.filter((post) => (post._creationTime ?? 0) >= weekAgo).length,
        icon: CalendarClock,
        accent: "bg-crimson/10 text-crimson",
      },
    ]
  }, [PostsWithAuthors, categories])

  const filteredNews = PostsWithAuthors.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (categoryFilter === "all" || categoryKey(item.category) === categoryFilter),
  )

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center gap-3 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-crimson border-t-transparent" />
        Loading articles…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">News & Articles</h2>
          <p className="text-sm text-muted-foreground">Manage, edit and share everything published on The O-Post.</p>
        </div>
        <Button asChild className="bg-crimson text-white hover:bg-crimson/90">
          <Link href="/admin/create">
            <Plus className="mr-2 h-4 w-4" />
            Create article
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
              <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles by title…"
            aria-label="Search articles"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm capitalize shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground sm:ml-2 sm:whitespace-nowrap">
          {filteredNews.length} of {PostsWithAuthors.length} shown
        </p>
      </div>

      {/* Articles */}
      {filteredNews.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
          No articles match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredNews.map((item) => (
            <article
              key={item._id}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href={`/admin/edit/${item._id}`} className="relative block aspect-video overflow-hidden bg-muted">
                <img
                  src={item.postImage || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                  {item.category?.trim() || "General"}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-4">
                <Link href={`/admin/edit/${item._id}`}>
                  <h3 className="line-clamp-2 font-bold leading-snug text-foreground transition group-hover:text-crimson">
                    {item.title}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    By <span className="font-semibold text-foreground">{item.author?.username ?? "Unknown"}</span>
                  </span>
                  <span title={formatShortDate(item._creationTime || 0)}>{timeAgo(item._creationTime || 0)}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" /> {item.upvotes ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 border-t border-border p-2">
                <Button asChild variant="ghost" size="sm" className="flex-1">
                  <Link href={`/admin/edit/${item._id}`}>
                    <PenSquare className="mr-1.5 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleShare(`${BASE_URL}/news/${item._id}`, item.title)}
                >
                  <Share2 className="mr-1.5 h-4 w-4" /> Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleDelete(item._id)}
                  aria-label="Delete this post"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
export default PostList
