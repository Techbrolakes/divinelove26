import { z } from "zod";

export const guestLookupSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
});

export type GuestLookupInput = z.infer<typeof guestLookupSchema>;

export const rsvpSchema = z.object({
  guestId: z.string().uuid(),
  attending: z.boolean(),
  mealChoice: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  plusOneName: z.string().optional(),
  plusOneMealChoice: z.string().optional(),
  plusOneDietary: z.string().optional(),
  notes: z.string().optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  party_name: string | null;
  max_plus_ones: number;
};
