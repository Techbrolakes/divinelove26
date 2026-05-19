<div align="center">

<img src="apps/marketing/public/logo/monogram-white-on-blue.jpeg" alt="Divine Love 26 monogram" width="160" />

# Divine Love 26

**Idah Joy Itsosi  ·  &  ·  Ikhioya David Ohiozoje**

_Save · the · Date — 20 June 2026_

#DIVINELOVE26 · [divinelove26.com](https://divinelove26.com/)

<img src="apps/marketing/public/gallery/prewedding-05.jpg" alt="Couple — prewedding" width="48%" />
<img src="apps/marketing/public/gallery/prewedding-12.jpg" alt="Couple — prewedding" width="48%" />

</div>

---

A cinematic wedding microsite built as a Turborepo monorepo. The marketing app is a scroll-through "letter, desk, gallery, program" experience powered by GSAP and Lenis; the RSVP app handles guest replies, invitation codes, QR check-in at the door, and a small admin dashboard for the couple.

> Hosted at **https://divinelove26.com/**. The live site is behind bot protection, so a static screenshot couldn't be fetched into this README — the images above are the project's own brand assets straight from `apps/marketing/public/`.

## Stack

- **Turborepo** + **pnpm workspaces** — monorepo orchestration
- **Next.js 16** (App Router, React 19) — both apps
- **tRPC v11** + **TanStack Query** — typesafe API
- **Drizzle ORM** + **Neon Postgres** — database & migrations
- **Tailwind CSS v4** + **Radix / shadcn primitives** — UI
- **GSAP** + **Lenis** — scene transitions and smooth scroll (marketing)
- **Framer Motion** + **TanStack Table** + **`@yudiel/react-qr-scanner`** — RSVP & admin UI
- **Resend** + **React Email** + **`@react-pdf/renderer`** — invitations, OTPs, PDF tickets

## Apps

| App              | Port | What it does |
| ---------------- | ---- | ------------ |
| `apps/marketing` | 3001 | Public-facing celebration site — Invitation → Our Story → Events → Gifts → Gallery, with ambient music and a save-the-date countdown. |
| `apps/rsvp`      | 3002 | Guest RSVP flow at `/`, plus admin under `/admin/*` (login, dashboard, guest CRUD, QR validation, team management). |

## Shared packages

| Package         | Purpose                                                                          |
| --------------- | -------------------------------------------------------------------------------- |
| `@repo/api`     | tRPC routers: `auth`, `rsvp`, `admin`, `gallery`, `events`                        |
| `@repo/db`      | Drizzle schema (`core/` + `wedding/`), migrations, seed scripts, Neon client     |
| `@repo/auth`    | Session validation, bcrypt password hashing, OTP                                  |
| `@repo/email`   | Resend send helpers + React Email templates (invitation, welcome, OTP) + PDF asset embedding |
| `@repo/env`     | `@t3-oss/env-nextjs` + Zod env validation                                         |
| `@repo/ui`      | Shared shadcn/Radix primitives                                                    |
| `@repo/tooling` | Shared TypeScript / ESLint / Tailwind configs                                     |

## Marketing site — the scene order

The landing page is composed of GSAP-driven "scenes" with a shared royal-navy backdrop and an ambient soundtrack that ducks per scene:

1. **The Envelope** — hero / save-the-date countdown
2. **Our Story** — `/story`
3. **Events** — `/events`
4. **With Gratitude** — `/gifts` (bank accounts + Espees handle)
5. **The Gallery** — `/gallery` with full-screen lightbox

Source of truth lives in [`apps/marketing/lib/scenes.ts`](apps/marketing/lib/scenes.ts) and [`apps/marketing/lib/constants.ts`](apps/marketing/lib/constants.ts).

## Auth

Session tokens live in `localStorage` and ride along on every tRPC request as `Authorization: Bearer <token>`. The tRPC context validates them server-side; `adminProcedure` additionally enforces `role === "admin"`.

The seed default admin is `admin@example.com` / `password123` — **change `packages/db/src/seeds/seed-admin.ts` before production**.

## Database

Neon Postgres via Drizzle. Schema lives under `packages/db/src/schema/`:

- **core/** — `users`, `sessions`, `verification-tokens`, `notifications`
- **wedding/** — `events`, `guests` (unique lower-cased email; invitation codes; check-in timestamps), `gallery_images`

Set `DATABASE_URL` in `.env.local` to your pooled connection string.

## Getting started

```bash
pnpm install
cp .env.example .env.local      # fill in DATABASE_URL, AUTH_SECRET, RESEND_*, etc.
pnpm db:push                    # push schema to your Neon DB
pnpm db:seed                    # seed admin user + sample events + gallery
pnpm dev                        # all apps via Turborepo
```

Then visit:

- Marketing — http://localhost:3001
- RSVP — http://localhost:3002 · Admin — http://localhost:3002/admin

### Scoped dev

```bash
pnpm --filter marketing dev
pnpm --filter rsvp dev
```

## Common commands

```bash
pnpm dev           # all apps
pnpm build         # build everything
pnpm lint
pnpm check-types
pnpm format        # prettier

pnpm db:generate   # generate Drizzle migrations
pnpm db:push       # push schema directly (dev)
pnpm db:migrate    # run migrations
pnpm db:studio     # open Drizzle Studio
pnpm db:seed       # seed admin + wedding fixtures
```

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and fill in:

| Variable                     | Notes                                                |
| ---------------------------- | ---------------------------------------------------- |
| `DATABASE_URL`               | Neon pooled connection string                        |
| `AUTH_SECRET`                | Random string for session signing                    |
| `RESEND_API_KEY`             | Resend API key for transactional email               |
| `RESEND_FROM_EMAIL`          | Verified sender address                              |
| `RESEND_FROM_NAME`           | Display name on outgoing email                       |
| `NEXT_PUBLIC_MARKETING_URL`  | URL the RSVP app links back to (e.g. `http://localhost:3001`) |
| `NEXT_PUBLIC_RSVP_URL`       | URL the marketing app links to for RSVP              |

## Layout

```
divinelove26/
├── apps/
│   ├── marketing/          # public site (port 3001)
│   │   ├── app/            # routes: /, /story, /events, /gallery, /gifts
│   │   ├── components/
│   │   │   ├── scenes/     # hero, letter, desk, story, gallery, events, gift, rsvp
│   │   │   ├── sections/   # event-details, gallery, gift, footer, save-the-date, rsvp-cta
│   │   │   ├── props/      # envelope, polaroid, wax-seal, lace-doily, passport, …
│   │   │   └── ui/         # navbar, scene-backdrop, countdown-timer, background-music
│   │   └── public/         # /logo, /gallery (couple + prewedding), /video, /audio
│   └── rsvp/               # RSVP + admin (port 3002)
│       ├── app/
│       │   ├── page.tsx           # guest RSVP entry
│       │   └── admin/
│       │       ├── (auth)/login
│       │       └── (dashboard)/   # guests, validate (QR), team
│       └── features/auth/
└── packages/               # api, auth, db, email, env, tooling, ui
```

## Notes for the next maintainer

- The default admin password ships in seed code — rotate it before going live.
- Background music autoplay is gated by user interaction; the file lives in `apps/marketing/public/audio/`.
- The email package embeds binary assets at build time via `pnpm --filter @repo/email run assets:generate` — re-run after swapping the monogram or invitation image.
- QR check-in lives in `apps/rsvp/app/admin/(dashboard)/validate` and uses `@yudiel/react-qr-scanner`.
