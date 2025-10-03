import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
        users: defineTable({
    username: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    phoneNumber: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    isVerified: v.boolean(),
    role: v.string(),
    reset_token: v.optional(v.string()),
    reset_token_expires:v.number(),
    updatedAt: v.number(),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"])
  .index("by_username", ["username"])
  .index("by_isVerified", ["isVerified"])
  .index("by_reset_token_expires", ["reset_token_expires"])
  .index("by_reset_token_and_by_reset_token_expires", ["reset_token", "reset_token_expires"]),

        posts: defineTable({
        authorId: v.id("users"),
        title: v.string(),
        content: v.string(),
        category: v.string(),
        excerpt: v.string(),
        postImage: v.string(),
        upvotes: v.number(),
        downvotes: v.number(),
        updatedAt: v.optional(v.number()),
        }),

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