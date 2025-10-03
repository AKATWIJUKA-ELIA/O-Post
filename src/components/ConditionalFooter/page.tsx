"use client"
import React  from 'react'
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/footer';
const ConditionalFooter = () => {
        const pathname = usePathname()
        if(pathname.includes("profile") || pathname.includes("admin")|| pathname.includes("sign-in") || pathname.includes("sign-up") ){
                        return null
                }
  return (
    <Footer/>
  )
}

export default ConditionalFooter