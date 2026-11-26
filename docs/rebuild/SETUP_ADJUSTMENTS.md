# Setup adjustments to the rebuild plan

This file covers Phase 0 and Phase 1 of [REBUILD_PLAN.md](REBUILD_PLAN.md), done on 2026-11-26 on branch `rebuild-setup`. It lists every place where the setup differs from the plan, and why. **Where this file and the plan disagree, this file wins.** Section 5 records the decisions on the open questions; only the limits still wait for the team.

## 1. Versions (checked against start.spring.io, Maven Central and npm on 2026-11-26)

| Component | Plan said | Used | Why |
|---|---|---|---|
| Spring Boot | 3.x, not 4.x | **4.2.0** | start.spring.io only offers 4.0, 4.1 and 4.2 now, because 3.x is end of life. The plan chose 3.x for Cucumber compatibility, and that reason is gone: Cucumber 8.1.0 is built against Spring 7, which is what Boot 4 uses. |
| Java | JDK 21, otherwise 17 | **Target 21** (`<java.version>21</java.version>`) | Anyone with JDK 21 or newer can build. It also compiles on JDK 26. |
| Cucumber | one `cucumber-bom` | **cucumber-bom 8.1.0** | Latest release. |
| Spring Framework / Security / Hibernate | – | 7.1.0 / 7.2.0 / 7.4.15 | Managed by Boot 4.2.0. |
| JUnit | – | Jupiter/Platform 6.1.3 | Managed by Boot. |
| Testcontainers | – | 2.0.5 (`testcontainers-postgresql`) | The artifact names changed in Testcontainers 2. |
| Flyway / PostgreSQL driver | – | 12.11.0 / 42.7.14 | Managed by Boot. |
| Vite / React | – | Vite 8.4.0, React 19.3.1 | Current create-vite template (9.4.0). |
| React Router | `react-router-dom` | **`react-router` 8.5.3** | Since v7, `react-router-dom` is merged into `react-router`. Imports come from `"react-router"`. |

**Boot 4 changes that matter when you copy code from tutorials:**
- Starters are now split by module: `spring-boot-starter-webmvc`, `spring-boot-starter-flyway`, and matching `*-test` starters.
- `@AutoConfigureMockMvc` now lives in `org.springframework.boot.webmvc.test.autoconfigure`.
- Most Spring Boot 3 tutorials still apply otherwise. Check the import paths, though.

## 2. Structure and code

| Topic | Plan | What we did | Why |
|---|---|---|---|
| Paths | `docs/usecases/…`, `features/*.feature` | `docs/W4_UseCases/…`, `docs/features/*.feature` | Those are the real paths. The plan's paths, plus `features/step_definitions/*.mjs` and `cucumber.mjs`, don't exist on any branch. |
| Feature files | Copy into `backend/src/test/resources/features/` | **Kept in `docs/features/` only.** The pom adds that folder to the test classpath under `features/`. | One copy, so they can't drift apart, and the links in the use case specs keep working. |
| `@wip` | For scenarios not implemented yet | Each of the 5 feature files now has `@wip` above `Feature:` | Cucumber fails undefined steps, so every feature is skipped until it has steps. Remove the tag when a feature's steps are done. |
| Smoke test | – | `backend/src/test/resources/features/smoke/health.feature` + `steps/HealthSteps` | Proves that Cucumber, Spring, MockMvc and Testcontainers work together before any use case steps exist. |
| Migration | SQL from Section 6 | Same SQL, **plus `idx_photos_project` on `photos(project_id)`** | The old Prisma schema had this index and the plan's SQL dropped it. Without it, loading a project's photos scans the whole table. |
| `application.properties` | As in Section 5 | Same, plus `spring.config.import=optional:file:../.env[.properties]`, and the port comes from `POSTGRES_PORT` | The backend reads the same `.env` as docker-compose, so the credentials live in one place. |
| `SecurityConfig` | Phase 3 | A **placeholder** in `security/`: `GET /api/health` is public, everything else returns 401, with no form login and no HTTP basic | Spring Security locks every endpoint by default, which would make the health check fail. Phase 3 (Fabian) replaces this class. |
| `TestcontainersConfiguration` | – | Made `public`, image `postgres:17-alpine` | It's shared with the `steps` package and uses the same Postgres version as docker-compose. The generator's default was `postgres:latest`. |
| Frontend CSS | Plain CSS | `styles/theme.css` (design tokens as CSS variables), `base.css`, `layout.css` | Follows the plan. AGENTS.md now says CSS variables, not a Tailwind theme. |
| Fonts | – | Google Fonts `<link>` in `frontend/index.html` | `next/font` is gone, and this needs no npm package. |
| Frontend extras | – | `api/client.js` (`ApiError`, CSRF header, FormData-safe), `Layout.jsx`, `HomePage` (calls `/api/health`, with loading and error states), `NotFoundPage` | Covers the Phase 1 "done when". `AuthContext` waits for Phase 3. |
| Old components | Move reusable ones | **Not moved** | `RegisterForm` and `AccountForm` were Tailwind and called the old API, so they would be rewritten anyway. They're kept on `archive/nextjs-prototype` for reference in Phase 6. |

