"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Send } from "lucide-react"
import useInteractWithPost from "@/hooks/useInteractWithPost"
import { Id } from "../../../convex/_generated/dataModel"
import useGetPostComments from "@/hooks/useGetPostComments"
import { useNotification } from "@/app/NotificationContext"
import {getUserById} from "@/lib/convex"
import { User,CommentWithCommentor } from "@/lib/types"
import { formatDate } from "@/lib/utils"


interface CommentSectionProps {
  postId: string
  userId: Id<"users">
}


export function CommentSection({ postId,userId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { commentOnPost } = useInteractWithPost();
        const [Author, setAuthor] = useState<User|null>(null);
        const {data:comments} = useGetPostComments(postId as Id<"posts">);
        const [commentsWithCommentors, setCommentsWithCommentors] = useState<CommentWithCommentor[]>([]);
        useEffect(() => {
  const fetchComments = async () => {
    const enrichedComments = await Promise.all(
      comments?.map(async (comment) => {
        const res = await getUserById(comment.commentorId);
        return {
          ...comment,
          commentor: res.user,
        };
      }) || []
    );
    setCommentsWithCommentors(enrichedComments);
  };
  fetchComments();
}, [comments]);
        const { setNotification } = useNotification();

useEffect(()=>{
                async function fetchAuthor(){
                        const response = await getUserById(userId);
                        setAuthor(response.user);
                }
                fetchAuthor();
          },[userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      setIsSubmitting(true)
    if (!newComment.trim()) return
    if(!userId){
        setNotification({status:"info",message:"Please login to comment"})
        setIsSubmitting(false)
        return;
    }
    await commentOnPost(postId as Id<"posts"> , userId, newComment).then((response)=>{
        if(response.success){
                setNotification({status:"success",message:"Comment added successfully"})
                setNewComment("")
                setIsSubmitting(false)
                return;
        }
        setNotification({status:"error",message:"Error adding comment"})
        setNewComment("")
        setIsSubmitting(false)
    })
  
  }
    // Simulate API call
 



  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-8 font-serif text-3xl font-bold text-foreground">Comments ({commentsWithCommentors?.length})</h2>

      {/* Comment Form */}
      <div className="mb-12 rounded-lg border border-border bg-card p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/abstract-geometric-shapes.png" alt="Your avatar" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim() || isSubmitting} className="gap-2">
              <Send className="h-4 w-4" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {commentsWithCommentors?.map((comment, index) => (
          <div key={comment._id}>
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.commentor?.profilePicture || "/placeholder.svg"} alt={Author?.username} />
                <AvatarFallback>
                  {comment.commentor?.username.slice(0,2)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-semibold text-foreground">{comment.commentor?.username}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{formatDate(comment.commentor?._creationTime||0)}</span>
                </div>
                <p className="mb-3 text-pretty leading-relaxed text-foreground">{comment.content}</p>
                <div className="flex items-center gap-4">
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => handleLike(comment.id)}
                  >
                    <Heart className={`h-4 w-4 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span className={comment.isLiked ? "text-red-500" : ""}>{comment.likes}</span>
                  </Button> */}
                  {/* <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <MessageCircle className="h-4 w-4" />
                    Reply
                  </Button> */}
                </div>
              </div>
            </div>
            {index < commentsWithCommentors.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>

      {comments?.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}
