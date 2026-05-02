import { z } from "zod";

export const guestIdSchema = z.object({
  guestId: z.string().uuid(),
});

export const validateCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export const createAdminSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const adminIdSchema = z.object({
  adminId: z.string().uuid(),
});

export type GuestIdInput = z.infer<typeof guestIdSchema>;
export type ValidateCodeInput = z.infer<typeof validateCodeSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type AdminIdInput = z.infer<typeof adminIdSchema>;
