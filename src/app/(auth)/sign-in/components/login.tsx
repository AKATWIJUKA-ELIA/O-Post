"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import{ useRouter } from"next/navigation";
import useAuthenticate from "@/hooks/useAuthenticate"
import{IoMdEyeOff} from"react-icons/io";
import{IoEye}from"react-icons/io5"
import Loader from "@/components/Loader/loader"

const LoginForm = ({className,...props}:React.ComponentPropsWithoutRef<"form">)=> {
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const{Authenticate}=useAuthenticate()
  const [passwordtype, setPasswordType] = useState("password")
  const [view, setView] = useState(false)
  const [IsSubmitting, setIsSubmitting] = useState(false)
  const [SubmittingError, setSubmittingError] = useState("")
const router = useRouter()
const HandleSubmit = async ( e : React . FormEvent < HTMLFormElement > ) => {
         e.preventDefault (); 
         // Read from the form so browser autofill (which may not fire onChange) still works
         const formData = new FormData ( e.currentTarget ) ;
         const email = String ( formData.get ( "email" ) ?? Email ) ;
         const password = String ( formData.get ( "password" ) ?? Password ) ;
         setIsSubmitting ( true ) ;
          try { const Auth = await Authenticate ( email , password )
                if ( ! Auth ?. success ) {
                         setSubmittingError ( Auth ?. message )
                          setIsSubmitting ( false )
                           return 
                        }
                           setIsSubmitting ( false )
                           if ( Auth.role === "admin" ) {
                                   router . push ( "/admin" )
                                    return
                                   }
                            router . push ( "/" )
                        } catch ( error ) {
                                 console . error ( error ) 
                                 setSubmittingError ( "Error Logging in" )
                                  setIsSubmitting ( false )
                                 } finally {
                                         setIsSubmitting ( false )
                                          setTimeout ( ( ) => { setSubmittingError ( "" ) } , 10000 ) } }

  const HandleHide = () => {
    setPasswordType("password")
    setView(false)
  }

  const HandleView = () => {
    setPasswordType("text")
    setView(true)
  }

  return (
    <form onSubmit={HandleSubmit} className={cn("gap-6", className)} {...props}>
      <div className="flex flex-col w-full items-center gap-2 text-center">
        <h1 className="font-serif text-2xl font-bold sm:text-3xl">Welcome back</h1>
        <p className="flex text-balance text-xs sm:text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
        {SubmittingError && SubmittingError.length > 0 && (
          <p className="text-balance text-xs sm:text-sm text-destructive">{SubmittingError}</p>
        )}
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            required
            className=""
          />
        </div>
        <div className="grid gap-2">
          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-0">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Link href="/password-reset" className="xs:ml-auto text-xs sm:text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={passwordtype}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={16}
              minLength={8}
              required
              className="pr-10"
            />
            {view ? (
              <IoEye
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => HandleHide()}
              />
            ) : (
              <IoMdEyeOff
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => HandleView()}
              />
            )}
          </div>
        </div>
        <Button
          type="submit"
          disabled={IsSubmitting}
          className="w-full"
        >
          {IsSubmitting ? (
            <div className="flex gap-2">
              {" "}
              Authenticating... <Loader />
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-1 border-t border-border pt-6 text-center text-sm">
        <span>Don&apos;t have an account?</span>
        <Link href="/sign-up" className="font-semibold text-primary underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
