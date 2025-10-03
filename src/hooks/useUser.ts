"use server"
import { decrypt } from "@/lib/sessions"
import { cookies } from "next/headers"

export async function useUser() {
        const cookie = cookies().get("O-Session")?.value
        const session = cookie ? await decrypt(cookie) : null
        if (!session) {
                return { 
                        success:false,
                        session: null 
                        };
        }
        // console.log("session in useUser",session)
        return { 
                success:true,
                session
        };
}