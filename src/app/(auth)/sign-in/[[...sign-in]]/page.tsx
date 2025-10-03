// import {SignIn} from "@clerk/nextjs"
import LoginForm from "../components/login"
import React from 'react'
import Image from "next/image"

const Signin = () => {
  return (
   <div className="flex flex-col min-h-svh mt-[2%] ">
              <div className="flex mt-6 ">
        <Image
          src="/logo.png"
          alt="Image"
          width="300"
          height="100"
          className=" object-cover mx-auto dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-5 border rounded-2xl shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mx-96 mt-6">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm  />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Signin