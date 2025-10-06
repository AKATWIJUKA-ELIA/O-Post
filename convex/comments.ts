import {  v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const AddComment = mutation({
        args:{
                postId: v.id("posts"),
                authorId: v.id("users"),
                content: v.string(),
        },handler:async(ctx,args)=>{
                try{
                        const {postId,authorId,content,}=args;
                const comment = await ctx.db.insert("comments",{
                        postId,
                        commentorId:authorId,
                        content,
                        upvotes:0,
                        downvotes:0,
                        updatedAt:Date.now(),
                })
                return {success:true,message:"Comment added successfully",status:200,comment:comment};
        }catch{
                 return {success:false,message:"Error adding comment",status:500,comment:null};
                }
        }})

export const GetCommentsByPost = query({
        args:{
                postId: v.id("posts"),
        },handler:async(ctx,args)=>{
                const comments = await ctx.db.query("comments")
                .withIndex("by_post", (q) => q.eq("postId", args.postId))
                .collect();
                return comments;
        }})