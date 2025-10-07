"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, MapPin, Calendar, Bookmark, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/hooks/useUser"
import type { Id } from "../../../convex/_generated/dataModel"
import type { UserProfile } from "@/lib/types"
import { getUserById } from "@/lib/convex"
import { User } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>()
        const [profile, setprofile] = useState<User|null>(null);

 
  useEffect(()=>{(async()=>{
          const{success,session}=await useUser();
          if(success&&session){
                  setUser({
                          userId:session.userId as Id<"users">,
                          role:session.role as string,
                          isVerified:session.isVerified as boolean,
                          expiresAt:session.expiresAt as Date,});
                          return;
                        }
                        setUser(null);
                })();
        },[]);

         useEffect(()=>{
                async function fetchAuthor(){
                                                                const response = await getUserById(user?.userId as Id<"users">);
                                                                setprofile(response.user);
                                                        }
                                                        fetchAuthor();
                                                  },[user?.userId])

  // Mock user data - replace with real data from your backend
  const userData = {
    name: "Sarah Mitchell",
    username: "@sarahmitchell",
    email: "sarah.mitchell@example.com",
    bio: "Journalist passionate about technology, politics, and social impact. Contributing to meaningful conversations through thoughtful reporting and analysis.",
    location: "New York, NY",
    joinedDate: "January 2024",
    avatar: "/professional-journalist-woman.jpg",
    stats: {
      articles: 24,
      comments: 156,
      saved: 89,
    },
  }

  const recentActivity = [
    {
      id: 1,
      type: "comment",
      title: "The Future of AI in Journalism",
      date: "2 hours ago",
      excerpt: "Great insights on how AI is transforming newsrooms...",
    },
    {
      id: 2,
      type: "saved",
      title: "Climate Change: A Global Perspective",
      date: "1 day ago",
    },
    {
      id: 3,
      type: "comment",
      title: "Breaking: Tech Industry Layoffs Continue",
      date: "3 days ago",
      excerpt: "This is concerning for the industry as a whole...",
    },
  ]

  const savedArticles = [
    {
      id: 1,
      title: "The Rise of Renewable Energy",
      category: "Science",
      date: "Mar 15, 2024",
      image: "/renewable-energy-solar-panels.png",
    },
    {
      id: 2,
      title: "Global Markets React to Economic Shifts",
      category: "Business",
      date: "Mar 12, 2024",
      image: "/stock-market-trading-floor.png",
    },
    {
      id: 3,
      title: "Innovations in Healthcare Technology",
      category: "Health",
      date: "Mar 10, 2024",
      image: "/medical-technology-healthcare.jpg",
    },
  ]



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={profile?.username} />
              <AvatarFallback className="text-8xl  font-serif font-bold items-center-safe">{profile?.username.slice(0,1)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-2">
                    {profile?.username || "User"}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">{profile?.username}</p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      <span className="break-all">{profile?.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(profile?._creationTime||0)}</span>
                    </div>
                  </div>
                </div>
                <Link href="/profile/settings">
                  <Button variant="outline" className="w-full sm:w-auto gap-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-foreground leading-relaxed max-w-3xl">
                {userData.bio}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <Card className="p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground">
                {userData.stats.articles}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Articles Read</div>
            </Card>
            <Card className="p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground">
                {userData.stats.comments}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Comments</div>
            </Card>
            <Card className="p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground">
                {userData.stats.saved}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Saved</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-6 sm:mb-8">Recent Activity</h2>
            <div className="space-y-4 sm:space-y-6">
              {recentActivity.map((activity) => (
                <Card key={activity.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1">
                      {activity.type === "comment" ? (
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground text-base sm:text-lg break-words">
                          {activity.type === "comment" ? "Commented on" : "Saved"}: {activity.title}
                        </h3>
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                          {activity.date}
                        </span>
                      </div>
                      {activity.excerpt && (
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{activity.excerpt}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Saved Articles */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-6 sm:mb-8">Saved Articles</h2>
            <div className="space-y-4 sm:space-y-6">
              {savedArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <h3 className="font-serif font-semibold text-foreground text-base sm:text-lg leading-snug">
                      {article.title}
                    </h3>
                  </div>
                </Card>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Saved Articles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
