import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { Post,DwonloadPost } from "@/lib/types";
import { Id } from "../../convex/_generated/dataModel";

export const useUpdatePost = () => {
        const update = useMutation(api.posts.UpdatePost);
        const UpdatePost = async (Post:DwonloadPost) =>{
                try{
                const response = await update({ 
                        post: {
                                _id: Post._id as Id<"posts">,
                                title: Post.title,
                                authorId: Post.authorId,
                                content: Post.content,
                                category: Post.category,
                                excerpt: Post.excerpt,
                                postImage: Post.postImage||"",
                        }
                });
                        if(!response?.success){
                                return { success: false, message: response.message , status: 400 };
                        }
                        return { success: true, message:response.message ,  status: 200 };
                }catch{
                        return  { success: false, message: "Sorry,  Can not update at this time please try again later" , status: 500 };
                }
        }
        return { UpdatePost };
 }