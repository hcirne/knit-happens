# KNIT HAPPENS: Rebuild Plan v2 (Java + Spring Boot backend, React frontend)

> This is the team plan as written by a teammate on 2026-11-26. It is kept as it was written. Where the setup had to deviate from it (versions, paths, small fixes), see [SETUP_ADJUSTMENTS.md](SETUP_ADJUSTMENTS.md). **Where the two disagree, SETUP_ADJUSTMENTS.md wins.**

> **How to use this document with an AI model**
> 1. Give the AI this whole file, plus these project files as attachments: `docs/usecases/use-case-specifications.md`, all `features/*.feature`, `prisma/schema.prisma`, `docker-compose.yml`, `.env.example`, `AGENTS.md`, and the existing React pages if you want to reuse them.
> 2. Ask for **one phase at a time** (Section 14), for example: "Do Phase 2 of the plan. Show every file in full."
> 3. After each phase, run the checks in that phase's *Definition of done* and paste any errors back.
> 4. If anything contradicts the use case specifications, ask the team before guessing.
> 5. Do not invent library versions. Check them on start.spring.io, Maven Central and npm, and say which versions you used.
> 6. At the end of every answer, list what you assumed or could not verify.

---

## 1. Situation

- **Team:** KNIT HAPPENS (3 students, 3rd semester, dual study Computer Science). Course: Software Engineering. Roles: Fabian = Integrator and Architect, Henrique = Systems Analyst and Architect, Mariana = Project Manager and Process Engineer.
- **Product:** A web platform for knitters. Semester 1 scope: five use cases (Section 8).
- **Problem:** Our current code is a Next.js app with Prisma (JavaScript on both the server and the browser). The lecturer said the course needs an **object-oriented architectural framework** (PHP, Python, Java, Ruby). We must rebuild.
- **Our original, approved stack** (first blog post, "Our threads and kneedles"): React for the frontend, **Java + Spring Boot + Maven** for the backend, PostgreSQL, Docker, GitHub Actions. We deviated from it with Next.js to save time. We now return to it.
- **Lecturer feedback (Nov 26):**
  1. One framework should cover the whole MVC architecture. **Agreed reading:** Spring Boot is that framework (Model and Controller), and React is a *library* that renders the View. The lecturer treats React as a library, and students in the previous year used the same combination.
  2. OOP is a grading criterion, and it applies to the architectural framework too.
  3. The next blog post must reflect on the AI mistake of this week.
  4. The next blog post must include the retrospective.
- **Deadline:** The midterm presentation is in about **one week**. The midterm must show:
  - understanding of the business need (vision, 5 use cases, SRS)
  - the project method (sprints, iterative process)
  - a demo of 2 to 3 use cases (login does not count, a CRUD use case counts as one)
  - architecture: MVC or equivalent
  - version control, plus IDE and sprint integration
  - **automated Cucumber tests for at least 2 use cases**
  - class diagram and EER diagram
  - keep coding and TDD with `.feature` files

## 2. Decisions

| Topic | Decision | Reason |
|---|---|---|
| Backend language | **Java** (JDK 21 if installed, otherwise 17) | Object-oriented, strongly typed, approved in week 1. |
| Backend framework | **Spring Boot 3.x** (latest stable 3.x from start.spring.io, **not** a release candidate or 4.x) | Spring MVC owns the Model and the Controller. Avoids version trouble with Cucumber. |
| Frontend | **React** (JavaScript, built with **Vite**), React Router, plain CSS | Approved in week 1. **Not Next.js**: Next.js has its own server layer and would compete with Spring for the controller role. |
| Role of React | **View only.** It renders data from the API and sends user input back. No business rules, no database access. | Keeps MVC with Spring as the owner of Model and Controller. |
| Database | **PostgreSQL 17** in Docker (existing `docker-compose.yml`) | Already set up. |
| Persistence | **Spring Data JPA** (Hibernate) + **Flyway** migrations | Entities are classes (OO). Migrations keep the "no manual table changes" rule. |
| Security | **Spring Security**: session cookie, BCrypt, CSRF protection | Standard and documented. |
| Tests | **Cucumber-JVM** + Spring Boot Test + MockMvc + **Testcontainers** (PostgreSQL) | Reuses the `.feature` files and runs against a real PostgreSQL. |
| Build | **Maven** (backend), **npm** (frontend) | |
| Photos | Files on disk in `UPLOAD_DIR`, only the file name in the database | Same as before. |

