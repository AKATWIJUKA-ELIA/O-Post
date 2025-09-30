"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Mail } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribe:", email)
    setEmail("")
  }

  return (
    <section className="py-16 md:py-24 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" flex flex-col md:flex-row  md:mx-aut0 items-center text-center space-y-6 p-2 border  rounded-2xl ">
          <div className="flex flex-col gap-4 items-center justify-center  mb-4 ">
            <Mail className="flex h-8 w-8" />
            <div className="flex flex-col items-center">
                <h2 className="flex font-serif text-3xl md:text-4xl font-bold ">Stay Informed with Our Newsletter</h2>
          <p className=" flex md:text-lg text-accent-foreground/80 leading-relaxed">
            Get the day's top stories delivered to your inbox every morning. Join over 100,000 readers who trust our
            journalism.
          </p>
            </div>
          </div>
          

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6 bg-blue-50 rounded-2xl  px-4 items-center  mx-auto p-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-background text-foreground rounded-2xl border border-blue "
            />
            <Button type="submit" size="default" className="bg-primary rounded-lg        text-primary-foreground hover:bg-primary/90">
              Subscribe
            </Button>
          </form>

          {/* <p className="text-sm text-accent-foreground/60">We respect your privacy. Unsubscribe at any time.</p> */}
        </div>
      </div>
    </section>
  )
}
