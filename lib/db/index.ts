import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> | null };
const connectionString = process.env.DATABASE_URL || "";

function createDb() {
  if (!connectionString) return null as unknown as ReturnType<typeof drizzle>;
  try {
    const sql = neon(connectionString);
    return drizzle(sql);
  } catch {
    return null as unknown as ReturnType<typeof drizzle>;
  }
}

export const db = globalForDb.db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export * from "./schema";