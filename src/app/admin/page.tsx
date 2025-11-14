"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"
import useGetAllPosts from "@/hooks/useGetAllPosts"
import {  formatDate } from "@/lib/utils"
import { getUserById } from "@/lib/convex"
import { PostWithAuthor } from "@/lib/types"
import { deletePost } from "@/lib/convex"
import { Id } from "../../../convex/_generated/dataModel"
import { useNotification } from "../NotificationContext"

const PostList=() =>{
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const {data:posts} = useGetAllPosts();
  const [PostaWithAuthors, setPostsWithAuthors] = useState<PostWithAuthor[]>([]);
  const {setNotification} = useNotification();

  useEffect(() => {
    if (posts) {
      const fetchAuthors = async () => {
        const postsWithAuthors = await Promise.all(
          posts.map(async (post) => {
            const authorResult = await getUserById(post.authorId);
            return { ...post, author: authorResult.user ?? null };
          })
        );
        setPostsWithAuthors(postsWithAuthors);
      };
      fetchAuthors();
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



  const filteredNews = PostaWithAuthors?.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) {
    return (
      <div className="flex animate-pulse items-center justify-center h-screen">
        <div className="animate-spin  rounded-full h-12 w-12 border-b-2 border-blue"></div>
        loading...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className=" flex flex-col border mt-2 mx-3 p-3 rounded-2xl bg-blue/5" >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:ml-[15%]">News & Articles</h1>
          <p className="text-muted-foreground">Manage your posts and articles</p>
        </div>
        <Button asChild className="bg-blue hover:bg-red rounded-2xl" >
          <Link href="/admin/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2 justify-between">
        <div className="relative w-full     ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-8  w-full  rounded-2xl "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        
          />
        </div>

      </div>
      </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 ">
          {filteredNews?.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No articles found.</p>
            </div>
          ) : (
            filteredNews?.map((item) => (
              
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                        <Link key={item._id} href={`/admin/edit/${item._id}`} className="block">
                  {item.postImage && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={item.postImage || "/placeholder.svg"}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  </Link>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(item._creationTime||0)}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="line-clamp-3 text-sm text-muted-foreground">{item.excerpt}</p>
                  </CardContent>
                  <CardFooter className=" flex justify-between p-4 pt-0">
                    <p className="text-sm font-medium">By {item.author?.username}</p>
                    <Trash2 className="hover:cursor-pointer text-2xl text-red-600 font-bold hover:scale-125 transition duration-300 " aria-label="delete this post"  onClick={handleDelete(item._id)} />
                  </CardFooter>
                </Card>
              
            ))
          )}
        </div>
      
    </div>
  )
}
export default PostList