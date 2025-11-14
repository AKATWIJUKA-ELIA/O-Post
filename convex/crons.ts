import { internalMutation, internalQuery, internalAction, mutation } from "./_generated/server";
import { v } from "convex/values";
import { cronJobs } from "convex/server";
import { internal, api } from "./_generated/api";
import NewsletterEmail from  "../src/EmailTemplates/Newsletter";


export const fetchDueNewsletters = internalQuery({
        handler: async (ctx) => {
                const now = Date.now();
                const newsletters = await ctx.db
                        .query("NewsLetterStorage")
                        .withIndex("by_status_and_scheduledTime", (q) =>
                        q
                        .eq("status", "scheduled")
                        .lte("scheduledTime", now)
                        )
                        .collect();
                return newsletters;
        },
});
export const updateNewsletterStatus = internalMutation({
        args: {
                _id: v.id("NewsLetterStorage"),
        },
        handler: async (ctx, args) => {
                const { _id } = args;
                await ctx.db.patch(_id, {
                        status: "sent",
                        DateSent: Date.now(),
                });
        },
});
export const sendScheduledNewsletters = internalAction({
        handler: async (ctx) => {
                
                const newsletters = await ctx.runQuery(internal.crons.fetchDueNewsletters);
                        if(newsletters.length===0){
                                return;
                        }

                for (const newsletter of newsletters) {

      // Send to each recipient
                        for (const recipient of newsletter.receipients) {
                                const html = NewsletterEmail(newsletter.title, newsletter.content);
                                const response = await fetch('https://o-post.vercel.app/api/send-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                to: recipient,
                                subject: newsletter.title,
                                text: html,
                                }),
                                }).then((res) => res.json());
                                if (response.status !== 200) {
                                console.error(`Failed to send to ${recipient}: ${response.message || 'Unknown error'}`);
                                }
                        }

                        // Mark newsletter as sent
                        await ctx.runMutation(internal.crons.updateNewsletterStatus, {
                                _id: newsletter._id,
                        });
                        }

        },
})
const crons = cronJobs();
crons.interval(
  "sendScheduledNewsletters",
  { seconds: 1 },
  internal.crons.sendScheduledNewsletters,
  {}
);
export default crons;