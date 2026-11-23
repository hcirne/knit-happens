import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// The one Prisma client for the whole app. Always import this, never call
// `new PrismaClient()` anywhere else.
//
// In development Next.js reloads modules on every file save. A new client per
// reload would open a new pool of database connections each time, and after
// enough saves Postgres refuses to accept any more. Caching the client on
// globalThis survives those reloads. In production the module is loaded once,
// so the cache is not needed.

const globalForPrisma = globalThis;

function createPrismaClient() {
  // Prisma 7 requires a driver adapter. Plain `new PrismaClient()` throws
  // "A driver adapter is required to connect to your database".
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
