"use client"
import type React from "react"
import { useEffect } from "react"
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react"

import { useNotification } from "@/app/NotificationContext"

const DURATION_MS = 5000

const STYLES = {
  success: { icon: CheckCircle2, title: "Success", accent: "bg-emerald-500", iconColor: "text-emerald-600" },
  error: { icon: XCircle, title: "Error", accent: "bg-crimson", iconColor: "text-crimson" },
  info: { icon: Info, title: "Notice", accent: "bg-sky-500", iconColor: "text-sky-600" },
  warning: { icon: AlertTriangle, title: "Warning", accent: "bg-amber-500", iconColor: "text-amber-600" },
} as const

/** Toast for messages set through NotificationContext. Sits above the sticky nav and auto-dismisses. */
const MessagePop: React.FC = () => {
  const { notification, setNotification } = useNotification()

  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => setNotification(null), DURATION_MS)
    return () => clearTimeout(timer)
  }, [notification, setNotification])

  if (!notification) return null

  const style = STYLES[notification.status] ?? STYLES.info
  const Icon = style.icon

  return (
    <div
      role={notification.status === "error" ? "alert" : "status"}
      aria-live="polite"
      className="fade-in fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
    >
      <div className="flex items-start gap-3 p-4 pr-10">
        <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.iconColor}`} />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{style.title}</p>
          {notification.message && <p className="mt-0.5 break-words text-sm text-muted-foreground">{notification.message}</p>}
        </div>
      </div>
      <button
        onClick={() => setNotification(null)}
        className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
      {/* Countdown bar; keyed on the notification so it restarts for each new message */}
      <div
        key={`${notification.status}-${notification.message}`}
        className={`h-1 ${style.accent} origin-left`}
        style={{ animation: `toast-countdown ${DURATION_MS}ms linear forwards` }}
      />
    </div>
  )
}

export default MessagePop
