-- V1: initial schema for Knit Happens (users, projects, photos, comments).
-- Flyway applies this file once. Never edit it after it has been applied:
-- add a new V2__..., V3__... file for every later schema change.

-- The table is called "users" because "user" is a reserved word in PostgreSQL.
CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  username      VARCHAR(30)  NOT NULL UNIQUE,
  email         VARCHAR(254) NOT NULL UNIQUE,   -- stored lowercase by the application
  password_hash VARCHAR(100) NOT NULL,          -- BCrypt hash, never the password
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id          BIGSERIAL PRIMARY KEY,
  title       VARCHAR(100)  NOT NULL,
  description VARCHAR(2000) NOT NULL,
  category    VARCHAR(20)   NOT NULL
              CHECK (category IN ('SWEATERS','HATS','SOCKS','SHAWLS','BLANKETS')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  -- RESTRICT: a user who still owns projects cannot be deleted.
  author_id   BIGINT        NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);
-- The feed shows the newest projects first.
CREATE INDEX idx_projects_created_at ON projects (created_at DESC);

CREATE TABLE photos (
  id         BIGSERIAL PRIMARY KEY,
  file_name  VARCHAR(100) NOT NULL,   -- generated name; the file itself lives in knit.upload-dir
  position   INT          NOT NULL,   -- order of the photos inside a project
  -- CASCADE: photos belong to a project and disappear with it.
  project_id BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX idx_photos_project ON photos (project_id);

CREATE TABLE comments (
  id         BIGSERIAL PRIMARY KEY,
  body       VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  -- CASCADE: comments disappear with their project.
  project_id BIGINT       NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  -- RESTRICT: a user who still has comments cannot be deleted.
  author_id  BIGINT       NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX idx_comments_project_created ON comments (project_id, created_at);
