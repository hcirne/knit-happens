# AGENTS.md — Knit Happens

## Project
Knit Happens is a web app for knitters. Users share their projects with the materials and stores they used, buy and sell patterns (payments are simulated), and find yarn stores. It is desktop-first for now and will become a mobile app later. It is a team project for a university software engineering module.

## Stack (decided — do not suggest alternatives)
- **Backend:** Spring Boot 4.2 (Java 21+, Maven wrapper `./mvnw`) in `backend/`. It owns the Model (JPA entities) and the Controller (Spring MVC REST controllers). No Lombok. DTOs are records, and controllers never return entities.
- **Frontend:** React (Vite, JavaScript only, React Router, plain CSS) in `frontend/`. It is the View only: no business rules, no database access.
- **Database:** PostgreSQL 17, run in Docker (`docker-compose.yml`), the same setup locally and in production
- **Persistence:** Spring Data JPA (Hibernate) with Flyway. Every schema change is a new `backend/src/main/resources/db/migration/V<n>__<name>.sql`. Never edit a migration that has been applied. `spring.jpa.hibernate.ddl-auto=validate`, so Hibernate never changes tables.
- **Auth:** Spring Security with a session cookie, BCrypt password hashing and CSRF protection. Email and password only.
- **Tests:** Cucumber-JVM (feature files in `docs/features/`) with Spring Boot Test, MockMvc and Testcontainers (PostgreSQL)
- **Deployment (next semester):** Docker on a Linux server, with CI/CD in GitHub Actions
- **Plan:** the rebuild plan is `docs/rebuild/REBUILD_PLAN.md`. `docs/rebuild/SETUP_ADJUSTMENTS.md` lists where the setup differs from it, and it wins over the plan.

## Where the MVC parts live
Spring Boot owns the architecture. Put every new class in the package for its role, under `backend/src/main/java/com/knithappens/`:

| MVC role | Location | Contents |
|---|---|---|
| **Model** | `model/` | JPA entities and enums with their own behaviour (e.g. `Project.addPhoto`) |
| **Model** | `repository/` | Spring Data JPA interfaces (data access) |
| **Model** | `service/` | Business rules, validation, transactions, `Limits` |
| **Controller** | `controller/` | `@RestController` classes: receive the request, call a service, return a DTO. No business rules. |
| **View** | `frontend/src/` | React pages and components that render the JSON. No business rules. |
| View boundary | `dto/` | Request and response records: exactly the data the View sends and receives |
| Cross-cutting | `exception/`, `security/`, `storage/` | Domain exceptions and their handler, Spring Security, photo storage |

The schema itself lives in `backend/src/main/resources/db/migration/`.

## Commands
```bash
cp .env.example .env                      # first run only (the backend reads this file too)
docker compose up -d --wait               # start Postgres, wait until it accepts connections
cd backend && ./mvnw spring-boot:run      # backend at http://localhost:8080 (Flyway runs on start)
cd backend && ./mvnw verify               # build and run all tests, including Cucumber
cd frontend && npm install                # first run only
cd frontend && npm run dev                # frontend at http://localhost:5173 (proxies /api to :8080)
cd frontend && npm run lint
cd frontend && npm run build
```

Cucumber scenarios tagged `@wip` (steps not written yet) or `@needs-empty-db` are skipped by the runner. Remove `@wip` from a feature when its steps are done.

## Use cases (current milestone)
| ID    | Use case                    |
|-------|-----------------------------|
| UC-01 | Create an account           |
| UC-02 | Log in                      |
| UC-03 | Explore projects            |
| UC-04 | Share project               |
| UC-05 | Comment on project          |

The use case documents in `docs/W4_UseCases/` are the source of truth for numbering, names and behaviour. If anything else disagrees with them (mockups, this file, the SRS, the rebuild plan), follow the use case document.

Each `.feature` file in `docs/features/` is the executable version of one use case document. It has one scenario per main or alternative flow, and it uses the exact user-facing messages from the spec. The two must never disagree. If they do, fix both in the same PR, and the use case document breaks the tie.

Work on one use case at a time. Don't change code that belongs to another use case.

## Shared code: ask before changing
The Flyway migrations, `SecurityConfig` and the auth code, the entities in `model/`, `GlobalExceptionHandler` (once it exists), `frontend/src/api/client.js`, `frontend/src/components/Layout.jsx` and `frontend/src/styles/` are used by every use case. Before changing any of them, explain the change and wait for approval.

## Design
Follow the team mockups. Define the values below as CSS custom properties in `frontend/src/styles/theme.css` instead of hard-coding them.

- **Colours:**
  - Pink `#EFC3CE`: buttons, highlights, link underlines
  - Peach `#F2CFB6`: warm accents, footers
  - Sage `#C6DBCA`: secondary panels, selected filters
  - Page background `#FCF3F5`; cards and header `#FFFFFF`
  - Text `#3F2C29`, secondary text `#5E4A45`
  - Borders `#EFE2E0`, input borders `#D9C6C3`
  - Errors: `#B42318` on `#FEF3F2`
- **Fonts:** Bricolage Grotesque for headings, DM Sans 16px for body text (loaded with the Google Fonts link in `frontend/index.html`)
- **Layout:** content max-width 1200px, 32px side padding, cards with a 16px radius, fully rounded buttons, spacing scale 4/8/16/24/48
- **States:** every page needs error and logged-out states

## Conventions
- Validate all input on the server, not only in the browser.
- Never log or return password hashes, and never commit `.env` files. Keep `.env.example` up to date.
- No Lombok. DTOs are records. Never return entities from controllers.
- Keep changes small and focused, one task per branch.
- Put the YouTrack ticket ID at the start of commit messages and PR titles.
- Explain the plan before large changes. The team is learning, so prefer clear code over clever code.

## Scope
Knitting only. No real payments and no content moderation. The store map is a stretch goal, so don't build it unless asked.
