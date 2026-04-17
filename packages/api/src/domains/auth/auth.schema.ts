import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email().toLowerCase(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  email: z.string().email().toLowerCase(),
});
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100)
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100)
    .optional(),
  phoneNumber: z.string().max(20).optional().nullable(),
  avatar: z.string().url("Invalid avatar URL").optional().nullable(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
