"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail,  Calendar, Bookmark, MessageSquare, Settings,LayoutDashboardIcon, PenBoxIcon } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/hooks/useUser"
import type { Id } from "../../../convex/_generated/dataModel"
import type { UserProfile } from "@/lib/types"
import { getUserById } from "@/lib/convex"
import { User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { useNotification } from "../NotificationContext"
import { useUpdateUser } from "@/hooks/useUpdateUser"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>()
        const [profile, setprofile] = useState<User|null>(null);
        const [profilepreview, setprofilepreview] = useState<string|null>(null);
        const [profileUpload, setprofileUpload] = useState<File|null>(null);
        const [username, setusername] = useState<string|null>(null);
        const [editUserName, setEditUserName] = useState<boolean>(false);
        const {setNotification} = useNotification();
        const {UpdateUser} = useUpdateUser();
        const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);
          const generateUploadUrl = useMutation(api.posts.generateUploadUrl);

          const handleUpload = async (file:File|null) => {
        if(!file) {
                setNotification({
                        status: 'info',
                        message: 'No file selected for upload.',
                })
                return
         };
          const uploadUrl = await generateUploadUrl();
                        const res = await fetch(uploadUrl,
                        {
                                method:"post",
                                headers:{"Content-Type": file.type },
                                body: file
                        }
                )
                if(!res.ok){
                        throw new Error("Upload failed, Are you connected to the internet?");
                }
                const { storageId } = await res.json();
                        return storageId;

}
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
        


          const handleImageChange = () => {
        const fileInput = document.createElement("input")
        fileInput.type = "file"
        fileInput.accept = "image/*"
        fileInput.onchange = () => {
          const file = fileInput.files ? fileInput.files[0] : null
                if (!file) {
                        setNotification({
                                status: 'info',
                                message: 'No file selected.',
                        })
                }

                if (file && file.size <= 3 * 1024 * 1024) {
                                setprofilepreview(URL.createObjectURL(file))
                                setprofileUpload(file)
                                return
                        
                
                }
                else {
                        setNotification({
                                status: 'error',
                                message: `File ${file?.name} size exceeds 3MB limit.`,
                        })
                }
        }
          fileInput.click();
} 
const handleCancel=()=>{
        setEditUserName(false);
        setusername(null);
        setprofilepreview(null);
        setprofileUpload(null);
}
        const handleUpdateProfile=async()=>{
                setUpdatingProfile(true);
                if(!profile){
                        setNotification({
                                status: 'error',
                                message: 'User profile not found.',
                        })
                        return;
                }
                const storageId = profileUpload ? await handleUpload(profileUpload) : null;
                const response = await UpdateUser({
                        id: profile._id as Id<"users">,
                        username: username || profile.username||"",
                        profileImage: storageId
                });
                if (!response.success) {
                        setNotification({
                                status: 'error',
                                message: response.message||'Failed to update profile.',
                        });
                        return;
                }
                setNotification({
                        status: 'success',
                        message: 'Profile updated successfully.',
                });
                setEditUserName(false);
                setusername(null);
                setprofilepreview(null);
                setprofileUpload(null);
        };

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
      saved: 0,
    },
  }



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <Avatar className="relative h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profilepreview || profile?.profilePicture || "/placeholder.svg"} alt={profile?.username} />
              <AvatarFallback className="text-8xl  font-serif font-bold items-center-safe">{profile?.username && profile?.username.slice(0,1)}</AvatarFallback>
              <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center
               bg-blue/40 hover:bg-blue/50 rounded-full p-2 border-2 border-background
                hover:cursor-pointer"
                onClick={()=>handleImageChange()}
                >
              <PenBoxIcon className="hover:cursor-pointer text-gray-400"   />
              </div>
            </Avatar>
            <div className="flex-1 w-full ">    
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className=" flex items-center gap-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-2">
                    {profile?.username || "User"} <PenBoxIcon className="hover:cursor-pointer" onClick={()=>setEditUserName(true)}  />
                  </h1>

                  { editUserName && <div className="flex  " >
                        <Label htmlFor="username" className="mr-2" >New Username:</Label>
                        <input type="text" 
                        name="username" 
                        id="username" 
                        onChange={(e)=>setusername(e.target.value)}
                        value={username||""}
                        placeholder={profile?.username||"Username"}
                  className="border flex border-border rounded-3xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                  />
                        <Button className="ml-2 rounded-2xl bg-red" onClick={()=>handleCancel()} >Cancel</Button>
                  </div>}

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
                  {(editUserName || !!profilepreview) && (
                    <Button className="ml-2 mt-5 rounded-2xl bg-blue" onClick={() => handleUpdateProfile()}>
                      {updatingProfile ? "Updating..." : "Update"}
                    </Button>
                  )}
                </div>
                {user?.role==="admin"?(
                        <Link href="/admin" className="hover:cursor-pointer">
                  <Button variant="outline" className="w-full sm:w-auto gap-2 hover:cursor-pointer rounded-2xl bg-transparent">
                    <LayoutDashboardIcon className="h-4 w-4" />
                    DashBoard
                  </Button>
                </Link>
                ):(
                <div className="w-full sm:w-auto" ></div>
                )}
              </div>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-foreground leading-relaxed max-w-3xl">
                {/* {userData.bio} */}
              </p>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
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
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Recent Activity */}
          {/* <div className="lg:col-span-2">
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
          </div> */}

          {/* Saved Articles */}
          {/* <div>
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
          </div> */}
        </div>
      </div>
    </div>
  )
}
