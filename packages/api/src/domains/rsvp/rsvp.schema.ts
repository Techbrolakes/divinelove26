import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").trim(),
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
