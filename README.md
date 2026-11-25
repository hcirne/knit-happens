# Knit Happens

Knit Happens is a web app for knitters. Users share their projects with the materials and stores they used, buy and sell patterns (payments are simulated), and find yarn stores. It is a team project for a university software engineering module.

**Stack:** Next.js 16 (App Router, JavaScript), Tailwind CSS 4, PostgreSQL 17 in Docker, Prisma 7, custom signed-cookie sessions with bcrypt-hashed passwords.

## Prerequisites

- Node.js 20.9 or newer
- Docker Desktop (it must be running)
- git
- curl (for the API demo)
- openssl (to generate the session secret)

## First-time setup

1. Clone the repository and open the folder in a terminal.
2. Create your local env file:
   ```bash
   cp .env.example .env
   ```
3. Generate a secret and paste it after `SESSION_SECRET=` in `.env`:
   ```bash
   openssl rand -base64 32
   ```
   In development the app uses a built-in fallback if `SESSION_SECRET` is empty, but you should set your own. It is **required** in production. Never commit `.env`.
4. Start PostgreSQL and wait until it is ready:
   ```bash
   docker compose up -d --wait
   ```
5. Install dependencies (this also runs `prisma generate`):
   ```bash
   npm install
   ```
6. Apply the database migrations:
   ```bash
   npx prisma migrate deploy
   ```
7. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
8. Start the app:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

**Prisma 7 note:** the migrate commands no longer regenerate the Prisma client. If you see the error `does not provide an export named 'PrismaClient'`, run `npx prisma generate`. After you edit `prisma/schema.prisma`, run `npx prisma migrate dev --name <change>` and then `npx prisma generate`.

## Demo: UC-01 Create an account (and User CRUD)

### 4a. In the browser

1. Open http://localhost:3000/register.
2. Basic flow: fill in email (for example `demo@example.com`), username (`knitter_demo`) and a password of at least 8 characters, then click **Create account**. The page shows "Account created" and "Welcome, knitter_demo! You can now log in."

Alternative flows (try them on the same form):

| Flow | What to enter | What you see |
|------|---------------|--------------|
| A1: invalid or incomplete data | An email without `@`, or an empty username | Banner "Please check your input." and under the field "Enter a valid email." or "Use 3 to 30 letters, numbers, dots, dashes or underscores." |
| A2: weak password | A password shorter than 8 characters | Banner "Please check your input." and under the password field "Use at least 8 characters." |
| A3: email already registered | Register `demo@example.com` a second time | Banner "This email is already registered. Try logging in." with a Log in link |

If the email is new but the username is taken, you see "This username is already taken." and under the username field "Choose another username."

You can also open http://localhost:3000/account to see the account page (view, edit and delete). It needs a session, so use it after logging in with curl (see the limitations below).

### 4b. With curl (register, log in, read, update, delete)

Run these in order from the project folder. `cookies.txt` is a cookie jar: curl stores the `kh_session` cookie there and sends it back on later requests. `-i` shows the status line and headers.

```bash
# 1. Create the account  (expect 201)
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","username":"knitter_demo","password":"yarn-and-needles"}'

# 2. Log in  (expect 200 and a Set-Cookie: kh_session=... header)
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"yarn-and-needles"}'

# 3. Who am I?  (expect 200 and {"user":{"id":"...","username":"knitter_demo"}})
curl -i -c cookies.txt -b cookies.txt http://localhost:3000/api/auth/me

# 4. Read the account  (expect 200: id, username, email, createdAt, never the password)
curl -i -c cookies.txt -b cookies.txt http://localhost:3000/api/users/me

# 5. Update the username  (expect 200 and "Account updated.")
curl -i -c cookies.txt -b cookies.txt -X PATCH http://localhost:3000/api/users/me \
  -H "Content-Type: application/json" \
  -d '{"username":"knitter_renamed"}'

# 6. Delete the account  (expect 200 and "Account deleted."; the session cookie is cleared)
curl -i -c cookies.txt -b cookies.txt -X DELETE http://localhost:3000/api/users/me \
  -H "Content-Type: application/json" \
  -d '{"password":"yarn-and-needles"}'

# 7. Read again  (expect 401 and "You need to log in.")
curl -i -c cookies.txt -b cookies.txt http://localhost:3000/api/users/me
```

When you are done: `rm cookies.txt`.

Errors come back as JSON: `{"error":"message"}`, plus `"fields":{"email":"..."}` when a specific field is wrong.

| Status | When | Message |
|--------|------|---------|
| 400 | Register: invalid email, username or password | "Please check your input." (with `fields`) |
| 400 | Log in: empty email or password | "Please fill in all fields." |
| 400 | Update: no `email` or `username` sent | "Nothing to update." |
| 400 | Delete: no password sent | "Enter your password to confirm." |
| 401 | Log in: wrong email or password (same message for both) | "Email or password is incorrect." |
| 401 | Read, update or delete without a session | "You need to log in." |
| 403 | Delete: wrong password | "Password is incorrect." |
| 409 | Register: email already used | "This email is already registered. Try logging in." |
| 409 | Register or update: username already used | "This username is already taken." |
| 409 | Update: email already used by someone else | "This email is already registered." |
| 409 | Delete: the user still has projects or comments | "Delete your projects and comments before deleting your account." |

The last 409 exists because the database schema uses `onDelete: Restrict` for project and comment authors, so an account cannot be removed while it owns content.

### 4c. Optional: look at the database

```bash
npx prisma studio
```

Open the `User` table. Passwords are stored only as bcrypt hashes (`passwordHash`), never as plain text.

## How login sessions work

When you log in, the server sets a cookie named `kh_session` with the value `userId.expiry.signature`. The signature is an HMAC-SHA256 of `userId.expiry` made with `SESSION_SECRET`, so nobody can change the user id or the expiry without the server noticing. The cookie is `httpOnly` (JavaScript in the browser cannot read it), `sameSite=lax`, and `secure` in production. It expires after 7 days. Logging out clears the cookie. A copy of the cookie stays valid until it expires, which is acceptable for this project. Passwords are hashed with bcrypt. The code is in `src/lib/auth.js`.

We deliberately do not use Auth.js. Our custom session is about 60 lines and easy to explain, and the Auth.js Credentials provider would not remove the need for our own registration code.

## Current limitations

- There is no `/login` page yet (UC-02 comes later). Log in with curl as shown in the demo. The `/register` and `/account` pages link to `/login`, which shows a 404 for now.
- The home page is still the Next.js starter page.
- The app runs locally only. Public deployment (Docker on a Linux server with GitHub Actions CI/CD) is planned for semester 2.

## Useful commands

```bash
npm run lint                # check the code style
docker compose logs -f db   # follow the database logs
docker compose down         # stop Postgres, keep the data
docker compose down -v      # stop Postgres and DELETE all data
```

To stop the app, press Ctrl+C in the terminal running `npm run dev`.

If port 5432 is already used on your machine, change `POSTGRES_PORT` and the port inside `DATABASE_URL` in `.env`, then run `docker compose up -d --wait` again.

## Project docs

- [`AGENTS.md`](AGENTS.md): team and agent conventions
- [`docs/W4_UseCases/`](docs/W4_UseCases/): the use cases (source of truth)
- [`docs/W4_UseCases/SoftwareRequirementsSpecification.md`](docs/W4_UseCases/SoftwareRequirementsSpecification.md): requirements
- [`docs/W3_UseCaseDiagram.png`](docs/W3_UseCaseDiagram.png): use case diagram
- [`docs/mockups/`](docs/mockups/): UI mockups
