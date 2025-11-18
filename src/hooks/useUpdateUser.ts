import { api } from "../../convex/_generated/api"; 
import { useMutation } from "convex/react";
import { User } from "@/lib/types";
import { Id } from "../../convex/_generated/dataModel";
import {getUserById} from "@/lib/convex";

export const useUpdateUser = () => {
        const update = useMutation(api.users.UpdateUser);
        const UpdateUser = async (data:{id:Id<"users">,username:string,profileImage:string|null}) =>{
                try{
                        const existingUser = await getUserById(data.id);
                        const profilePicture =
  data.profileImage ?? existingUser.user?.profilePicture ?? undefined;
                        const User = {
                                ...existingUser.user,
                                _id: data.id,
                                username:data.username,
                                email: existingUser.user?.email||"",
                                passwordHash: existingUser.user?.passwordHash||"",
                                phoneNumber: existingUser.user?.phoneNumber,
                                isVerified: existingUser.user?.isVerified||false,
                                role: existingUser.user?.role||"",
                                reset_token: existingUser.user?.reset_token,
                                reset_token_expires: existingUser.user?.reset_token_expires||0,
                                updatedAt: Date.now(),
                                lastLogin: existingUser.user?.lastLogin||0,
                                profilePicture

                        };
                        if(!User){
                                return { success: false, message: "User not found" , status: 404 };
                        }
                const response = await update({ 
                        User: User 
                });
                        if(!response?.succes){
                                return { success: false, message: response?.message , status: 400 };
                        }
                        return { success: true, message:response.message ,  status: 200 };
                }catch{
                        return  { success: false, message: "Sorry,  Can not update at this time please try again later" , status: 500 };
                }
        }
        return { UpdateUser };
 }