import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  articles: defineTable({
    title: v.string(),
    image: v.optional(v.id("_storage")),
    category: v.string(),
    content: v.string(), // ProseMirror JSON string
    tags: v.array(v.string()),
    publishDate: v.number(),
    authorId: v.id("users"),
    published: v.boolean(),
    summary: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_tags", ["tags"])
    .index("by_publishDate", ["publishDate"]),

  comments: defineTable({
    articleId: v.id("articles"),
    userId: v.optional(v.id("users")),
    guestName: v.optional(v.string()),
    guestEmail: v.optional(v.string()),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_article", ["articleId"]),

  reactions: defineTable({
    articleId: v.id("articles"),
    userId: v.id("users"),
    reactionType: v.union(v.literal("like"), v.literal("dislike")),
  }).index("by_article_user", ["articleId", "userId"]),

  subscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    unsubscribed: v.optional(v.boolean()),
  }).index("by_email", ["email"]),

  sentEmails: defineTable({
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    sentAt: v.number(),
    type: v.string(), // e.g., "newsletter", "notification"
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
