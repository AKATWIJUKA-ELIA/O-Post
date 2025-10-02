import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
        users: defineTable({
        name: v.string(),
        email: v.string(),
        updatedAt: v.number(),

        }).index("by_email", ["email"]),

        posts: defineTable({
        authorId: v.id("users"),
        title: v.string(),
        content: v.string(),
        excerpt: v.string(),
        postImage: v.string(),
        upvotes: v.number(),
        downvotes: v.number(),
        updatedAt: v.optional(v.number()),
        }).index("by_author", ["authorId"]),

        comments: defineTable({
        postId: v.id("posts"),
        commentorId: v.id("users"),
        content: v.string(),
        upvotes: v.number(),
        downvotes: v.number(),
        updatedAt: v.number(),
        }).index("by_post", ["postId"]),

        newsletters: defineTable({
        title: v.string(),
        content: v.string(),
        }).index("by_title", ["title"]),

        subscriptions: defineTable({
                email: v.string(),
        }).index("by_email", ["email"]),
})