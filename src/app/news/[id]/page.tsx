"use client"
import { ArrowLeft, Share2, Bookmark, Twitter, Facebook, Linkedin, ThumbsDown,ThumbsUp,Link2,ShareIcon  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import useGetPostById from "@/hooks/useGetPostById"
import { Id } from "../../../../convex/_generated/dataModel"
import { formatDate } from "@/lib/utils"
import {getUserById} from "@/lib/convex"
import { useEffect, useState } from "react"
import { User } from "@/lib/types"
import useInteractWithPost  from "@/hooks/useInteractWithPost"
import Lodear from "@/components/Loader/loader"
import { CommentSection } from "@/components/CommentSection/Comments"
import { useAppSelector } from "@/hooks"

const relatedArticles = [
  {
    id: "2",
    title: "Machine Learning Algorithms Detect Misinformation Faster Than Ever",
    category: "Technology",
    date: "March 14, 2025",
    readTime: "5 min read",
  },
  {
    id: "3",
    title: "The Ethics of Automated Journalism: A Deep Dive",
    category: "Opinion",
    date: "March 12, 2025",
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "How Newsrooms Are Training Journalists to Work with AI",
    category: "Industry",
    date: "March 10, 2025",
    readTime: "7 min read",
  },
]

interface PageProps {
  params: {
    id: string;
  };
}
export default function NewsArticlePage({ params }: PageProps) {
        const { id } = params
          const { data: article } = useGetPostById(id as Id<"posts">);
          const [Author, setAuthor] = useState<User|null>(null);
                const { likePost, disLikePost } = useInteractWithPost();
                const user = useAppSelector((state)=>state.user.user)
               

          useEffect(()=>{
                async function fetchAuthor(){
                        const response = await getUserById(article?.authorId as Id<"users">);
                        setAuthor(response.user);
                }
                fetchAuthor();
          },[article])

          const handleLike = async () => {
                if (!article) return;
                const response = await likePost(article._id, user?.User_id as Id<"users">);
                console.log("Like Response:", response);
                // Optionally update local state or refetch article data here
          }
          const handleDisLike = async () => {
                if (!article) return;
                const response = await disLikePost(article._id, user?.User_id as Id<"users">);
                console.log("Like Response:", response);
                // Optionally update local state or refetch article data here
          }
           if(!article) return <div className="flex justify-center items-center h-screen">
                <Lodear/>
           </div>
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 rounded-2xl transition-colors duration-200 hover:bg-primary/10 hover:border-primary hover:text-primary hover:cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" 
                className="gap-2 bg-transparent rounded-2xl transition-colors duration-200
                 hover:bg-blue/10 hover:border-blue hover:text-blue hover:cursor-pointer">
              <Bookmark className="h-5 w-5" />
                  Save
            </Button>
              <Button variant="outline" size="sm" 
                className="gap-2 bg-transparent rounded-2xl transition-colors duration-200
                 hover:bg-blue/10 hover:border-blue hover:text-blue hover:cursor-pointer">
              <Share2 className="h-5 w-5" />
                  Share
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category & Metadata */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{article?.category}</span>
          <span>{formatDate(article?._creationTime||0)}</span>
          <span>•</span>
          <span className="flex items-center gap-4  hover:cursor-pointer" ><ThumbsUp className="flex  " color="blue" onClick={()=>{handleLike()}} /> {article?.upvotes}</span>
          <span>•</span>
          <span className="flex items-center gap-4 hover:cursor-pointer" >{article?.downvotes}<ThumbsDown className="flex" color="red" onClick={()=>{handleDisLike()}} /> </span>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {article?.title}
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-pretty text-xl leading-relaxed text-muted-foreground sm:text-2xl">{article?.excerpt}</p>

        {/* Author Info */}
        <div className="mb-8 flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={Author?.profilePicture || "/placeholder.svg"} alt={""} />
            <AvatarFallback>
              {Author?.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{Author?.username}</p>
            {/* <p className="text-sm text-muted-foreground">{Author.}</p> */}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Featured Image */}
        <div className="mb-12 overflow-hidden rounded-lg">
          <img src={article?.postImage || "/placeholder.svg"} alt={article?.title} className="h-auto w-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
            <p  className="mb-6 text-pretty leading-relaxed text-foreground">
              {article?.content}
            </p>
        </div>

        <Separator className="my-12" />

        <CommentSection postId={article?._id} userId={user?.User_id as Id<"users">} />

        {/* Share Section */}
        <div className="mb-12">
          <h3 className="mb-4 text-lg font-semibold text-blue">Share this article</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" 
                className="gap-2 bg-transparent rounded-2xl transition-colors duration-200
                 hover:bg-blue/10 hover:border-blue hover:text-blue hover:cursor-pointer">
              <ShareIcon />  
                  Share
            </Button>
           
          </div>
        </div>

      </article>

      {/* Related Articles */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-serif text-3xl font-bold text-foreground">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/news/${related.id}`}
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">
                    {related.category}
                  </span>
                  <span>{related.date}</span>
                </div>
                <h3 className="mb-2 text-balance font-semibold leading-snug text-foreground group-hover:text-primary">
                  {related.title}
                </h3>
                <p className="text-sm text-muted-foreground">{related.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  )
}
