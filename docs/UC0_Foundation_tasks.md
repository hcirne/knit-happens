# UC0: Foundation — task list

Shared groundwork for the December delivery. Nothing here implements a use case; the
goal is that whoever picks up UC-01 next can write a page without touching shared files.

Everything in this list falls under the "ask before changing" rule in `AGENTS.md`
(Prisma schema, Auth.js config, root layout, shared UI components).

## Dependency order

```
UC0-1 ──► UC0-2 ──► UC0-6 ──► UC0-7
UC0-3 ──► UC0-4 ──► UC0-5
UC0-8, UC0-9, UC0-10  (independent, any time)
```

The two chains are independent, so two people can work in parallel: one on
database/auth, one on theme/layout/components.

## Decisions already taken

- **Photo storage:** files on disk, path in the database. No bytes in Postgres, no
  external bucket.
- **Schema scope:** a `category` field on Project (shown in the Share form and the
  Explore filter chips). No `Like` model for now — heart counts in the mockups are
  not part of any December use case.
- **Use case numbering:** follow the use-case documents — Explore = UC-03,
  Share = UC-04. `AGENTS.md` and the two mockup filenames get corrected to match.

## Stack notes that affect these tasks

- **Prisma's `latest` tag is currently a release candidate** (`8.0.0-rc.35`) while
  `@prisma/client` latest is `7.10.1`. Pin both to `7.10.1`. Prisma 7 also changed
  generator/output conventions compared to the v5-era tutorials found online.
- **Middleware is called Proxy in Next.js 16** (`proxy.js`, not `middleware.ts`). We
  are not using it: the Next docs state Proxy is not a session-management solution,
  and bcrypt cannot run there. Route protection happens in server components and
  server actions via `auth()`.
- **`next-auth@beta` (5.0.0-beta.32)** declares support for Next 16. It is a beta;
  v4 is not an option as it predates the App Router patterns we need.
- **Async request APIs are mandatory in Next 16.** `cookies()`, `headers()`, `params`
  and `searchParams` are all promises — the Next 15 synchronous fallback is gone.
  This is the most likely thing to break copied tutorial code.
- **`bcryptjs` over `bcrypt`**: same hashing, pure JavaScript, no `node-gyp` native
  build — which matters once this goes into a Docker image next semester.
- **`zod`** for server-side validation schemas, since five separate forms need
  "validate all input on the server" and hand-rolled validators will drift.

---

## UC0-1 · Postgres in Docker and environment config

`docker-compose.yml` with a pinned Postgres image and a named volume for data.
`.env.example` with `DATABASE_URL` and `AUTH_SECRET`. Fix `.gitignore`, where the
`.env*` rule currently also ignores `.env.example` itself.

**Done when:** `docker compose up -d` gives a reachable database on a fresh clone, and
no real `.env` is tracked.

## UC0-2 · Prisma setup and initial schema

Pin `prisma@7.10.1` and `@prisma/client@7.10.1`. Models: `User` (username, email
unique, passwordHash, createdAt), `Project` (title, description, category, author,
createdAt), `Photo` (project, path, position), `Comment` (project, author, body,
createdAt). `Category` as an enum. Photos store a path only.

Add `src/lib/prisma.js` as a singleton — without it, dev hot-reload opens a new
connection pool on every edit and exhausts Postgres.

**Done when:** `npx prisma migrate dev` applies cleanly from an empty database and the
committed migration is reviewable.

## UC0-3 · Tailwind theme tokens and fonts

Brand colours, 16px radius, 4/8/16/24/48 spacing scale and the 1200px container into
`@theme` in `globals.css`. Tailwind 4 is CSS-configured — there is no
`tailwind.config.js` to create.

Bricolage Grotesque and DM Sans via `next/font/google`. Delete the Geist fonts and the
`prefers-color-scheme` dark block from the boilerplate: the mockups are light-only, and
leaving it in means every new component silently inherits a dark variant nobody
designed.

**Done when:** no brand hex value appears outside `globals.css`.

## UC0-4 · Root layout, Header, Footer

Real `metadata` (currently still "Create Next App"). Header: wordmark with the pink
underline, "Explore projects" nav, and both states from the mockups — logged-out shows
Log in / Sign up, logged-in shows Share project / avatar. Peach footer. A `Container`
component for the 1200px / 32px side padding rule.

**Done when:** the header renders both states correctly, driven by session, on every page.

## UC0-5 · Shared UI components

`Button` (pink primary, sage secondary, white outline), `Input`, `Textarea`, `Select`,
`FieldError`, `Card`, `Avatar` (initials, as in the mockups), `EmptyState`,
`ErrorState`.

The last two cover the `AGENTS.md` rule that every page needs error and logged-out
states, and UC-03's empty-feed alternative flow.

**Done when:** each component is used once in a scratch page proving it matches the mockup.

## UC0-6 · Auth.js configuration

`next-auth@beta`, Credentials provider, JWT session strategy, bcryptjs. `src/auth.js`
exporting `handlers` / `auth` / `signIn` / `signOut`, route handler at
`src/app/api/auth/[...nextauth]/route.js`, and a `requireUser()` helper for server
actions. Explicitly no `proxy.js`.

**Not** the login or signup pages — those belong to UC-02 and UC-01.

**Done when:** a seeded user can be authenticated through a server action and `auth()`
returns the session, never including `passwordHash`.

## UC0-7 · Seed script and placeholder photos

Seed the users, projects and comments from the mockups (maren.knits, jonas.twists,
ana.lace, nordknit, lena.designs) plus the gingham placeholder images. Without this,
Explore is empty and nobody can develop UC-03 or UC-05 against anything.

**Done when:** `npx prisma db seed` produces a feed matching the Explore mockup.

## UC0-8 · Resolve the use case numbering conflict

Correct the table in `AGENTS.md` to Explore = UC-03 / Share = UC-04, and rename the two
mockup files to match. Also fix SRS §3.6, which still names "React, Java with Spring
Boot and Maven" as the assumed stack.

**Done when:** one numbering appears everywhere.

## UC0-9 · Decide and record the `tbd` limits

The mockups ship literal `[N]` placeholders and the use cases say *tbd* for: minimum
password length, maximum photos per project, allowed photo formats and maximum file
size, maximum comment length, feed page size, and session lifetime.

These block UC-01, UC-04 and UC-05 — server-side validation cannot be written without
numbers. Needs a team decision, then recording in the SRS and `AGENTS.md`.

**Done when:** every `[N]` has a number.

## UC0-10 · Housekeeping

Delete the boilerplate `page.js` and the unused `public/*.svg`. Rewrite the
create-next-app README with the real setup steps. Commit the `nextjs-agent-rules` block
in `AGENTS.md` rather than fighting it — `next dev` re-adds it on every run, so an
uncommitted diff will otherwise haunt every branch.

---

## Not in UC0

The **landing page** in the mockups (`Landing (visitor home).png`) does not belong to
any use case and is not covered here. Decide whether it needs its own ticket.
