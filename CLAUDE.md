# Divine Love 26 — Monorepo

Turborepo + pnpm workspaces. Three Next.js apps sharing a tRPC backend and Drizzle/Postgres (Neon) DB.

## Commands (run from repo root)

```bash
pnpm dev           # Start all apps
pnpm build         # Build all apps + packages
pnpm lint          # Lint all packages
pnpm check-types   # TypeScript check across all packages
pnpm format        # Prettier
```

```bash
pnpm db:generate   # Generate Drizzle migrations
pnpm db:push       # Push schema directly (dev)
pnpm db:migrate    # Run migrations
pnpm db:studio     # Drizzle Studio
pnpm db:seed       # Seed admin user + wedding event/gallery
```

Scoped: `pnpm --filter marketing dev`, `pnpm --filter rsvp dev`, `pnpm --filter admin dev`.

## Apps

| App              | Port | Purpose                                                                                   |
| ---------------- | ---- | ----------------------------------------------------------------------------------------- |
| `apps/marketing` | 3001 | Public wedding landing page — Hero, Story, Events, Gallery                                |
| `apps/rsvp`      | 3002 | Guest RSVP flow at `/` + admin dashboard under `/admin/*` (login, stats, guest CRUD, CSV) |

## Shared packages

| Package       | Purpose                                                          |
| ------------- | ---------------------------------------------------------------- |
| `@repo/api`   | tRPC routers — `auth`, `rsvp`, `admin`, `gallery`, `events`      |
| `@repo/db`    | Drizzle ORM schema (core + wedding), migrations, seeds, client   |
| `@repo/auth`  | Session validation, password hashing, OTP                        |
| `@repo/email` | Resend email service + React Email templates                     |
| `@repo/env`   | `@t3-oss/env-nextjs` + Zod env validation                        |
| `@repo/ui`    | Shared shadcn/Radix primitives                                   |
| `@repo/tooling` | Shared TS/ESLint/Tailwind configs                              |

## Auth

Session tokens are stored in localStorage and passed as `Authorization: Bearer <token>` on every tRPC request. Validated server-side in the tRPC context. `adminProcedure` enforces `role === "admin"`.

Seed default admin: `admin@example.com` / `password123` (change in `packages/db/src/seeds/seed-admin.ts` before production).

## Database

Neon Postgres. Set `DATABASE_URL` in `.env.local` to the pooled connection string. Schema files live in `packages/db/src/schema/{core,wedding}/`.

Wedding tables: `events`, `guests` (unique lower(first_name, last_name)), `rsvps` (1:1 with guests, cascade delete), `gallery_images`.
