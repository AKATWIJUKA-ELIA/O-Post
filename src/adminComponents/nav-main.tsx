"use client"

import {type LucideIcon } from "lucide-react"
import {LayoutDashboardIcon,HomeIcon,SquarePlus,Rows4,
        // Users,HandCoins,SquareStack,User
        Newspaper,

} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { MdOutlinePending } from "react-icons/md";

export function NavMain() {
        const items = [
                {
                        title: "Home",
                        icon: HomeIcon as LucideIcon,
                        link:"/admin",
                },
                
              {
                        title: "Create Post",
                        icon: SquarePlus   as LucideIcon,
                        link:"/admin/create",
                },
                {
                        title: "All Posts",
                        icon: Rows4 as LucideIcon,
                        link:"/admin/posts",
                },
                 
                {
                        title: "News Letter",
                        icon: Newspaper    as LucideIcon,
                        link:"/admin/newsletter",
                },
                {
                        title: "Scheduled Posts",
                        icon: MdOutlinePending   as unknown as LucideIcon,
                        link:"/admin/pending",}
                
                
        ]
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 mt-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 p-2 rounded-2xl bg-blue hover:bg-blue/90">
            <SidebarMenuButton
              tooltip="Dashboard"
              className="min-w-8  text-primary-foreground duration-200 ease-linear  hover:bg-transparent hover:text-white hover:cursor-pointer "
            >
              <LayoutDashboardIcon />
              <span>Dashboard</span>
            </SidebarMenuButton>
          
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="font-semibold gap-2">
          {items.map((item) => (
                 <Link key={item.title} href={item.link} className="w-full  ">
            <SidebarMenuItem  className="flex items-center gap-2 p-2  rounded-2xl hover:bg-gray-300/70 transition-colors duration-500 hover:cursor-pointer " >
                <SidebarMenuButton tooltip={item.title} className="gap-4 w-full h-full bg-transparent hover:bg-transparent hover:cursor-pointer " >
                {item.icon && <item.icon className="text-gray-500 " />}
                <span className="text-blue " >{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
