import {mutation,query} from "./_generated/server"
import { ConvexError } from "convex/values";
import {v} from "convex/values"

export const AddEmail = mutation({
        args: { email: v.string() },
        handler: async (ctx, args) => {
          // Check if the email already exists
          if (!args.email || !args.email.includes('@')||args.email.length<=0) {
            throw new ConvexError("Invalid email address.");
          }
          const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
      
        if (existing) {
            throw new ConvexError("This email is already subscribed.");
          }
      
          // If not found, insert the email
          await ctx.db.insert("subscriptions", {
            email: args.email,
          });
        },
      });

      export const getSubscribers = query({
        args:{},
        handler: async(ctx)=>{
                const subscribeList = await ctx.db.query("subscriptions").collect()
                return subscribeList
        }
      })
      export const CreateNewsLetter = mutation({
        args:{
                title: v.string(),
                content: v.string(),
                recipients: v.array(v.string()),
               status: v.union(
                v.literal("pending"),
                v.literal("sent"),
                v.literal("scheduled"),
                v.literal("failed"),
                v.literal("bounced"),
        ),
                scheduledTime: v.number(),
                DateSent: v.optional(v.number()),
        },
        handler: async (ctx, args) => {
                const { title, content, recipients, status, scheduledTime, DateSent } = args;
                const newsletter = await ctx.db.insert("NewsLetterStorage", {
                        title: title,
                        content,
                        receipients: recipients,
                        status,
                        scheduledTime,
                        DateSent
                });
                return newsletter;
        }
      });
      
      export const getNewsLetters = query({
        args:{},
        handler:async(ctx)=>{
          const newsletters = await ctx.db.query("NewsLetterStorage").collect();
          return newsletters
        }
        });

        export const updateNewsLetter = mutation({
        args: {
          _id: v.id("NewsLetterStorage"),
          title: v.optional(v.string()),
          content: v.optional(v.string()),
          receipients: v.optional(v.array(v.string())),
          status: v.optional(
            v.union(
              v.literal("pending"),
              v.literal("sent"),
              v.literal("scheduled"),
              v.literal("failed"),
              v.literal("bounced")
            )
          ),
          scheduledTime: v.optional(v.number()),
          DateSent: v.optional(v.number()),
          _creationTime: v.optional(v.number()),
        },
        handler:async (ctx, args) => {
                const { _id, title, content, receipients, status, scheduledTime, DateSent } = args;
                const existing = await ctx.db.get(_id);
                await ctx.db.patch(_id, {
                        title:title?title: existing?.title,
                        content:content?content: existing?.content,
                        receipients:receipients?receipients: existing?.receipients,
                        status:status?status: existing?.status,
                        scheduledTime:scheduledTime?scheduledTime: existing?.scheduledTime,
                        DateSent:DateSent?DateSent: existing?.DateSent,
                });
        }
        })

        export const DeleteSubscriber = mutation({
                args:{email: v.string()},
                handler: async (ctx, args) => {
                        const { email } = args;
                        const exisiting = await ctx.db.query("subscriptions")
                        .withIndex("by_email", (q) => q.eq("email", email))
                        .unique();
                        if (!exisiting) {
                                return { success: false, message: "Subscriber not found" };
                        }
                        await ctx.db.delete(exisiting._id);
                        return { success: true, message: "Subscriber deleted successfully" };
                }
        })
        export const deleteNewsLetter = mutation({
                args: { id: v.id("NewsLetterStorage") },
                handler: async (ctx, args) => {
                        const exisiting = await ctx.db.get(args.id);
                        if (!exisiting) {
                                return { success: false, message: "Newsletter not found" };
                        }
                        await ctx.db.delete(args.id);
                        return { success: true, message: "Newsletter deleted successfully" };
                }
        })