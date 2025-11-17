import {  v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const generateUploadUrl = mutation(async (ctx)=>{
      return await ctx.storage.generateUploadUrl()
})

export const CreatePost = mutation({
        args:{
                authorId: v.id("users"),
                title: v.string(),
                content: v.string(),
                excerpt: v.string(),
                category: v.string(),
                postImage: v.string(),
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
        export const DeletePost = mutation({
        args:{id: v.id("posts")},
        handler: async (ctx, args) => {
                const { id } = args;
                const exisiting = await ctx.db.get(id);
                if (!exisiting) {
                        return { success: false, message: "Post not found", status: 404 };
                }
                await ctx.db.delete(id);
                return { success: true, message: "Post deleted successfully", status: 200 };
        }
        })
        
      export const UpdatePost = mutation({
        args:{
                post: v.object({
                        _id: v.id("posts"),
                        authorId: v.id("users"),
                        title: v.string(),
                        content: v.string(),
                        excerpt: v.string(),
                        category: v.string(),
                        postImage: v.optional(v.string()),
                    }),
          },
        handler: async (ctx, args) => {
                const post = await ctx.db.get(args.post._id);
              if(!post){
                return { success: false, message: "Post not found", status: 404, post: null };
              }
              if(args.post.postImage?.length===0){
                 await ctx.db.patch(args.post._id, {
                        title: args.post.title,
                        authorId: args.post.authorId,
                        content: args.post.content,
                        category: args.post.category,
                        excerpt: args.post.excerpt,
                 });
                 return { success: true, message: "Post updated successfully", status: 200, post: args.post };
              }
               await ctx.db.patch(args.post._id, args.post);
                 return { success: true, message: "Post updated successfully", status: 200, post: args.post };
              
        }})
        
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
                        const posts = await ctx.db.query("posts").order("desc").collect();
                        const postsWithUrls = await Promise.all(posts.map(async(post)=>{
                                return {
                                        ...post,
                                        postImage: post.postImage ? await ctx.storage.getUrl(post.postImage) : "",
                                }
                        }))
                        return postsWithUrls;
                }
        })
        export const LikePost = mutation({
                args:{
                        postId:v.id("posts"),
                        userId:v.id("users"),
                },handler:async(ctx,args)=>{
                        const post = await ctx.db.get(args.postId);
                        if(!post){
                                return {success:false,message:"Post not found",status:404,post:null};
                        }
                        const existingInteraction = await ctx.db.query("interactions")
                        .filter((q) => q.and(
                                q.eq(q.field("userId"), args.userId),
                                q.eq(q.field("postId"), args.postId),
                                q.or(q.eq(q.field("type"), "downvote"),
                                q.eq(q.field("type"), "upvote"))
                        ))
                        .unique();
                        if (!existingInteraction) {
                                 const updatedPost = await ctx.db.patch(args.postId,{
                                upvotes: post.upvotes+1
                                
                        })
                        await ctx.db.insert("interactions",{
                                        userId: args.userId,
                                        postId: args.postId,
                                        type: "upvote",
                                })
                        return {success:true,message:"Post updated successfully",status:200,post:updatedPost};
                                
                        }
                        return { success: false, message: "you have already liked/disliked this post", status: 400, post: null };
                       
                }
        })

                export const DisLikePost = mutation({
                args:{
                        postId:v.id("posts"),
                        userId:v.id("users"),
                },handler:async(ctx,args)=>{
                        const post = await ctx.db.get(args.postId);
                        if(!post){
                                return {success:false,message:"Post not found",status:404,post:null};
                        }
                        const existingInteraction = await ctx.db.query("interactions")
                        .filter((q) => q.and(
                                q.eq(q.field("userId"), args.userId),
                                q.eq(q.field("postId"), args.postId),
                                q.or(q.eq(q.field("type"), "downvote"),
                                q.eq(q.field("type"), "upvote"))
                        ))
                        .unique();
                        if (existingInteraction) {
                                return { success: false, message: "you have already  liked/disliked this post", status: 400, post: null };
                        }
                        const updatedPost = await ctx.db.patch(args.postId,{
                                downvotes: post.downvotes+1
                        })
                        await ctx.db.insert("interactions",{
                                        userId: args.userId,
                                        postId: args.postId,
                                        type: "downvote",
                                })
                        return {success:true,message:"Post updated successfully",status:200,post:updatedPost};
                }
        })

        export const CommentOnPost = mutation({
                args:{
                        postId:v.id("posts"),
                        commentorId:v.id("users"),
                        content:v.string(),
                },handler:async(ctx,args)=>{
                        try{
                        const comment = await ctx.db.insert("comments",{
                                ...args,
                                upvotes:0,
                                downvotes:0,
                                updatedAt:Date.now(),
                        }) 
                        return {success:true,message:"Comment added successfully",status:200,comment:comment};
                }catch{
                        return {success:false,message:"Error adding comment",status:500,comment:null};
                }}}) 

                export const GetPostsByCategory = query({
                        args:{category:v.string()},
                        handler:async(ctx,args)=>{
                                const posts = await ctx.db.query("posts").filter((q)=>q.eq(q.field("category"),args.category)).order("desc").collect();
                                const postsWithUrls = await Promise.all(posts.map(async(post)=>{
                                        return {
                                                ...post,
                                                postImage: post.postImage ? await ctx.storage.getUrl(post.postImage) : "",
                                        }
                                }))
                                return postsWithUrls;
                        }       
                })