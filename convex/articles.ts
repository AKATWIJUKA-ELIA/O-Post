import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { api } from "./_generated/api";

export const list = query({
  args: {
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let articles = [];
    if (args.category) {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_category", (q2: any) => q2.eq("category", args.category))
        .order("desc")
        .collect();
    } else {
      articles = await ctx.db.query("articles").order("desc").collect();
    }
    if (args.tag) {
      articles = articles.filter((a) => a.tags.includes(args.tag!));
    }
    if (args.search) {
      articles = articles.filter((a) =>
        a.title.toLowerCase().includes(args.search!.toLowerCase())
      );
    }
    // Pagination
    const start = 0;
    const numItems = args.paginationOpts.numItems;
    const page = articles.slice(start, start + numItems);
    return {
      page: await Promise.all(
        page.map(async (a) => ({
          ...a,
          imageUrl: a.image
            ? await ctx.storage.getUrl(a.image)
            : undefined,
          authorName: (await ctx.db.get(a.authorId))?.name ?? "Unknown",
        }))
      ),
      isDone: page.length < numItems,
      continueCursor: null, // Not a real cursor, just for demo
    };
  },
});
