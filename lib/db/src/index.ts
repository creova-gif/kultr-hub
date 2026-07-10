import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// An unbounded pool means every API instance can open unlimited connections —
// under autoscale, a handful of instances during a ticket-release surge can
// exhaust the database's max_connections and take the whole platform down.
// DB_POOL_MAX is per-instance; keep (instance count × DB_POOL_MAX) comfortably
// under the database's connection limit.
const poolMax = Number(process.env.DB_POOL_MAX ?? 10);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number.isFinite(poolMax) && poolMax > 0 ? poolMax : 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  // Most managed Postgres (Railway, Neon, Supabase, RDS) requires TLS for
  // external connections. Set PGSSLMODE=disable for a local/dev DB that
  // doesn't support it.
  ssl:
    process.env.PGSSLMODE === "disable"
      ? undefined
      : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  // An idle client emitting a background error (e.g. connection dropped by
  // the server) would otherwise crash the process with an unhandled 'error'
  // event — pg requires a listener here even though we don't act on it.
  console.error("Unexpected Postgres pool error", err);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
