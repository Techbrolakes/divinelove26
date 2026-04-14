"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getStats() {
  const supabase = createAdminClient();

  const { data: guests } = await supabase
    .from("guests")
    .select("id", { count: "exact" });

  const { data: rsvps } = await supabase.from("rsvps").select("*");

  const attending = rsvps?.filter((r) => r.attending) || [];
  const declined = rsvps?.filter((r) => !r.attending) || [];
  const totalGuests = guests?.length || 0;
  const pending = totalGuests - (rsvps?.length || 0);

  const mealCounts: Record<string, number> = {};
  for (const r of attending) {
    if (r.meal_choice) {
      mealCounts[r.meal_choice] = (mealCounts[r.meal_choice] || 0) + 1;
    }
    if (r.plus_one_meal_choice) {
      mealCounts[r.plus_one_meal_choice] =
        (mealCounts[r.plus_one_meal_choice] || 0) + 1;
    }
  }

  return {
    total: totalGuests,
    attending: attending.length,
    declined: declined.length,
    pending,
    mealCounts,
  };
}

export async function getGuests() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("guests")
    .select("*, rsvps(*)")
    .order("last_name");

  if (error) throw error;
  return data;
}

export async function addGuest(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("guests").insert({
    first_name: formData.get("firstName") as string,
    last_name: formData.get("lastName") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    party_name: (formData.get("partyName") as string) || null,
    max_plus_ones: Number(formData.get("maxPlusOnes")) || 0,
  });

  if (error) throw error;
}

export async function deleteGuest(guestId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("guests").delete().eq("id", guestId);
  if (error) throw error;
}

export async function importGuestsFromCsv(csvText: string) {
  const supabase = createAdminClient();
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const guests = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return {
      first_name: row["first_name"] || row["firstname"] || "",
      last_name: row["last_name"] || row["lastname"] || "",
      email: row["email"] || null,
      phone: row["phone"] || null,
      party_name: row["party_name"] || row["partyname"] || null,
      max_plus_ones: Number(row["max_plus_ones"] || row["plusones"]) || 0,
    };
  });

  const { error } = await supabase.from("guests").insert(guests);
  if (error) throw error;
  return guests.length;
}

export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
