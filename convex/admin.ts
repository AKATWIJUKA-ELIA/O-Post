import { query } from "./_generated/server";

export const analytics = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    const subscribers = await ctx.db.query("subscribers").collect();
    const comments = await ctx.db.query("comments").collect();
    const reactions = await ctx.db.query("reactions").collect();
    const likes = reactions.filter((r) => r.reactionType === "like").length;
    const dislikes = reactions.filter((r) => r.reactionType === "dislike").length;
    return {
      articles: articles.length,
      subscribers: subscribers.length,
      likes,
      dislikes,
      comments: comments.length,
    };
  },
});
