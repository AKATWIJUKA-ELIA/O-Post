"use client";
import { AppSidebar } from "@/adminComponents/app-sidebar";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";


export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
         
  return (
    <div className="flex flex-col h-screen backdrop-blur-2xl">
        
        <SidebarProvider >
        <AppSidebar   />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 border-b bg-background">
                <div className="container mx-auto px-4 py-4 bg-blue ">
                  <h1 className="text-4xl font-bold text-white "> O-Post Admin </h1>
                  <p className="text-sm text-gray-500">Manage your news posts</p>
                </div>
              </header>
        <SidebarTrigger className="absolute z-50 bg-dark rounded-full p-3 bg-blue border-2 hover:cursor-pointer border-red text-white dark:bg-blue-800  top-[13%] " />
        {children}
      </main>
      </SidebarProvider>
    </div>
  );}