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

export type GuestIdInput = z.infer<typeof guestIdSchema>;
export type ValidateCodeInput = z.infer<typeof validateCodeSchema>;
