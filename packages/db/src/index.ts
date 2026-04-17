import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@repo/env";
import * as schema from "./schema/index";

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    const client = postgres(env.DATABASE_URL);
    _db = drizzle(client, { schema });
  }
  return _db;
}

export type Database = ReturnType<typeof getDb>;
