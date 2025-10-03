import { useAppDispatch } from "@/hooks";
import { SaveUser } from "@/store/postUser";
import { Id } from "../../convex/_generated/dataModel";
interface User {
        User_id: Id<"users">;
        Username: string;
         email:string;
        profilePicture:string,
}
const useSaveUser = ()=>{
        const dispatch = useAppDispatch();
        return (user:User)=>{
                // console.log("user",user)
                dispatch(SaveUser(user))
        }
}
export default useSaveUser