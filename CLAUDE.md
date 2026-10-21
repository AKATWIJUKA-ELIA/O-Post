# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server (run `npx convex dev` in a second terminal for the backend)
- `npm run build` / `npm start` / `npm run lint`
- No test runner is configured.
- `next.config.mjs` sets `ignoreBuildErrors` and `ignoreDuringBuilds`, so `next build` will NOT surface TypeScript/ESLint errors. Run `npx tsc --noEmit` to type-check.

Env vars (`.env.local`): `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `SESSION_SECRET`, `SMTP_USER`, `SMTP_PASSWORD`; `.env`: `NEXT_PUBLIC_BASE_URL` (falls back to `https://theopost.com` in [src/lib/urls.ts](src/lib/urls.ts)).

## Architecture

"The O-Post" is a news/blog site: Next.js 14 App Router (`src/app`) + Convex backend (`convex/`) + Tailwind v4 / Radix UI (shadcn-style, `components.json`). Path alias `@/` → `src/`.

### Custom auth (no Convex Auth / Clerk)
- Users live in the Convex `users` table with a bcrypt `passwordHash`; sign-in/up/reset logic is in Convex functions ([convex/users.ts](convex/users.ts)) called from client hooks in `src/hooks/` (e.g. `useAuthenticate`).
- After login the client POSTs to `/api/createsession`, which sets an httpOnly `O-Session` cookie containing a JWT (jose, HS256, signed with `SESSION_SECRET`; see [src/lib/sessions.ts](src/lib/sessions.ts)) with `userId`, `role`, `isVerified`. `/api/checksession`, `/api/logout`, `/api/verifyaccount` are the sibling routes.
- [src/middleware.ts](src/middleware.ts) decrypts that cookie: `/profile` and `/admin*` require a session; `/admin*` additionally requires `role === "admin"`; signed-in users are bounced off `/sign-in` and `/sign-up`. Convex functions themselves do not verify this session.
- Client-side user state is kept in Redux Toolkit + redux-persist (`src/store/`); provider stack is in [src/app/Providers.tsx](src/app/Providers.tsx) (Notification → Convex → ConvexQueryCache → Redux).

### Convex backend
- Tables (see [convex/schema.ts](convex/schema.ts)): `users`, `posts`, `comments`, `interactions` (view/upvote/downvote/share/comment per user+post), `subscriptions` (newsletter emails), `newsletters`, `NewsLetterStorage` (scheduled sends, indexed by status + scheduledTime).
- Frontend consumers are thin hooks in `src/hooks/` (one per Convex function) plus helpers in [src/lib/convex.ts](src/lib/convex.ts).
- Email has two parallel paths: the `@convex-dev/resend` component ([convex/convex.config.ts](convex/convex.config.ts), [convex/sendEmail.ts](convex/sendEmail.ts)) and a Next.js nodemailer/SMTP route `src/app/api/send-email/route.js`. HTML bodies come from `src/EmailTemplates/`, which `convex/` imports directly across the `src` boundary.
- Scheduled newsletters: [convex/crons.ts](convex/crons.ts) runs `sendScheduledNewsletters` on a 1-second interval; it finds due `NewsLetterStorage` rows and sends each recipient's email by POSTing to the Next.js `${BASE_URL}/api/send-email` route (so a deployed Next app must be reachable at `BASE_URL`), then marks the row `sent`.
- [convex/http.ts](convex/http.ts) has a stub `/api/send-email` route only.

### Frontend layout
- `src/app/` pages: home, `news/[id]`, `category/[category]`, `profile`, `(auth)/sign-in|sign-up`, `password-reset`, `passwordChange`, and the `admin/*` area (create, edit/[id], update, newsletter).
- Admin UI components are in `src/adminComponents/`; public/shared components in `src/components/` (`ui/` holds the shadcn primitives).
