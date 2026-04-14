"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  guestLookupSchema,
  rsvpSchema,
  type Guest,
  type GuestLookupInput,
  type RsvpInput,
} from "@/lib/schemas";

export async function lookupGuest(
  data: GuestLookupInput
): Promise<{ guest: Guest | null; error?: string }> {
  const parsed = guestLookupSchema.safeParse(data);
  if (!parsed.success) {
    return { guest: null, error: "Please provide your full name." };
  }

  const supabase = createAdminClient();
  const { data: guest, error } = await supabase
    .from("guests")
    .select("id, first_name, last_name, party_name, max_plus_ones")
    .ilike("first_name", parsed.data.firstName)
    .ilike("last_name", parsed.data.lastName)
    .single();

  if (error || !guest) {
    return {
      guest: null,
      error:
        "We couldn't find your name on the guest list. Please check the spelling or contact us.",
    };
  }

  return { guest };
}

export async function submitRsvp(
  data: RsvpInput
): Promise<{ success: boolean; error?: string }> {
  const parsed = rsvpSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid RSVP data." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("rsvps").upsert(
    {
      guest_id: parsed.data.guestId,
      attending: parsed.data.attending,
      meal_choice: parsed.data.mealChoice || null,
      dietary_restrictions: parsed.data.dietaryRestrictions || null,
      plus_one_name: parsed.data.plusOneName || null,
      plus_one_meal_choice: parsed.data.plusOneMealChoice || null,
      plus_one_dietary: parsed.data.plusOneDietary || null,
      notes: parsed.data.notes || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "guest_id" }
  );

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
