import { NextResponse } from "next/server";
import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { Post } from "@/lib/types";
import { useSendMail } from "./useSendMail";
import { NewPostPublishedEmail } from "@/EmailTemplates/NewPostPublished";
import { getSubscribers } from "@/lib/convex";

const useCreatePost = () => {
        const create = useMutation(api.posts.CreatePost);
        const { sendEmail } = useSendMail();

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
                const subscribers = await getSubscribers();
                if(subscribers.subscribers){
                const origin = (typeof window !== "undefined" && window.location?.origin) ? window.location.origin : "";
                const postUrl = response?.post ? `https://o-post.vercel.app/news/${response.post}` : "#";
                for(const subscriber of subscribers?.subscribers){
                        await sendEmail(
                                subscriber.email,
                                `New Post Published: ${Post.title}`,
                                NewPostPublishedEmail(Post, {
                                        siteName: "O-Post",
                                        postUrl,
                                        logoUrl: "https://expert-goldfish-40.convex.cloud/api/storage/01ad3265-711a-45ef-8c61-5c92a3d8cb9c",
                                })
                        );}
                }                
                return NextResponse.json({ success: true, message:response.message }, { status: 200 });
                }catch{
                        return NextResponse.json( { success: false, message: "Sorry,  Can not upload at this time please try again later" });
                        
                }
        }
        return { CreatePost };
 }
 export default useCreatePost;