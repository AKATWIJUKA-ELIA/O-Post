"use client";
import { AppSidebar } from "@/adminComponents/app-sidebar";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/convex";
import { useUser } from "@/hooks/useUser";
import { User, UserProfile } from "@/lib/types";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { LogOut as SignOut } from "lucide-react";
import useLogout from "@/hooks/useLogout"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
        const [user, setUser] = useState<UserProfile|null>(null);
        const [Author, setAuthor] = useState<User|null>(null);
        const { LogOut } = useLogout()
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
                               setUser(null);})();},[]);

        useEffect(()=>{
                        async function fetchAuthor(){
                                const response = await getUserById(user?.userId as Id<"users">);
                                setAuthor(response.user);
                        }
                        fetchAuthor();
                  },[user?.userId])

                    const handleLogout = async () => {
    await LogOut().then((data) => {
      if (data?.success) {
        setUser(null)
      }
    })
  }
         
  return (
    <div className="flex flex-col h-screen backdrop-blur-2xl">
        
        <SidebarProvider >
        <AppSidebar   />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 border-b bg-background">
                <div className="flex justify-between container mx-auto px-4 py-4 bg-blue ">
                  <div className="flex flex-col " >
                        <h1 className="text-4xl font-bold text-white "> O-Post Admin </h1>
                  <p className="text-sm text-gray-500">Manage your news posts</p>
                  </div>

                  <div className="flex mt-2 items-center gap-3" >
                        <Avatar className="h-10 w-10">
                                      <AvatarImage src="/abstract-geometric-shapes.png" alt="Your avatar" />
                                      <AvatarFallback>
                                        {Author?.username ? Author.username.charAt(0).toUpperCase() : "U"}
                                      </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="text-blue rounded-2xl border-white hover:bg-red hover:text-blue"
                        onClick={() => handleLogout()}
                        >
                                Log Out
                                <SignOut className="ml-2 h-4 w-4" />
                        </Button>
                  </div>
                </div>
              </header>
        <SidebarTrigger className="absolute z-50 bg-dark rounded-full p-3 bg-blue border-2 hover:cursor-pointer border-red text-white dark:bg-blue-800  top-[13%] " />
        {children}
      </main>
      </SidebarProvider>
    </div>
  );}