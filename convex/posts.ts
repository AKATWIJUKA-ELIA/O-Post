import {  v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreatePost = mutation({
        args:{
                authorId: v.id("users"),
                title: v.string(),
                content: v.string(),
                upvotes: v.number(),
                downvotes: v.number(),
        },handler:async(ctx,args)=>{
                try{
                       
                const post = await ctx.db.insert("posts",{
                        ...args
                }) 
                // await ctx.runMutation(internal.sendEmail.sendEmail,{})
                return {success:true,message:"Success your post was successfully created ",status:200,post:post};
        }catch{
                       return {success:false,message:"Error creating post",status:500,post:null};
                }
                
        }
        })

        
 export const GetPostById = query({
                args:{postId:v.id("posts")},
                handler:async(ctx,args)=>{
                        const post = await ctx.db.query("posts").filter((q)=>q.eq(q.field("_id"),args.postId)).first();
                        if (!post) {
                               return { success:false ,status: 404,message: "post not Found",post:null };
                        }
                        return { success:true, status: 200, message: "post found", post: {
                                ...post,
                                postImage: post.postImage ? await ctx.storage.getUrl(post.postImage) : "",
                        } };
                }
                
        })
        export const GetAllPosts = query({
                handler:async(ctx)=>{
                        const posts = await ctx.db.query("posts").collect();
                        const postsWithUrls = await Promise.all(posts.map(async(post)=>{
                                return {
                                        ...post,
                                        postImage: post.postImage ? await ctx.storage.getUrl(post.postImage) : "",
                                }
                        }))
                        return postsWithUrls;
                }
        })