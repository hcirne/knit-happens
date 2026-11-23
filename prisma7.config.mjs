// Prisma CLI configuration.
//
// Two things here differ from most Prisma tutorials, because Prisma 7 changed them:
//
//  1. Prisma no longer reads .env by itself. Without the dotenv import below,
//     `npx prisma migrate dev` cannot find DATABASE_URL and fails.
//  2. The connection URL lives here instead of in the `datasource` block of
//     prisma/schema.prisma.
//
// This file is only used by the Prisma CLI. The Next.js app loads .env on its own.
//
// The filename contains the major version on purpose — that is the name Prisma 7
// looks for.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