**How this meets "one framework covers the MVC":** Spring Boot is the one framework and provides the Model (JPA entities) and the Controller (Spring MVC). React is a library that only renders the View. The lecturer accepts this combination. Use these exact terms in the architecture document and the slides.

## 3. What we keep and what we throw away

**Keep (unchanged or nearly):**
- `docs/usecases/*`: specifications, wireframes, activity diagrams, use case diagram
- `features/*.feature`: Gherkin files. Step wording may change slightly (see Section 12).
- `docker-compose.yml` and `.env.example`
- The data model: `prisma/schema.prisma` becomes SQL and JPA entities (Section 6).
- The design mock-up and the UI kit
- **React components and CSS from the current app** where they are plain React: move them into the new Vite project. Replace anything Next-specific (`next/link`, `next/image`, server components, `src/app/api/**` route handlers).
- Blog, YouTrack board, role split

**Discard (rebuild in Java):**
- `src/app/api/**` and `src/lib/*.js` (server logic: auth, uploads, validation)
- `prisma/`, `prisma7.config.mjs`
- `features/step_definitions/*.mjs`, `cucumber.mjs`
- Next.js itself (routing, server rendering)

Move the old code into a branch called `archive/nextjs-prototype` first, so nothing is lost.

## 4. Target architecture

```
Browser (React = View)  --JSON over HTTP-->  Controller  ->  Service  ->  Repository  ->  PostgreSQL
                                             (Spring MVC)    (rules)       (Spring Data JPA)
                                             + DTOs         + Entities (Model)
```

| Layer | Responsibility | Examples |
|---|---|---|
| **Model** | Entities, enums, domain exceptions | `User`, `Project`, `Photo`, `Comment`, `Category` |
| **View** | React library: components and pages (separate folder `frontend/`) | `FeedPage`, `ProjectPage`, `SharePage`, `LoginPage`, `RegisterPage` |
| **Controller** | REST controllers: receive requests, call services, return JSON. No business rules. | `AuthController`, `ProjectController`, `CommentController`, `PhotoController` |
| **Service** | Business rules, validation, transactions | `UserService`, `ProjectService`, `CommentService` |
| **Repository** | Data access via Spring Data interfaces | `UserRepository`, `ProjectRepository` |
| **Infrastructure** | Photo storage, security configuration | `PhotoStorage` (interface), `LocalPhotoStorage` |

**Object-oriented design (this is a grading criterion, so make it visible in code and in the class diagram):**
- **Encapsulation and a rich domain model:** entities have private fields and behavior, not only getters and setters. Examples: `Project.addPhoto(Photo)` enforces the maximum of 5 photos, `Comment` checks its own length in its constructor or factory method, `User` never exposes its password hash. Avoid Lombok so the code is explicit.
- **Abstraction and polymorphism:** `PhotoStorage` is an **interface**. `LocalPhotoStorage` implements it. A different implementation could replace it without changing the services.
- **Dependency injection:** services receive repositories and storage through the constructor.
- **Domain exceptions:** `EmailAlreadyUsedException`, `UsernameAlreadyUsedException`, `ProjectNotFoundException`, `InvalidPhotoException`, `ValidationException`, handled in one `@RestControllerAdvice`.
- **DTOs:** request and response objects as Java `record`s (for example `RegisterRequest`, `ProjectSummary`, `ProjectDetails`) so entities are never returned directly.
- **Name the concepts** in the Software Architecture Document and the slides: encapsulation, abstraction, polymorphism, dependency injection, separation of concerns.

