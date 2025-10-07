"use client"
import { Textarea } from '@/adminComponents/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Save } from 'lucide-react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Post } from '@/lib/types'
import { useRef } from 'react'
import { useAppSelector } from '@/hooks'
import { useUpdatePost } from '@/hooks/useUpdatePost'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useNotification } from '@/app/NotificationContext'
import useGetPostById from '@/hooks/useGetPostById'
import { Id } from '../../../convex/_generated/dataModel'

interface props{
        id:Id<"posts">
}
const EditPost = ({id}:props) => {
        const { data,loading } = useGetPostById(id);
        const [post, setPost] = useState<Post | null>(data || null);
          const [isCreating, setIsCreating] = useState(false)
          const [imagePreview, setImagePreview] = useState<string>(post?.postImage || "");
          const [selectedImage, setSelectedImage] = useState<File|null>(null);
           const fileInputRef = useRef<HTMLInputElement>(null);
            const user = useAppSelector((state) => state.user.user);
                      const [formData, setFormData] = useState<Partial<Post>>({
    title: data?.title || "",
    excerpt: data?.excerpt || "",
    content:    data?.content || "",
    category:data?.category || "Politics",
    authorId: user?.User_id,
    postImage: "",
  })

            useEffect(() => {
        if (data) {
                setFormData({
      title: data.title || "",
      excerpt: data.excerpt || "",
        content:    data.content || "",
        category: data.category || "Politics",
        authorId: data.authorId,
        postImage: data.postImage || "",
    });
    setImagePreview(data.postImage || "");
        }
            }, [data,id,loading]);

            if(loading){
                <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
            }



  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
 const {UpdatePost} = useUpdatePost();
        const { setNotification } = useNotification();
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
        const resetForm = () => {
                    setFormData({
      title: "",
      authorId: user?.User_id,
      excerpt: "",
      content: "",
      category: "Politics",
      postImage: "",
    })
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
                                return;
                              } else {
                                setSelectedImage(file);
                              }
                    // Create preview URLs for the selected images
                    const previewUrl = URL.createObjectURL(file)
                    setImagePreview(previewUrl)
                  }
                }

    const handleSavePost = async() => {
          
        setIsCreating(true)
         const TIMEOUT_MS = 20000; 
        let imageUrl = "";

         const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
                        return Promise.race([
                          promise,
                          new Promise<T>((_, reject) =>
                            setTimeout(() => reject(new Error("Request timed out")), ms)
                          
                          ),
                        ]);
                      };
                      if (selectedImage) {
                  try {
                        await withTimeout((async () => {
                         // Step 1: Get a short-lived upload URL
                        const postUrl = await generateUploadUrl();
                        const result = await fetch(postUrl, {
                                    method: "POST",
                                    headers: { "Content-Type": selectedImage?.type ?? "application/octet-stream" },
                                    body: selectedImage,
                                  });
                                  
                                  if (!result.ok) throw new Error("Failed to upload image");
                                  const res= await result.json();
                                        imageUrl = res.storageId;

                        })(), TIMEOUT_MS);} catch {
                        alert("Image upload timed out. Please try again.");
                        setIsCreating(false)
                        return;
                        }}   
      // Update post
        const newPost = {
                _id: id,
        title: formData.title || "",
        excerpt: formData.excerpt || "",
        content: formData.content || "",
        category: formData.category || "Politics",
        authorId: user?.User_id!,
        postImage: imageUrl
      }
       const res = await UpdatePost(newPost)
        if(!res?.success){
                setNotification({ 
                        status: 'error',
                         message: res.message || "Failed to update post. Please try again." 
                        });
        } else {
        setNotification({ 
                status: 'success',
                 message: res.message || "Post updated successfully!" 
                });
        }

        console.log("Post to be updated:", newPost)
      setIsCreating(false)
    

    // Reset form
    resetForm()
    cleanImageField()

  }

  return (
      <div className='' >
                <Card className='bg-red/5' >
              <CardHeader>
                <CardTitle className='text-red' >Update Post</CardTitle>
                <CardDescription>
                  Fill in the details to Update the post
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
              <div className="mt-4 p-1 rounded-md border border-dashed border-gray-500">
                <div  className="relative bg-red/10 w-[100%] h-full  mx-auto rounded-md flex items-center justify-center border border-gray-300">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview "
                        width={100}
                        height={100}
                        className="h-20 w-full object-cover rounded-md border border-gray-300"
                      />
                    </div>
              
              </div>
            )}
        </div>

                <div className="flex gap-3 pt-4">
                  <Button  onClick={handleSavePost}
                  disabled={isCreating||!formData.title||!formData.excerpt||!formData.content}
                   className="flex mx-auto bg-blue hover:cursor-pointer hover:bg-blue-700 text-white rounded-xl" >
                    <Save className="mr-2 h-4 w-4" />
                    {isCreating?"Updating...":"Upadte Post"}
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
  )
}

export default EditPost