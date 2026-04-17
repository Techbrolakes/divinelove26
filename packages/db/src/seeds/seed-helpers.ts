import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schema/index";

export function createSeedDb() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });
  return { db, client };
}

export async function runSeed(name: string, fn: () => Promise<void>) {
  console.log(`Running ${name} seed...`);
  try {
    await fn();
    console.log(`${name} seed completed`);
  } catch (err) {
    console.error(`${name} seed failed:`, err);
    process.exit(1);
  }
}
