import Link from "next/link"

/** Centered card used by sign-in, sign-up and password pages. */
export function AuthShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="flex min-h-[calc(100vh-10rem)] items-start justify-center bg-muted/50 px-4 py-10 sm:py-16">
      <div className={`w-full ${wide ? "max-w-lg" : "max-w-md"}`}>
        <Link href="/" className="mb-6 block text-center font-serif text-2xl font-bold tracking-tight text-foreground">
          The <span className="text-crimson">O</span>-Post
        </Link>
        <div className="border border-border bg-card p-6 shadow-sm sm:p-8">{children}</div>
      </div>
    </main>
  )
}
