"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import{IoMdEyeOff} from"react-icons/io";
import{IoEye}from"react-icons/io5"
import Loader from "@/components/Loader/loader"

const LoginForm = ({className,...props}:React.ComponentPropsWithoutRef<"form">)=> {
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [passwordtype, setPasswordType] = useState("password")
  const [view, setView] = useState(false)
  const [IsSubmitting, setIsSubmitting] = useState(false)
  const [SubmittingError, setSubmittingError] = useState("")

  const HandleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate login process
    setTimeout(() => {
      setIsSubmitting(false)
      if (Email !== "admin@example.com" || Password !== "password") {
        setSubmittingError("Invalid email or password")
      } else {
        setSubmittingError("")
        // Handle successful login
      }
    }, 2000)
  }

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
        <h1 className="flex text-xl sm:text-2xl font-bold">
          <span className="text-gold">Welcome</span> Back{" "}
        </h1>
        <p className="flex text-balance text-xs sm:text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
        {SubmittingError && SubmittingError.length > 0 && (
          <p className="text-balance text-xs sm:text-sm text-red-500">{SubmittingError}</p>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 border px-4 sm:px-6 md:px-10 py-4 sm:py-6 rounded-2xl shadow-lg dark:bg-black bg-slate-100">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            required
            className="rounded-xl"
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
              type={passwordtype}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={16}
              minLength={8}
              required
              className="rounded-xl pr-10"
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
          disabled={Email.length < 1 || Password.length < 8}
          className="w-full bg-blue rounded-xl hover:bg-blue-800 hover:cursor-pointer transition-colors duration-300"
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

      <div className="flex flex-wrap justify-center items-center gap-1 text-center text-xs sm:text-sm">
        <span>Don&apos;t have an account?</span>
        <Link href="/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
