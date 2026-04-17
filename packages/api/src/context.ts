import type { Database } from "@repo/db";
import type { User } from "@repo/db/schema";
import { validateSession } from "@repo/auth";

export interface Context {
  db: Database;
  user: User | null;
  sessionToken: string | null;
}

export async function createContext(
  db: Database,
  opts?: { headers?: Headers },
): Promise<Context> {
  const authHeader = opts?.headers?.get("authorization");
  const sessionToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  let user: User | null = null;

  if (sessionToken) {
    const result = await validateSession(db, sessionToken);
    if (result.valid && result.user) {
      user = result.user;
    }
  }

  return { db, user, sessionToken };
}
