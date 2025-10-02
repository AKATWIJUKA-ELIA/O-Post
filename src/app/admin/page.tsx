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

type Post = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  imageUrl: string
  publishedAt: string
  status: "draft" | "published"
}

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

  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    excerpt: "",
    content: "",
    category: "Politics",
    author: "",
    imageUrl: "",
    status: "draft",
  })

  const handleInputChange = (field: keyof Post, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSavePost = () => {
    if (editingPost) {
      // Update existing post
      setPosts(posts.map((post) => (post.id === editingPost.id ? ({ ...post, ...formData } as Post) : post)))
      setEditingPost(null)
    } else {
      // Create new post
      const newPost: Post = {
        id: Date.now().toString(),
        title: formData.title || "",
        excerpt: formData.excerpt || "",
        content: formData.content || "",
        category: formData.category || "Politics",
        author: formData.author || "",
        imageUrl: formData.imageUrl || "/news-collage.png",
        publishedAt: new Date().toISOString().split("T")[0],
        status: formData.status || "draft",
      }
      setPosts([newPost, ...posts])
      setIsCreating(false)
    }

    // Reset form
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Politics",
      author: "",
      imageUrl: "",
      status: "draft",
    })
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setFormData(post)
    setIsCreating(false)
  }

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  const handleCancelEdit = () => {
    setEditingPost(null)
    setIsCreating(false)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Politics",
      author: "",
      imageUrl: "",
      status: "draft",
    })
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setEditingPost(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Politics",
      author: "",
      imageUrl: "",
      status: "draft",
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 bg-blue ">
          <h1 className="text-4xl font-bold text-white "> O-Post Admin </h1>
          <p className="text-sm text-gray-500">Manage your news posts</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">All Posts</TabsTrigger>
            <TabsTrigger value="editor">{editingPost ? "Edit Post" : isCreating ? "New Post" : "Editor"}</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
              <Button onClick={handleCreateNew}>
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
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditPost(post)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <Card>
              <CardHeader>
                <CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
                <CardDescription>
                  {editingPost ? "Update the post details below" : "Fill in the details to create a new post"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the post"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Full post content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={10}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Politics">Politics</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Culture">Culture</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSavePost} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