**Backend package layout** (base package `com.knithappens`):

```
backend/src/main/java/com/knithappens/
  KnitHappensApplication.java
  model/        User, Project, Photo, Comment, Category
  repository/   UserRepository, ProjectRepository, CommentRepository
  service/      UserService, ProjectService, CommentService, Limits
  controller/   AuthController, ProjectController, CommentController, PhotoController
  dto/          request and response records
  storage/      PhotoStorage (interface), LocalPhotoStorage, ImageType
  security/     SecurityConfig, KnitUserDetails, KnitUserDetailsService
  exception/    domain exceptions, GlobalExceptionHandler
backend/src/main/resources/
  application.properties
  db/migration/V1__initial_schema.sql
backend/src/test/java/com/knithappens/
  CucumberTest.java, steps/, support/
backend/src/test/resources/features/   (the .feature files)

frontend/
  package.json, vite.config.js, index.html
  src/ main.jsx, App.jsx, api/ (fetch helpers), pages/, components/, styles/
```

Monorepo with two folders (`backend/`, `frontend/`) next to `docs/`, `features/` (or move the features into the backend test resources and link from the specs).

## 5. Setup

**Backend:** start.spring.io, Maven, Java 17 or 21, Spring Boot 3.x (stable), group `com.knithappens`, artifact `knit-happens`. Dependencies: Spring Web, Spring Data JPA, Validation, Spring Security, PostgreSQL Driver, Flyway Migration, Testcontainers, PostgreSQL Testcontainers, Spring Security Test. Add by hand: `cucumber-java`, `cucumber-spring`, `cucumber-junit-platform-engine`, `junit-platform-suite` (one consistent version via `cucumber-bom`; check it works with the chosen Spring Boot version).

`application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/${POSTGRES_DB:knit_happens}
spring.datasource.username=${POSTGRES_USER:knit}
spring.datasource.password=${POSTGRES_PASSWORD:knit_local_dev}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
spring.flyway.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=30MB
server.servlet.session.timeout=7d
knit.upload-dir=${UPLOAD_DIR:./uploads}
```

`ddl-auto=validate`: Hibernate never changes tables. Only Flyway does.

**Frontend:** `npm create vite@latest frontend -- --template react` (JavaScript). Add `react-router-dom`. In `vite.config.js` set a **dev proxy** so that `/api` goes to `http://localhost:8080`. Then the browser sees one origin, cookies and CSRF work without CORS.

**Run (development):** `docker compose up -d`, then in `backend/`: `./mvnw spring-boot:run`, and in `frontend/`: `npm run dev` (opens `http://localhost:5173`).

**`.gitignore`:** `target/`, `node_modules/`, `uploads/`, `.env`, IDE folders. Remove the old `SESSION_SECRET` (Spring manages the session).

**Production-like run for the demo (optional, only if time allows):** `npm run build` in `frontend/` and copy `dist/` into `backend/src/main/resources/static/`, so one `java -jar` serves both. Otherwise demo with the two dev servers.

## 6. Data model

Same model as the Prisma schema, as SQL for Flyway (`V1__initial_schema.sql`):

```sql
CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  username      VARCHAR(30)  NOT NULL UNIQUE,
  email         VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id          BIGSERIAL PRIMARY KEY,
  title       VARCHAR(100)  NOT NULL,
  description VARCHAR(2000) NOT NULL,
  category    VARCHAR(20)   NOT NULL
              CHECK (category IN ('SWEATERS','HATS','SOCKS','SHAWLS','BLANKETS')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  author_id   BIGINT        NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX idx_projects_created_at ON projects (created_at DESC);

CREATE TABLE photos (
  id         BIGSERIAL PRIMARY KEY,
  file_name  VARCHAR(100) NOT NULL,
  position   INT          NOT NULL,
  project_id BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id         BIGSERIAL PRIMARY KEY,
  body       VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  project_id BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id  BIGINT       NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX idx_comments_project_created ON comments (project_id, created_at);
```

