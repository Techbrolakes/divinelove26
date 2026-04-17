import { eq } from "drizzle-orm";
import { users } from "../schema/index";
import bcrypt from "bcryptjs";
import { createSeedDb, runSeed } from "./seed-helpers";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "password123";
const ADMIN_FIRST_NAME = "Admin";
const ADMIN_LAST_NAME = "User";

const { db, client } = createSeedDb();

runSeed("admin", async () => {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, ADMIN_EMAIL),
  });

  if (existing) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
    await client.end();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await db.insert(users).values({
    email: ADMIN_EMAIL,
    passwordHash,
    firstName: ADMIN_FIRST_NAME,
    lastName: ADMIN_LAST_NAME,
    role: "admin",
    isEmailVerified: true,
  });

  console.log("Default admin user created:");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  Role:     admin`);

  await client.end();
});
