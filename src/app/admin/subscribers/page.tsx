"use client"

import { useMemo, useState } from "react"
import { useMutation } from "convex/react"
import { useQuery } from "convex-helpers/react/cache"
import { Copy, Download, Mail, Search, Trash2, UserPlus, Users } from "lucide-react"

import { api } from "../../../../convex/_generated/api"
import { useNotification } from "../../NotificationContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatShortDate, timeAgo } from "@/lib/utils"

const DAY_MS = 24 * 60 * 60 * 1000

const SubscribersPage = () => {
  const subscribers = useQuery(api.NewsLetter.getSubscribers)
  const deleteSubscriber = useMutation(api.NewsLetter.DeleteSubscriber)
  const { setNotification } = useNotification()
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"newest" | "oldest" | "az">("newest")
  const [removing, setRemoving] = useState<string | null>(null)

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = (subscribers ?? []).filter((s) => s.email.toLowerCase().includes(q))
    return [...list].sort((a, b) =>
      sort === "az" ? a.email.localeCompare(b.email) : sort === "newest" ? b._creationTime - a._creationTime : a._creationTime - b._creationTime,
    )
  }, [subscribers, search, sort])

  const stats = useMemo(() => {
    const now = Date.now()
    const list = subscribers ?? []
    return [
      { label: "Total subscribers", value: list.length, icon: Users, accent: "bg-primary/10 text-primary" },
      { label: "Joined in last 7 days", value: list.filter((s) => now - s._creationTime <= 7 * DAY_MS).length, icon: UserPlus, accent: "bg-emerald-500/10 text-emerald-600" },
      { label: "Joined in last 30 days", value: list.filter((s) => now - s._creationTime <= 30 * DAY_MS).length, icon: Mail, accent: "bg-crimson/10 text-crimson" },
    ]
  }, [subscribers])

  const copyEmails = async () => {
    try {
      await navigator.clipboard.writeText(rows.map((r) => r.email).join(", "))
      setNotification({ status: "success", message: `Copied ${rows.length} email${rows.length === 1 ? "" : "s"} to the clipboard.` })
    } catch {
      setNotification({ status: "error", message: "Could not access the clipboard." })
    }
  }

  const exportCsv = () => {
    const csv = ["email,subscribed_at", ...rows.map((r) => `"${r.email.replace(/"/g, '""')}",${new Date(r._creationTime).toISOString()}`)].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `o-post-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleRemove = async (email: string) => {
    if (!window.confirm(`Remove ${email} from the newsletter? They will stop receiving emails.`)) return
    setRemoving(email)
    try {
      const res = await deleteSubscriber({ email })
      setNotification({ status: res.success ? "success" : "error", message: res.message })
    } catch {
      setNotification({ status: "error", message: "Failed to remove subscriber." })
    } finally {
      setRemoving(null)
    }
  }

  if (subscribers === undefined) {
    return (
      <div className="flex h-[60vh] items-center justify-center gap-3 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-crimson border-t-transparent" />
        Loading subscribers…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Newsletter subscribers</h2>
        <p className="text-sm text-muted-foreground">Everyone currently signed up to receive The O-Post newsletter.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border p-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by email…" aria-label="Search subscribers" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              aria-label="Sort subscribers"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">Email A–Z</option>
            </select>
            <Button variant="outline" size="sm" onClick={copyEmails} disabled={rows.length === 0}>
              <Copy className="mr-1.5 h-4 w-4" /> Copy emails
            </Button>
            <Button size="sm" onClick={exportCsv} disabled={rows.length === 0} className="bg-crimson text-white hover:bg-crimson/90">
              <Download className="mr-1.5 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* List */}
        {rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {subscribers.length === 0 ? "No one has subscribed yet." : "No subscribers match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="w-12 px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Subscribed</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((s, i) => (
                  <tr key={s._id} className="transition hover:bg-muted/40">
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
                          {s.email.charAt(0)}
                        </span>
                        <a href={`mailto:${s.email}`} className="break-all font-medium text-foreground hover:text-crimson">
                          {s.email}
                        </a>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatShortDate(s._creationTime)} <span className="text-xs">· {timeAgo(s._creationTime)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(s.email)}
                        disabled={removing === s.email}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" />
                        {removing === s.email ? "Removing…" : "Remove"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          Showing {rows.length} of {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  )
}

export default SubscribersPage
