"use client"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import useGetAllPosts from "@/hooks/useGetAllPosts"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
const news = [
        {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders commit to unprecedented carbon reduction targets in landmark deal that could reshape the future of environmental policy.",
        author: "Sarah Mitchell",
        date: "March 15, 2025",
        image: "/climate-summit-leaders.png"
        },
        {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders commit to unprecedented carbon reduction targets in landmark deal that could reshape the future of environmental policy.",
        author: "Sarah Mitchell",
        date: "March 15, 2025",
        image: "/climate-summit-leaders.png"
        },
        {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders commit to unprecedented carbon reduction targets in landmark deal that could reshape the future of environmental policy.",
        author: "Sarah Mitchell",
        date: "March 15, 2025",
        image: "/climate-summit-leaders.png"
        },
        {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders commit to unprecedented carbon reduction targets in landmark deal that could reshape the future of environmental policy.",
        author: "Sarah Mitchell",
        date: "March 15, 2025",
        image: "/climate-summit-leaders.png"
        }
]
export function HeroSection() {
        const { data:posts, loading, } = useGetAllPosts();
        const mainPost = posts && posts.length > 0 ? posts[0] : null;
  return (
    <section className="relative bg-neutral-200 text-accent-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 ">
          {/* Left Content */}
          <div className="flex flex-col p-2 group  " >
                <div className="relative  rounded-lg overflow-hidden">
                <Badge variant="secondary" className=" absolute z-50 md:z-30 top-4 left-4 group-hover:top-4 group-hover:left-4 bg-red text-white font-bold  px-3 py-1 rounded-lg transition-all">
              Breaking News
            </Badge>
            <Image src={mainPost?.postImage??""} width={500} height={300} alt="Climate Summit" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
            <h1 className="absolute z-30 bottom-6 bg-black/50 font-serif text-2xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance group-hover:bottom-8 transition-all duration-300">
             {mainPost?.title}
            </h1>

          </div>

          <div className="space-y-6">
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
              {mainPost?.excerpt}
            </p>
            <div className="flex items-center space-x-4 text-sm text-foreground/70">
              <span>By Sarah Mitchell</span>
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
          <div className="grid md:grid-cols-2 gap-4 p-3 bg-accent/30" >
{posts?.map((item, idx) => (
  <Link href={`/news/${item._id}`} key={idx} className="flex relative rounded-lg overflow-hidden group ">
    <img src={item.postImage||""} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
    <h1 className="absolute z-30 bottom-1 group-hover:bottom-3 transition-all duration-300 p-2 bg-black/50 font-serif text-2xl font-bold leading-tight text-balance">
      {item.title}
    </h1>
  </Link >
))}
          </div>
        </div>
      </div>
    </section>
  )
}
