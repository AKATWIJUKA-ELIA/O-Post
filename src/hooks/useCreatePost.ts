import { NextResponse } from "next/server";
import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { Post } from "@/lib/types";
const useCreatePost = () => {
        const create = useMutation(api.posts.CreatePost);

        const CreatePost = async (Post:Post) =>{
                try{
                const response = await create({
                        title: Post.title,
                        authorId: Post.authorId,
                        content: Post.content,
                        category: Post.category,
                        excerpt: Post.excerpt,
                        postImage: Post.postImage||"",
                        upvotes: 0,
                        downvotes: 0,
                });
                 if(!response?.success){
                        return NextResponse.json({ success: false, message: response.message }, { status: 400 });
                }
                return NextResponse.json({ success: true, message:response.message }, { status: 200 });
                }catch{
                        return NextResponse.json( { success: false, message: "Sorry,  Can not upload at this time please try again later" });
                        
                }
        }
        return { CreatePost };
 }
 export default useCreatePost;