**Entities:** `User`, `Project`, `Photo`, `Comment` (JPA `@Entity`), and `Category` as an enum with `@Enumerated(EnumType.STRING)`. Relations: `User 1—n Project`, `Project 1—n Photo` (ordered by `position`), `Project 1—n Comment` (ordered by `created_at`), `User 1—n Comment`. Use `FetchType.LAZY`, and avoid N+1 queries on the feed (for example with `@EntityGraph` or a join fetch for the first photo). Emails are stored **lowercase**.

## 7. Business rules (decisions for the former *tbd* items)

Keep these in **one place**: the class `Limits` in the `service` package. The use case specs must be updated to match.

| Rule | Value |
|---|---|
| Email | valid format, at most 254 characters, unique, stored lowercase |
| Username | 3 to 30 characters, letters, digits, `.`, `_`, `-`, unique |
| Password | at least 8 characters, stored as a BCrypt hash |
| Project title | required, at most 100 characters |
| Project description | required, at most 2000 characters |
| Category | required, one of Sweaters, Hats, Socks, Shawls, Blankets |
| Photos | at least 1, at most 5, each at most 5 MB, JPG, PNG or WebP |
| Comment | required, trimmed, at most 500 characters, plain text (React escapes text by default; never use `dangerouslySetInnerHTML`) |
| Feed | newest first, 50 projects per page (`?page=`), optional `?category=` filter |
| Session | 7 days |
| Failed logins | no lockout in this version (state this as a known limitation) |

These are proposals. The team confirms them in a short meeting.

## 8. Use cases and the API contract

All messages are the exact strings used in the Gherkin features. If a `.feature` file differs from this document, **the `.feature` file is the source of truth**.

**Error format (all endpoints):** `{ "error": "message", "fields": { "email": "message" } }` (`fields` only for validation errors). Status codes: 400 invalid input, 401 not logged in or wrong credentials, 404 not found, 409 conflict (already registered).

### UC1: Create account (CRUD: Create)
- **API:** `POST /api/auth/register` with `{ email, username, password }`. Success: `201 { "message": "Account created successfully.", "user": { id, username } }`.
- **A1 invalid data:** `400` with `fields`: "Enter a valid email.", "Enter a username.", "Username may contain letters, digits, ., _ and -."
- **A2 weak password:** `400`, `fields.password`: "Use at least 8 characters."
- **A3 email already registered:** `409`, "This email is already registered. Try logging in."
- Duplicate **username**: `409` with a clear message.
- **React:** `/register` form, field errors under the inputs, on success redirect to `/login` and show the message.

### UC2: Log in (does not count for the demo)
- **API:** `POST /api/auth/login` with `{ email, password }` → `200 { user }` and a session cookie. `POST /api/auth/logout` → `204`. `GET /api/auth/me` → `200 { user }` or `401` (the React app calls it on load to know the login state).
- **A1 empty field:** `400` with `fields`.
- **A2 wrong credentials:** `401`, one generic message, **"Email or password is incorrect."** It must not reveal whether the email exists.
- **A3 already logged in:** the React login page redirects to `/`.

### UC3: Explore projects (CRUD: Read, public)
- **API:** `GET /api/projects?category=HATS&page=0` → list of `{ id, title, category, creator, photoUrl, createdAt }`, newest first, 50 per page. `GET /api/projects/{id}` → `{ id, title, description, category, creator, createdAt, photos: [url], comments: [{ id, body, author, createdAt }] }`.
- **A1 no projects:** the API returns an empty list, and React shows "No projects yet. Be the first to share one."
- **A2 project missing:** `404`, "This project is no longer available." React shows the message with a link back to the feed.
- **A3 visitor wants to interact:** a visitor sees "Log in or create an account to comment." with links instead of the comment form.

