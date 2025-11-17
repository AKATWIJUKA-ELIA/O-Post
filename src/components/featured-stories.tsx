"use client"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import useGetAllPosts from "@/hooks/useGetAllPosts"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import Loader from "./Loader/loader"
import { getUserById } from "@/lib/convex"
import { useEffect, useState } from "react"
import { PostWithAuthor, User } from "@/lib/types"
import { Id } from "../../convex/_generated/dataModel"
import { truncateString } from "@/lib/utils"



export function FeaturedStories() {
        const { data:posts, } = useGetAllPosts();
                        const mainPost = posts && posts.length > 0 ? posts[0] : null;
                        const [Author, setAuthor] = useState<User|null>(null);
                          const [PostsWithAuthors, setPostsWithAuthors] = useState<PostWithAuthor[]>([]);
        
          useEffect(() => {
            if (posts) {
                 setPostsWithAuthors(posts);
            }
          }, [posts]);
                
                        useEffect(()=>{
                                async function fetchAuthor(){
                                        const response = await getUserById(mainPost?.authorId as Id<"users">);
                                        setAuthor(response.user);
                                }
                                fetchAuthor();
                          },[mainPost])

                if(!posts) return 
                <div className=" items-center " >
                        <Loader/>
                </div>
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Featured Stories</h2>
          {/* <a
            href="#"
            className="hidden sm:inline-flex items-center space-x-2 text-sm font-medium text-secondary hover:text-foreground transition-colors group"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a> */}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PostsWithAuthors.slice(4,).map((story, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-4">
                <Link href={`/news/${story._id}`} >
                <Image
                  src={story.postImage || "/placeholder.svg"}
                  alt={story.title}
                        width={400}
                        height={250}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                </Link>
              </div>
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">{story.category}</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground group-hover:text-secondary transition-colors leading-tight text-balance">
                  {story.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{truncateString(story.excerpt, 100)}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{story.author?.username}</span>
                  <span>•</span>
                  <time>{formatDate(story._creationTime||0)}</time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
