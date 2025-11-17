"use client"
import { ArrowRight } from "lucide-react"
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
import { Clock } from "lucide-react"

const newsItems = [
  {
    title: "Senate Passes Landmark Infrastructure Bill",
    time: "2 hours ago",
    category: "Politics",
  },
  {
    title: "Tech Giants Announce Joint Sustainability Initiative",
    time: "4 hours ago",
    category: "Technology",
  },
  {
    title: "Olympic Committee Reveals 2028 Games Schedule",
    time: "5 hours ago",
    category: "Sports",
  },
  {
    title: "New Study Links Diet to Mental Health Outcomes",
    time: "7 hours ago",
    category: "Health",
  },
  {
    title: "Central Bank Announces Interest Rate Decision",
    time: "9 hours ago",
    category: "Business",
  },
  {
    title: "Archaeological Discovery Rewrites Ancient History",
    time: "11 hours ago",
    category: "Science",
  },
]

export function LatestNews() {
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
        if(!posts) return <div className=" items-center h-screen" >
                <Loader/>
        </div>
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-12">Other Updates</h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {PostsWithAuthors.map((item, index) => (
            <a
              key={index}
              href={`/news/${item._id}`}
              className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border-l-2 border-transparent hover:border-secondary"
            >
              <div>
                <Image
                  src={item.postImage||"/placeholder.svg"}
                  alt={item.title}
                  width={100}
                  height={50}
                  className="w-24 h-12 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 flex flex-col md:flex-row md:justify-between">
                <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary">{item.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(item._creationTime||0)}</span>
                  </span>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground group-hover:text-secondary transition-colors leading-tight">
                  {item.title}
                </h3>
              </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
