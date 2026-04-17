import { z } from "zod";

export const addGuestSchema = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),
  email: z.string().email().optional().or(z.literal("")).transform((v) => v || undefined),
  phone: z.string().optional(),
  partyName: z.string().optional(),
  maxPlusOnes: z.number().int().min(0).default(0),
});

export type AddGuestInput = z.infer<typeof addGuestSchema>;

export const deleteGuestSchema = z.object({
  guestId: z.string().uuid(),
});

export const importCsvSchema = z.object({
  csvText: z.string().min(1),
});