**Removed:** `src/`, `prisma/`, `scripts/` (the old Prisma-based diagram generators), `public/`, the root `package.json` and lockfile, `eslint.config.mjs`, `next.config.mjs`, `jsconfig.json` and `prisma7.config.mjs`. Nothing is lost: the branch **`archive/nextjs-prototype`** points at the last Next.js commit on `main`.

**Updated for the new stack:** `AGENTS.md` (stack, commands, shared code, design; the Next.js block is removed), `README.md` (setup), `.env.example` (`DATABASE_URL` and `SESSION_SECRET` removed, `UPLOAD_DIR=./uploads` relative to `backend/`), `.gitignore`, the comments in `docker-compose.yml`, and the local Claude skills `run` and `implement-uc`.

**Not updated yet (Phase 8):** `docs/architecture/*` (still the Next.js version) and the SRS tech-stack line.

## 3. Things each teammate needs to know

1. **Reset your local database once.** Old Next.js volumes contain Prisma tables, and Flyway refuses to start on a non-empty schema without its history table. Run `docker compose down -v`, then `docker compose up -d --wait`. This deletes your local data.
2. **Node 22.22 or newer** is needed, because React Router 8 requires it (Vite alone needs 20.19+). If someone can't upgrade, pin `react-router@7`.
3. **JDK 21 or newer.**
4. **OrbStack users:** Testcontainers looks for Docker at `/var/run/docker.sock`. If `./mvnw verify` says it can't find Docker, either:
   - run `DOCKER_HOST=unix://$HOME/.orbstack/run/docker.sock ./mvnw verify`, or
   - add `docker.host=unix:///Users/<you>/.orbstack/run/docker.sock` to `~/.testcontainers.properties`.

   Docker Desktop users shouldn't need this.

## 4. Verified on 2026-11-26

- `./mvnw verify`: BUILD SUCCESS. 17 tests ran: the context test and the Cucumber smoke scenario passed, and 15 `@wip` scenarios were skipped. Flyway applied V1 on a PostgreSQL 17 Testcontainer.
- `./mvnw spring-boot:run`: Flyway applied V1 to the docker-compose database, giving `users`, `projects`, `photos`, `comments` and `flyway_schema_history`. `/api/health` returns `{"status":"ok"}` and any other path returns 401.
- `npm run lint` and `npm run build` pass. Through the Vite proxy, `localhost:5173/api/health` returns `{"status":"ok"}`.
- Not checked yet: the home page in a real browser.

## 5. Decisions on the open questions (Henrique, 2026-11-26)

1. **Source of truth: the use case documents.** This replaces the rule in plan Section 8 that the `.feature` file wins.
   - The use case document in `docs/W4_UseCases/` defines the behaviour.
   - Each `.feature` file in `docs/features/` is its executable version: one scenario per main or alternative flow (A1, A2, …).
   - The step definitions and the code follow the feature.
   - The two files must never disagree. A mismatch is a bug, fixed in **both** files in the same PR, and the use case document breaks the tie.
   - Why: this gives the chain spec → feature → automated test → code. The specs and the SRS are what gets graded as the requirements, and Cucumber checks that the code matches them.
2. **Error messages go in the specs and in the features.** Each message from plan Section 8 is added to its use case document. The `.feature` step uses the exact same string, so the Cucumber tests check it. Do this per use case, when its steps are written.
3. **User CRUD: dropped.** It isn't one of the five use cases. For the midterm, UC-04 Share project counts as the CRUD use case. The old code is still on `archive/nextjs-prototype`.
4. **Diagrams: generated by tools,** so they can be re-run after every change.
   - Class diagram: a PlantUML generator Maven plugin, grouped by package/layer.
   - EER: SchemaSpy via Docker, from the live database.
   - Both are set up in Phase 8.
5. **Limits (plan Section 7): still waiting for the team.** They stay proposals until the Phase 0 team meeting. After that, update the `tbd` items in the use case specs and the `Limits` class.
