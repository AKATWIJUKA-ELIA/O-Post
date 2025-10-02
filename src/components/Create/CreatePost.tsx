"use client"
import { Textarea } from '@/adminComponents/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Save } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Post } from '@/lib/types'
import { useRef } from 'react'

const CreatePost = () => {
          const [isCreating, setIsCreating] = useState(false)
          const [imagePreview, setImagePreview] = useState<string>("");
          const [editingPost, setEditingPost] = useState<Post | null>(null);
          const [selectedImage, setSelectedImage] = useState<File|null>(null);
           const fileInputRef = useRef<HTMLInputElement>(null);
          const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    excerpt: "",
    content: "",
    category: "Politics",
    author: "",
    imageUrl: "",
    status: "draft",
  })
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

  const categories = ["Politics", "Technology", "Business", "Culture", "Science", "Sports"]

    const handleInputChange = (field: keyof Post, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
   const cleanImageField=()=>{
                        setSelectedImage(null);
                        setImagePreview("")
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                }
          const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) {
                      const file = e.target.files[0];
                      const maxFileSize = 3 * 1024 * 1024; // 1MB in bytes
                       if (!file.type.startsWith("image/")) {
                                alert(`"${file.name}" is not a valid image file.`);
                                cleanImageField();
                                return; 
                              }

                              if (file.size > maxFileSize) {
                                alert(`"${file.name}" is too large. Maximum allowed size is 3MB.`);
                                cleanImageField()
                              } else {
                                setSelectedImage(file);
                              }
                    // Create preview URLs for the selected images
                    const previewUrl = URL.createObjectURL(file)
                    setImagePreview(previewUrl)
                  }
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

  return (
      <div>
                <Card>
              <CardHeader>
                <CardTitle className='text-red' >Create New Post</CardTitle>
                <CardDescription>
                  Fill in the details to create a new post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className='text-blue' >Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className='rounded-xl'
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt" className='text-blue'>Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the post"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    rows={2}
                    className='rounded-xl'
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className='text-blue'>Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Full post content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={10}
                    className='rounded-xl'
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category" className='text-blue'>Category</Label>
                    <select   value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)} className=' border rounded-xl p-3 w-full'>
                      {categories.map((cat)=>(
                        <option id="category"  value={cat} className=' border rounded-xl p-2 '>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-  y-2">
                  <Label htmlFor="author" className='text-blue'>Author</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                        className='rounded-xl'
                  />
                </div>

                <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-white">
            Attach an Image
          </label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          { imagePreview.length > 0 && (
              <div className="">
                <div className="flex flex-wrap gap-2">
                  
                    <div  className="relative">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview "
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                </div>
              
              </div>
            )}
        </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSavePost} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
  )
}

export default CreatePost