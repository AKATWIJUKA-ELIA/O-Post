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
import { User } from "@/lib/types"
import { Id } from "../../convex/_generated/dataModel"


export function HeroSection() {
        const { data:posts, } = useGetAllPosts();
        const mainPost = posts && posts.length > 0 ? posts[0] : null;
        const [Author, setAuthor] = useState<User|null>(null);

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
    <div className="flex relative bg-neutral-200 text-accent-foreground">
      <div className="container  px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 ">
          {/* Left Content */}
          <div className="flex flex-col p-2 group  " >
                <div className="relative  rounded-lg overflow-hidden">
                <Badge variant="secondary" className=" absolute z-30  top-4 left-4 group-hover:top-4 group-hover:left-4 bg-red text-white font-bold  px-3 py-1 rounded-lg transition-all">
              {mainPost?.category}
            </Badge>
            <Image src={mainPost?.postImage??""} width={500} height={300} alt="Climate Summit" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
            <h1 className="absolute z-30 bottom-6 bg-black/50 font-serif text-2xl md:text-3xl lg:text-3xl font-bold leading-tight text-balance group-hover:bottom-8 transition-all duration-300">
             {mainPost?.title}
            </h1>

          </div>

          <div className="space-y-6">
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
              {mainPost?.excerpt}
            </p>
            <div className="flex items-center space-x-4 text-sm text-foreground/70">
              <span>By {Author?.username}</span>
              <span>•</span>
              <time>{formatDate(mainPost?._creationTime??0)}</time>
            </div>
            <Link
              href={`/news/${mainPost?._id}`}
              className="inline-flex items-center text-blue-500 space-x-2  hover:text-black transition-colors group"
            >
              <span className="font-medium  ">Read full story</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          </div>
          
          

          {/* Right content */}
          <div className="grid md:grid-cols-2 gap-4 p-3 border rounded-2xl bg-accent/3" >
{posts?.map((item, idx) => (
  <Link href={`/news/${item._id}`} key={idx} className="flex relative h-50 rounded-lg overflow-hidden group ">
    <img src={item.postImage||""} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
    <h1 className="absolute z-30 bottom-1 group-hover:bottom-3 transition-all duration-300 p-2 bg-black/50 font-serif text-xl font-bold leading-tight text-balance">
      {item.title}
    </h1>
  </Link >
))}
          </div>
        </div>
      </div>
    </div>
  )
}
