import { drizzle } from "drizzle-orm/node-postgres";
import { getConnectionString } from "@netlify/database";
import { Pool } from "pg";

// Prefer an explicit DATABASE_URL (local Postgres), otherwise use Netlify Database.
const databaseUrl = process.env.DATABASE_URL || getConnectionString();

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
