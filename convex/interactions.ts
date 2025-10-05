import {mutation, query} from "./_generated/server"
import { action } from "./_generated/server";
import {v} from "convex/values"
import { ConvexError } from "convex/values";
import { api } from "../convex/_generated/api";

export const recordInteraction = mutation({
        args:{
                userId: v.id("users"),
                postId: v.id("posts"),
                type: v.union(v.literal("view"), v.literal("upvote"),v.literal("downvote"), v.literal("share"), v.literal("comment")),
        },handler:async(ctx,args)=>{
                try{
                const interaction = await ctx.db.insert("interactions",{
                        ...args,
                }) 
                return {success:true,message:"Interaction recorded",status:200,interaction:interaction};
        }catch{
                 return {success:true,message:"Error recording interaction",status:500,interaction:null};
                }
        }})