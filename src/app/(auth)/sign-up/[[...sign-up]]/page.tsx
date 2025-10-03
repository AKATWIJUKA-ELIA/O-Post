import React from 'react'
import  SignUpForm  from '../components/sign-up'
import Image from 'next/image'

const Signup = () => {
  return (
       <div className="grid lg:grid-cols-2 mt-[2%] md:mt-[4%] ">
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-xs">
                <SignUpForm />
              </div>
            </div>
          </div>
          <div className="hidden items-center lg:flex ">
            <Image
              src="/logo.png"
              alt="Image"
              width="90"
              height="20"
              className=" flex h-50 w-full  dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
  )
}

export default Signup