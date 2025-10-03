"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import { Post } from "@/lib/types"
import useGetAllPosts from "@/hooks/useGetAllPosts"

export default function AdminPage() {
        const { data:posts } = useGetAllPosts();

  return (
    <div className="min-h-screen bg-muted/30">

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">All Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Posts ({posts?.length})</h2>
              <Button >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </div>

            <div className="grid gap-4">
              {posts?.map((post) => (
                <Card key={post._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription className="mt-1">
                          By {post.authorId} • {post._creationTime.toLocaleString()}
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
