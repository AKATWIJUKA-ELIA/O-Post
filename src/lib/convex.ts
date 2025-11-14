import {User,UpstreamUser} from "@/lib/types"
"use server";
import {ConvexClient} from "convex/browser";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("CONVEX_URL is not defined");
}
const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function UpdateUser(userToUpdate: UpstreamUser | null) {
    if (!userToUpdate) {
        return { success: false, message: "No user provided" };
    }
    try {
        await convex.mutation(api.users.UpdateUser, { User: userToUpdate });
        return { success: true, message: "User updated successfully" };
    } catch (e) {
        return { success: false, message: e instanceof Error ? e.message : "Unknown error" };
    }
}
export const getUserByToken = async (token: string) => {
    try {
        const user = await convex.query(api.users.GetUserByToken, { token });
        if (!user.success || !user.user) {
            return { success: false, message: "User not found", status: 404 };
        }
        return { success: true, user: user.user };
    } catch (error) {
        console.error("Error fetching user by token:", error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}
export async function deletePost(id:Id<"posts">) {
  try {
    const res = await convex.mutation(api.posts.DeletePost, { id });
    return res;
  } catch {
    return { success: false, message: "Error deleting post" };
  }
}
export async function getUserById(id:  Id<"users">) {
  if (!id) return { user: null, loading: false, error: "No ID provided" };
  try {
    const user = await convex.query(api.users.GetUserById, { id });
    return {
      user,
    };
  } catch (e) {
    return {
      user: null,
      loading: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

export const getSubscribers = async () => {
        try {
        const subscribers = await convex.query(api.NewsLetter.getSubscribers,{});
        return { success: true, subscribers };
        } catch {
        return { success: false, message: "Internal Server Error" };
        }
};

export type NewsletterStatus = "pending" | "sent" | "scheduled" | "failed" | "bounced";

export const createNewsletter = async (args: {
  title: string;
  content: string;
  recipients: string[];
  status: NewsletterStatus;
  scheduledTime: number;
  DateSent?: number;
}) => {
  try {
    const id = await convex.mutation(api.NewsLetter.CreateNewsLetter, {
      title: args.title,
      content: args.content,
      recipients: args.recipients,
      status: args.status,
      scheduledTime: args.scheduledTime,
      DateSent: args.DateSent,
    });
    return { success: true, id };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Failed to create newsletter" };
  }
};

export const updateNewsletter = async (args: {
  _id: Id<"NewsLetterStorage">;
  title?: string;
  content?: string;
  receipients?: string[];
  status?: NewsletterStatus;
  scheduledTime?: number;
  DateSent?: number;
}) => {
  try {
    await convex.mutation(api.NewsLetter.updateNewsLetter, args as any);
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: e instanceof Error ? e.message : "Failed to update newsletter" };
  }
};

export const getNewsLetters = async () => {
  try {
    const list = await convex.query(api.NewsLetter.getNewsLetters, {});
    return { success: true as const, list };
  } catch (e) {
    return { success: false as const, message: e instanceof Error ? e.message : "Failed to load newsletters" };
  }
};

export const deleteNewsletter = async (id: Id<"NewsLetterStorage">) => {
        try {
        await convex.mutation(api.NewsLetter.deleteNewsLetter, { id });
        return { success: true as const };
        }
        catch (e) {
        return { success: false as const, message: e instanceof Error ? e.message : "Failed to delete newsletter" };
        }
}