### UC4: Share project (CRUD: Create, login required)
- **API:** `POST /api/projects` as `multipart/form-data` with `title`, `description`, `category` and `photos` (one to five files). Success: `201 { "message": "Project shared successfully.", "project": { id, ... } }`.
- **Not logged in:** `401`, "Please log in first." React redirects to `/login`.
- **Flow:** validate the fields, validate each photo, save the project and photo rows in **one transaction**, write the files.
- **A1 missing field:** `400` with `fields`. React keeps the entered values.
- **A2 invalid photo:** `400`, for example "Photos must be JPG, PNG or WebP and at most 5 MB each.", "Add at least one photo.", "At most 5 photos." **Nothing is saved**, and files already written for this request are deleted.
- **A3 cancel:** a "Cancel" button in React. Nothing is sent.
- Photos are checked by their **first bytes** (JPG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF....WEBP`), not by file extension or the browser's content type.

### UC5: Comment on project (CRUD: Create, login required)
- **API:** `POST /api/projects/{id}/comments` with `{ body }` → `201 { id, body, author, createdAt }`.
- **Not logged in:** `401`.
- **A1 invalid comment:** `400`, "Write a comment (max. 500 characters)."
- **A2 project removed:** `404`, "This project no longer exists."

### Photo delivery
- `GET /api/uploads/{fileName}`: a controller (not a public folder) that reads from `knit.upload-dir`, sets the content type, rejects names containing `/`, `\` or `..` (path traversal), and returns 404 if the file is missing.
- File names are generated on the server (UUID plus the extension of the **detected** type). Never use the uploaded name.

## 9. Security checklist
- BCrypt via Spring Security's `PasswordEncoder` bean.
- **Session login for a React app:** implement `POST /api/auth/login` with the `AuthenticationManager`, store the security context in the HTTP session, and return JSON (no redirect). Return `401` JSON (not a redirect to a login page) for unauthenticated API calls.
- **CSRF stays on.** Use Spring Security's documented setup for single-page apps (`CookieCsrfTokenRepository.withHttpOnlyFalse()` with the SPA request handler). React reads the `XSRF-TOKEN` cookie and sends it as the `X-XSRF-TOKEN` header on every `POST`. If this blocks the team for more than half a day, the documented fallback is to disable CSRF and rely on `SameSite=Lax` cookies plus JSON-only endpoints, with the trade-off explained in the architecture document.
- Allowed without login: `GET /api/projects/**`, `GET /api/uploads/**`, `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`. Everything else needs login.
- Session cookie: `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- Never log passwords. Return no stack traces. Use the unified error format.
- In React, render user text as normal text. Never use `dangerouslySetInnerHTML`.

## 10. Frontend (React as the View)
- Pages and routes: `/` feed, `/projects/:id`, `/projects/new` (login required), `/register`, `/login`.
- A shared layout component (header with logo, links, login state, logout; footer). An `AuthContext` that loads `/api/auth/me` once and exposes the current user.
- One small API helper (`api/client.js`) that wraps `fetch` with `credentials: 'include'`, the CSRF header, JSON handling and the unified error format.
- Follow the mock-up and the UI kit (colors, typography). Responsive layout, readable on a phone.
- Accessible forms: labels linked to inputs, visible error messages, alt text on photos (the project title).
- The View contains **no business rules**. It may show simple hints (for example the character counter), but the server always decides.

## 11. Dev workflow
- Branches: `main` (always runs), `feature/<uc>-<short-name>`. Pull requests with at least one review. Merge only if `./mvnw verify` passes (and `npm run build` for the frontend).
- Commit messages include the YouTrack id, for example `KH-12 Add registration endpoint`.
- Update `AGENTS.md` and `CLAUDE.md` to the new stack (Java, Spring Boot backend, React/Vite frontend, Cucumber-JVM). Keep the rule "ask before changing schema, security config or shared components".
- README: setup in a few commands (`cp .env.example .env`, `docker compose up -d`, start backend, start frontend, run tests).

## 12. Testing with Cucumber-JVM

- Copy `features/*.feature` to `backend/src/test/resources/features/`. Link them from the use case specifications as before.
- **Runner:** a JUnit Platform Suite class `CucumberTest` with `@Suite`, `@IncludeEngines("cucumber")`, `@SelectClasspathResource("features")`, glue package `com.knithappens.steps`.
- **Spring integration:** `@CucumberContextConfiguration` with `@SpringBootTest` and `@AutoConfigureMockMvc`.
- **Database:** Testcontainers PostgreSQL (`postgres:17-alpine`) with `@ServiceConnection`, so Flyway runs on a real PostgreSQL. (Fallback: the docker-compose database with a separate `knit_test` database.)
- **Step definitions** call the real controllers with `MockMvc` (JSON in and out) and check status codes, the `message` and `error` strings, and the database. A `MockHttpSession` keeps the logged-in state between steps. This is close to how the old JavaScript steps worked, so porting them is straightforward.
- **Isolation:** each scenario uses unique data (random suffix in email and username), or the database is cleaned in `@Before`.
- **Keep the tags:** `@wip` for scenarios not implemented yet, `@needs-empty-db` for the empty-feed scenario. Run with `cucumber.filter.tags = not @wip and not @needs-empty-db`.
- **Priority for the midterm:** **UC1 (Create account)** and **UC4 (Share project)** green first. Then UC3 and UC5. UC2 is a helper for the logged-in steps.
- **TDD proof for the lecturer:** show the feature file first, then a red test, then a green test (screenshots or a short recording).
- **IDE proof:** a screenshot of a `.feature` file in IntelliJ (Cucumber for Java plugin) or VS Code, showing highlighting and autocomplete.
- Add a few plain **JUnit unit tests** for the domain and services (limits, photo type detection, `Project.addPhoto`). They are fast and show the pattern below the API.

## 13. Diagrams and documents (required for the midterm)
- **Class diagram:** from the real backend code (grouped by layer: model, service, controller, storage). Light background and a large font, so it is readable. Show the OO relationships (interface `PhotoStorage` and its implementation, entity associations).
- **EER diagram:** from the Flyway SQL (four tables, keys, cardinalities, `ON DELETE` rules).
- **Software Architecture Document (short):** layers, package structure, a component diagram (React, Spring Boot, PostgreSQL), the technology decisions, the OO concepts, and **why we changed stack** and how Spring Boot covers the MVC.
- **Update the SRS and use case specs:** the stack, the decided limits, category and up to 5 photos for UC4.

## 14. Work plan

The midterm is in about 7 days. Suggested owners can be swapped. After Phase 1, three people can work in parallel.

### Phase 0: Decide and prepare (Day 1, 2 hours)
- **Mariana:** send the message to the lecturer (Section 19). Create a YouTrack epic "Rebuild: Spring Boot + React" with one story per phase. Mark the old Next.js tasks as obsolete.
- **All:** 15-minute team meeting to confirm Sections 2 and 7.
- **Fabian:** create `archive/nextjs-prototype`, then a branch for the rebuild.
- **Done when:** decisions are written down, and the lecturer's answer is known (or the defaults are used).

### Phase 1: Skeletons (Day 1 to 2)
- **Fabian (backend):** Spring Boot project, dependencies, `application.properties`, Flyway `V1`, `GET /api/health`. Verify with `./mvnw spring-boot:run`.
- **Mariana (frontend):** Vite React project, router, layout, API helper, dev proxy, move over reusable components and CSS from the Next.js app.
- **Done when:** the database starts, Flyway has created the four tables, the backend answers on `/api/health`, and the React app shows a page that calls it through the proxy.

### Phase 2: Domain and persistence (Day 2 to 3, Henrique)
- Entities (with behavior), enum, repositories, `Limits`, domain exceptions, `GlobalExceptionHandler`, repository tests with Testcontainers.
- **Done when:** a test saves and loads a user, a project with photos and a comment.

### Phase 3: Accounts and security (Day 2 to 4, Fabian)
- `SecurityConfig`, `KnitUserDetailsService`, `UserService`, `AuthController` (register, login, logout, me), CSRF setup for the SPA.
- **Done when:** register, login, logout and `me` work with a session cookie in the browser (through the dev proxy), the generic login error appears, and protected endpoints return 401 JSON when logged out.

### Phase 4: Projects and photos (Day 3 to 5, Henrique)
- `PhotoStorage` and `LocalPhotoStorage`, `ProjectService`, `ProjectController`, `PhotoController` (UC3 and UC4), including the category filter, paging and photo cleanup on failure.
- **Done when:** a logged-in user can share a project with 2 photos through the API, it appears in the feed, the details endpoint returns photos in order, and invalid photos are rejected without saving anything.

### Phase 5: Comments (Day 4 to 5, Henrique or Fabian)
- `CommentService`, `CommentController`.
- **Done when:** a logged-in user can comment, a visitor gets 401, and the comment appears in the project details.

### Phase 6: React pages (Day 3 to 6, Mariana, with help from Fabian on login)
- `RegisterPage`, `LoginPage`, `FeedPage` (with category filter and empty state), `ProjectPage` (details and comments, comment form for logged-in users), `SharePage` (multipart form with photo previews), header with login state.
- Build each page when the matching API is ready. Until then, use fixed example data.
- **Done when:** the whole demo flow in Section 15 works in the browser.

### Phase 7: Cucumber tests (Day 3 to 6, Mariana with AI help, reviewed by Fabian)
- Runner, Spring and Testcontainers config, steps for UC1 and UC4 first, then UC3 and UC5, then UC2.
- **Done when:** `./mvnw verify` runs the scenarios against a real PostgreSQL, UC1 and UC4 pass completely, and anything not done yet is tagged `@wip` and listed honestly.

### Phase 8: Diagrams, documents, blog, slides (Day 4 to 7, all)
- Class diagram, EER diagram, architecture document, updated SRS and specs, updated `AGENTS.md`, the blog post (Section 17), midterm slides.
- **Done when:** every midterm item in Section 15 has a link or screenshot.

### Phase 9: Rehearsal (Day 7)
- Run the demo twice from a fresh clone, on the machine used for the presentation. Fix only blocking problems. Record a backup video.

## 15. Midterm checklist and demo script

| Requirement | Evidence |
|---|---|
| Business need: vision, 5 use cases, SRS | Slide with the vision, use case diagram, link to the SRS |
| Method: sprints, iterative process | YouTrack board, burn-down, the story of this rebuild as an iteration |
| Demo of 2 to 3 use cases | **Share project (UC4)**, **Explore projects (UC3)**, and **Comment (UC5)** if time allows. Registration is the entry step, and login does not count. |
| Architecture MVC or equivalent | Layer diagram: Spring Boot = one framework for Model (JPA entities) and Controller (Spring MVC), React library = View |
| OOP | Class diagram and the named OO concepts |
| Version control + IDE/sprint integration | GitHub PRs with YouTrack ids, IDE screenshot |
| Automated Cucumber tests for 2 UCs | `./mvnw verify` live or recorded, report, feature files in the IDE |
| Class diagram and EER | Section 13 |
| Keep coding, TDD | Feature first, red, then green |

**Demo script (about 5 minutes):**
1. Start from a clean state (`docker compose down -v`, `docker compose up -d`, start backend and frontend).
2. As a visitor: open the empty feed (empty-state message).
3. Register and log in (quick, not counted).
4. Share a project with two photos. Show one invalid photo error.
5. Show the project in the feed, filter by category, open its detail page.
6. Comment on the project. Log out and show that a visitor cannot comment.
7. Run `./mvnw verify` (or show the recorded run) and open the Cucumber report.

## 16. Risks and scope cuts

| Risk | Mitigation |
|---|---|
| Not enough time | Cut in this order: category filter, multiple photos (keep 1), UC5, UI polish. **Never cut** UC1, UC3, UC4 and the Cucumber tests for two of them. |
| Login with CSRF in a React app is fiddly | Use the SPA setup from the Spring Security docs. Timebox it to half a day, then use the fallback in Section 9. |
| Version conflicts (Spring Boot, Cucumber) | Latest stable Spring Boot 3.x and one `cucumber-bom`. Fix the versions in the pom. |
| Team knows Java less than JavaScript | Pair on Phase 1 and 3. Use AI for scaffolding, but a teammate must read and explain every class. |
| Docker or Testcontainers problems | Fallback: docker-compose database with a separate `knit_test` database. |
| AI-generated code nobody understands | Rule: nobody merges code they cannot explain. |

## 17. Process and blog updates
- **YouTrack:** one epic "Rebuild", one story per phase, subtasks by layer. The work is re-estimated, so say that on the board.
- **Next blog post, required by the lecturer:**
  1. **Reflection on the AI mistake.** We chose a stack and built a lot on it (with AI help) without checking it against the course's grading criteria. The AI built what we asked for, but nobody asked "does this meet the course requirements?" Lesson: check the requirements first, and treat AI output as a draft that the team verifies.
  2. **The retrospective** (what went well, what did not, what we change).
  3. **The stack change**, honestly: from Java and Spring Boot with React (week 1) to Next.js and Prisma, and back to Spring Boot with React. What we keep, what it cost.
  4. **AI declaration.**
- **Fix the tech stack post:** the table still says Jira. Replace it with YouTrack.

## 18. Prompts you can give the AI (one per phase)

> **Phase 1 (backend):** "Using the plan, create the Spring Boot 3.x Maven project skeleton in `backend/`: pom.xml, application.properties, Flyway V1 migration, a health endpoint. Show every file in full and the exact commands to run. State all versions."
>
> **Phase 1 (frontend):** "Create the Vite React (JavaScript) project in `frontend/` with React Router, a layout component, an API helper with credentials and CSRF handling, and a dev proxy to the backend, as in Sections 5 and 10."
>
> **Phase 2:** "Create the JPA entities (with behavior, as in Section 4), the Category enum, repositories, Limits, domain exceptions and GlobalExceptionHandler. Add repository tests with Testcontainers."
>
> **Phase 3:** "Implement the auth API (register, login, logout, me) with Spring Security for a React single-page app, including the CSRF setup, using the exact messages in Section 8."
>
> **Phase 4:** "Implement PhotoStorage, LocalPhotoStorage, ProjectService, ProjectController and PhotoController for UC3 and UC4 as in Section 8, including magic-byte validation and cleanup of files when saving fails."
>
> **Phase 5:** "Implement UC5 (comments) as in Section 8."
>
> **Phase 6:** "Build the React pages listed in Phase 6 against the API contract in Section 8. Reuse the attached components where possible."
>
> **Phase 7:** "Write the Cucumber-JVM runner, Spring and Testcontainers configuration, and step definitions for the attached feature files using MockMvc. Adapt step wording only where needed and tell me what you changed in each `.feature` file."
>
> **Phase 8:** "Write a PlantUML class diagram (grouped by layer) and an EER diagram from the code and SQL I paste, and a short Software Architecture Document explaining how Spring Boot covers the MVC and which OO concepts we use."

## 19. Short confirmation message to the lecturer (optional, for the record)

> Hello [name],
>
> To confirm our understanding: we rebuild the application with **Java and Spring Boot** as the MVC framework (Spring MVC controllers, Spring Data JPA model, PostgreSQL), with **React** as the library that renders the views, and **Cucumber-JVM** for the automated tests. This is the stack from our first post. Is that fine for the midterm?
>
> Thank you and best regards,
> Team KNIT HAPPENS
