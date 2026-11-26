# Knit Happens

Knit Happens is a web app for knitters. Users share their projects with the materials and stores they used, buy and sell patterns (payments are simulated), and find yarn stores. It is a team project for a university software engineering module.

**Stack:** Spring Boot 4.2 (Java, Maven) backend with Spring Data JPA, Flyway and Spring Security; React (Vite, plain CSS) frontend; PostgreSQL 17 in Docker; Cucumber-JVM tests with Testcontainers.

**Rebuild status:** the app was a Next.js prototype and is being rebuilt on Spring Boot and React (plan: [`docs/rebuild/REBUILD_PLAN.md`](docs/rebuild/REBUILD_PLAN.md), adjustments: [`docs/rebuild/SETUP_ADJUSTMENTS.md`](docs/rebuild/SETUP_ADJUSTMENTS.md)). The old prototype is kept in the branch `archive/nextjs-prototype`. Right now only the skeletons exist: the database schema, `GET /api/health`, and a React page that calls it. The use case endpoints and pages are rebuilt in the next phases.

## Prerequisites

- JDK 21 or newer (the Maven wrapper `./mvnw` downloads Maven itself)
- Docker (it must be running; it also runs the tests' database)
- Node.js 22.22 or newer with npm (needed by React Router 8; Vite itself needs Node 20.19+)
- git

## First-time setup

1. Clone the repository and open the folder in a terminal.
2. Create your local env file. Both Docker Compose and the backend read it. Never commit `.env`.
   ```bash
   cp .env.example .env
   ```
3. Start PostgreSQL and wait until it is ready:
   ```bash
   docker compose up -d --wait
   ```
   **Do you still have the database of the old Next.js version?** Reset it once with `docker compose down -v`, then run the command above again. Flyway needs an empty schema and would stop on the old Prisma tables.
4. Start the backend (Flyway creates the tables on the first start):
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   Check it: http://localhost:8080/api/health shows `{"status":"ok"}`.
5. In a second terminal, start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open http://localhost:5173. The page should say "Backend is running." The dev server forwards `/api` requests to the backend on port 8080.

## Tests

```bash
cd backend
./mvnw verify
```

This runs the Spring Boot tests and the Cucumber scenarios against a real PostgreSQL started by Testcontainers, so Docker must be running. The report is written to `backend/target/cucumber-report.html`. The feature files are in [`docs/features/`](docs/features/). Scenarios tagged `@wip` have no step definitions yet and are skipped.

For the frontend: `npm run lint` and `npm run build` (in `frontend/`).

## Useful commands

```bash
docker compose logs -f db   # follow the database logs
docker compose down         # stop Postgres, keep the data
docker compose down -v      # stop Postgres and DELETE all data
```

To stop the backend or the frontend, press Ctrl+C in its terminal.

If port 5432 is already used on your machine, change `POSTGRES_PORT` in `.env` and run `docker compose up -d --wait` again. The backend reads the same value.

## Current limitations

- Only the health endpoint and the skeleton pages exist. Registration, login, projects and comments come with the next phases.
- The app runs locally only. Public deployment (Docker on a Linux server with GitHub Actions CI/CD) is planned for semester 2.

## Project docs

- [`AGENTS.md`](AGENTS.md): team and agent conventions
- [`docs/rebuild/REBUILD_PLAN.md`](docs/rebuild/REBUILD_PLAN.md): the rebuild plan
- [`docs/W4_UseCases/`](docs/W4_UseCases/): the use cases (source of truth)
- [`docs/W4_UseCases/SoftwareRequirementsSpecification.md`](docs/W4_UseCases/SoftwareRequirementsSpecification.md): requirements
- [`docs/features/`](docs/features/): Gherkin feature files
- [`docs/W3_UseCaseDiagram.png`](docs/W3_UseCaseDiagram.png): use case diagram
- [`docs/architecture/Architecture.md`](docs/architecture/Architecture.md): software architecture document (describes the old Next.js version until it is regenerated)
- [`docs/mockups/`](docs/mockups/): UI mockups
