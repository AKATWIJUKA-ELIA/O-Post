import React from 'react'
// import { SignUp } from '@clerk/nextjs'
import ChangePassword from '@/components/ChangePassword/page'
import Image from 'next/image'

const Signup = () => {
  return (
       <div className="flex flex-col  my-12 md:mx-28 lg:mx-80 mt-[6%] md:mt-[4%]  border rounded-2xl items-center">
                  <div className=" hidden mt-6 lg:flex  justify-center items-center">
            <Image
              src="/logo.png"
              alt="Image"
              width="200"
              height="50"
              className=" flex w-40 "
            />
          </div>

          <div className="flex flex-col border rounded-2xl p-6 md:p-10">
            <div className="w-full  ">
                <ChangePassword />
              </div>
          </div>

        </div>
  )
}

export default Signup