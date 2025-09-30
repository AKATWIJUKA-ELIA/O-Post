import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing && !existing.unsubscribed) {
      throw new Error("Already subscribed");
    }
    if (existing && existing.unsubscribed) {
      await ctx.db.patch(existing._id, { unsubscribed: false });
      return;
    }
    await ctx.db.insert("subscribers", {
      email: args.email,
      subscribedAt: Date.now(),
      unsubscribed: false,
    });
  },
});
