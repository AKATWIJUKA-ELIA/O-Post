"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import useAuthenticate from "@/hooks/useAuthenticate"
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
import Loader from "@/components/Loader/loader"


const LoginForm=({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">)=>{
        const {Authenticate} = useAuthenticate()
        const[IsSubmitting,setIsSubmitting] = useState(false)
        const[SubmittingError,setSubmittingError] = useState("")
        const[Email, setEmail] = useState('')
        const [view,setview] = useState(false)
        const [passwordtype,setpasswordtype] = useState("password")
        const[Password, setPassword] = useState('')

        const router = useRouter();

                const HandleView = ()=>{
                        setview(true)
                        setpasswordtype("text")
                
        }
                const HandleHide = ()=>{
                        setview(false)
                        setpasswordtype("password")
                }



        const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
                e.preventDefault();
                setIsSubmitting(true);
                try{
                const Auth = await Authenticate(Email,Password)
                
                if(!Auth?.success){
                        setSubmittingError(Auth?.message)
                        setIsSubmitting(false)
                        return
                }
                setIsSubmitting(false)
                router.push("/")
        }catch(error){
                console.error(error)
                setSubmittingError("Error Logging in")
                setIsSubmitting(false)
        }finally{
                setIsSubmitting(false)
                setTimeout(()=>{
                        setSubmittingError("")
                },10000)
        }
        }
        // if(IsSubmitting){
        //         return <Loader />
        // }

  return (
    <form onSubmit={HandleSubmit} className={cn(" gap-6", className)} {...props}>
      <div className="flex flex-col w-full items-center gap-2 text-center ">
        <h1 className="flex text-2xl font-bold"><span className="text-gold" >Welcome</span> Back </h1>
        <p className="flex text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
        {SubmittingError && SubmittingError.length>0 && <p className="text-balance text-sm text-red-500">
          {SubmittingError}
        </p>}
      </div>

      <div className="grid gap-6 border md:px-10 py-4 rounded-2xl shadow-lg dark:bg-black bg-slate-100 ">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email"
           type="email"
           value={Email}
           onChange={(e) =>setEmail(e.target.value)}
            placeholder="m@example.com"
             required
             className="rounded-xl"
             />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/password-reset"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="relative" >
                <Input id="password"
           type={passwordtype}
           value={Password}
           onChange={(e) =>setPassword(e.target.value)}
           maxLength={16}
           minLength={8}
            required
            className="rounded-xl pr-10"
            />
            {view ?(
                <IoEye  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onClick={()=>HandleHide()}  />
                ):(
                        <IoMdEyeOff
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onClick={()=>HandleView()}
                />
                )}
          </div>
        </div>
        <Button type="submit" disabled={Email.length < 0 || Password.length<8} 
        className="w-full bg-blue rounded-xl hover:bg-blue-800 hover:cursor-pointer transition-colors duration-300  ">
          {IsSubmitting ? <div className="flex gap-2" > Authenticating... <Loader /></div>:"Login"}
        </Button>
      
      </div>

      <div className="flex text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
export default LoginForm;