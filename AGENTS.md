# AGENTS.md — Knit Happens

## Project
Knit Happens is a web app for knitters. Users share their projects with the materials and stores they used, buy and sell patterns (payments are simulated), and find yarn stores. It is desktop-first for now and will become a mobile app later. It is a team project for a university software engineering module.

## Stack (decided — do not suggest alternatives)
- **Framework:** Next.js (App Router), JavaScript only (no TypeScript)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL, run in Docker (`docker-compose.yml`), the same setup locally and in production
- **ORM:** Prisma, with every schema change made through Prisma migrations
- **Auth:** custom signed-cookie session in `src/lib/auth.js` (HMAC-SHA256 with `SESSION_SECRET`, httpOnly cookie, 7 days), email and password only, passwords hashed with bcrypt. No Auth.js.
- **Deployment (next semester):** Docker on a Linux server, with CI/CD in GitHub Actions

## Commands
```bash
cp .env.example .env          # first run only, then set SESSION_SECRET as described in it
docker compose up -d --wait   # start Postgres, wait until it accepts connections
npm install                   # also generates the Prisma client (postinstall)
npx prisma migrate dev        # apply migrations / create a new one
npm run dev                   # start the app at http://localhost:3000
npm run lint
```

After editing `prisma/schema.prisma`, run `npx prisma migrate dev` **and** `npx prisma generate`. In Prisma 7 the migrate command no longer regenerates the client, and a stale client fails with a misleading "does not provide an export named 'PrismaClient'".

## Use cases (current milestone)
| ID    | Use case                    |
|-------|-----------------------------|
| UC-01 | Create an account           |
| UC-02 | Log in                      |
| UC-03 | Explore projects            |
| UC-04 | Share project               |
| UC-05 | Comment on project          |

The use case documents in `docs/W4_UseCases/` are the source of truth for numbering, names and behaviour. If anything else disagrees with them (mockups, this file, the SRS), follow the use case document.

Work on one use case at a time. Don't change code that belongs to another use case.

## Shared code: ask before changing
The Prisma schema, the auth code (`src/lib/auth.js` and `src/app/api/auth/`), the root layout and the shared UI components are used by every use case. Before changing any of them, explain the change and wait for approval.

## Design
Follow the team mockups. Define the values below in the Tailwind theme instead of hard-coding them.

- **Colours:**
  - Pink `#EFC3CE`: buttons, highlights, link underlines
  - Peach `#F2CFB6`: warm accents, footers
  - Sage `#C6DBCA`: secondary panels, selected filters
  - Page background `#FCF3F5`; cards and header `#FFFFFF`
  - Text `#3F2C29`, secondary text `#5E4A45`
  - Borders `#EFE2E0`, input borders `#D9C6C3`
  - Errors: `#B42318` on `#FEF3F2`
- **Fonts:** Bricolage Grotesque for headings, DM Sans 16px for body text (load both with `next/font/google`)
- **Layout:** content max-width 1200px, 32px side padding, cards with a 16px radius, fully rounded buttons, spacing scale 4/8/16/24/48
- **States:** every page needs error and logged-out states

## Conventions
- Validate all input on the server, not only in the browser.
- Never log or return password hashes, and never commit `.env` files. Keep `.env.example` up to date.
- Keep changes small and focused, one task per branch.
- Put the YouTrack ticket ID at the start of commit messages and PR titles.
- Explain the plan before large changes. The team is learning, so prefer clear code over clever code.

## Scope
Knitting only. No real payments and no content moderation. The store map is a stretch goal, so don't build it unless asked.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
