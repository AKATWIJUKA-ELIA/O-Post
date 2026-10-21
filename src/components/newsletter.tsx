"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Check, Send } from "lucide-react"
import useAddEmail from "@/hooks/useAddEmail"
import { useNotification } from "@/app/NotificationContext"

export function Newsletter() {
        const [email, setEmail] = useState("")
        const { save } = useAddEmail();
        const { setNotification } = useNotification();
        

const handleSubmit =async (e: React.FormEvent) => {
                e.preventDefault()
    // Handle newsletter subscription
        await save(email).then((res)=>{
                if(!res.success){
                        setNotification({
                                message: res.error || "Failed to subscribe. Please try again.",
                                status: "error",
                        });
                        return;
                }
                setNotification({
                        message: "Successfully subscribed to the newsletter!",
                        status: "success",
                });
                setEmail("");
        })
  }
 

  const perks = ["Top stories every morning", "Breaking news alerts", "Free, unsubscribe anytime"]

  return (
    <section id="newsletter" className="relative overflow-hidden bg-gradient-to-r from-[#8f0a1e] via-crimson to-[#8f0a1e] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_28px,rgba(0,0,0,0.07)_28px_56px)]" />
      <div className="relative mx-auto grid w-[95%] items-center gap-8 py-12 md:grid-cols-[1.1fr_1fr] md:py-14 xl:w-[85%]">
        <div className="flex gap-5">
          <span className="hidden h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 sm:flex">
            <Mail className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/75">The morning briefing</p>
            <h2 className="mt-1 text-balance font-serif text-3xl font-bold leading-tight md:text-4xl">
              The day&apos;s top stories, in your inbox.
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
              {perks.map((perk) => (
                <li key={perk} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-white" /> {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg bg-white p-2 shadow-xl sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 flex-1 border-0 bg-transparent text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Button type="submit" className="h-12 rounded-md bg-[#16161d] px-7 font-semibold text-white hover:bg-black">
              Subscribe <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-3 text-xs text-white/70">We respect your privacy. Your email is only used to send the newsletter.</p>
        </div>
      </div>
    </section>
  )
}
