import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";

const useInteractWithPost = () => {
  const likePost = useMutation(api.posts.LikePost);
  const DisLikePost = useMutation(api.posts.DisLikePost);
  const CommentOnPost = useMutation(api.posts.CommentOnPost);

  const likePostFunction = async (postId: Id<"posts">, userId: Id<"users">,) => {
   const response = await likePost({ postId, userId });
        return response; 
};
        const disLikePostFunction = async (postId: Id<"posts">, userId: Id<"users">,) => {
        const response = await DisLikePost({ postId, userId });
        return response;
        }

        const commentOnPostFunction = async (postId: Id<"posts">, userId: Id<"users">, comment: string) => {
        const response = await CommentOnPost({ postId, commentorId: userId, content: comment });
        return response;
        }

  return { 
        likePost: likePostFunction, 
        disLikePost: disLikePostFunction, 
        commentOnPost: commentOnPostFunction 
  };
};
export default useInteractWithPost;