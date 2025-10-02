"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit2, Trash2, Save } from "lucide-react"
import { Post } from "@/lib/types"

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Breaking: Major Economic Reform Announced",
      excerpt: "Government unveils comprehensive plan to reshape financial sector",
      content: "Full article content here...",
      category: "Politics",
      author: "Sarah Johnson",
      imageUrl: "/economic-reform.jpg",
      publishedAt: "2024-01-15",
      status: "published",
    },
    {
      id: "2",
      title: "Tech Giants Face New Regulations",
      excerpt: "New legislation targets data privacy and market competition",
      content: "Full article content here...",
      category: "Technology",
      author: "Michael Chen",
      imageUrl: "/technology-regulation.jpg",
      publishedAt: "2024-01-14",
      status: "published",
    },
  ])


  return (
    <div className="min-h-screen bg-muted/30">

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">All Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
              <Button >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </div>

            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription className="mt-1">
                          By {post.author} • {post.publishedAt}
                        </CardDescription>
                      </div>
                      {/* <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditPost(post)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div> */}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
