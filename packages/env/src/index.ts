import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isLint = process.env.npm_lifecycle_event === "lint";
const isCI = !!process.env.CI;
const skipExplicit = !!process.env.SKIP_ENV_VALIDATION;

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    DATABASE_URL: z.string().min(1),
    AUTH_SECRET: z.string().min(1),

    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.string().email(),
    RESEND_FROM_NAME: z.string().min(1).default("Divine Love 26"),
  },
  client: {
    NEXT_PUBLIC_MARKETING_URL: z.string().url().optional(),
    NEXT_PUBLIC_RSVP_URL: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL,
    NEXT_PUBLIC_RSVP_URL: process.env.NEXT_PUBLIC_RSVP_URL,
  },
  skipValidation: isCI || isLint || skipExplicit,
});
