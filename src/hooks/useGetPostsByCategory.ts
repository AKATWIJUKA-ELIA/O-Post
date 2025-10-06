import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const useGetPostsByCategory = (category: string) => {
    const posts = useQuery(api.posts.GetPostsByCategory, category ? { category:category } : "skip"); // Prevent calling hook with an empty ID

    return {
        data: posts, 
        loading: posts === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetPostsByCategory;