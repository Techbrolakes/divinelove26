"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Upload, Plus } from "lucide-react";
import { useTRPC } from "@/lib/trpc";

const addGuestFormSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  partyName: z.string().optional(),
  maxPlusOnes: z.coerce.number().int().min(0).optional(),
});
type AddGuestForm = z.infer<typeof addGuestFormSchema>;

export default function GuestsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: guests, isLoading } = useQuery(
    trpc.admin.getGuests.queryOptions(),
  );

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.getGuests.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.admin.getStats.queryKey(),
    });
  };

  const deleteGuest = useMutation({
    ...trpc.admin.deleteGuest.mutationOptions(),
    onSuccess: () => {
      toast.success("Guest deleted");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const addGuest = useMutation({
    ...trpc.admin.addGuest.mutationOptions(),
    onSuccess: () => {
      toast.success("Guest added");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const importCsv = useMutation({
    ...trpc.admin.importGuestsFromCsv.mutationOptions(),
    onSuccess: (data) => {
      toast.success(`Imported ${data.count} guests`);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const [showAdd, setShowAdd] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddGuestForm>({
    resolver: zodResolver(addGuestFormSchema),
  });

  const onAdd = async (data: AddGuestForm) => {
    await addGuest.mutateAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || undefined,
      phone: data.phone || undefined,
      partyName: data.partyName || undefined,
      maxPlusOnes: data.maxPlusOnes ?? 0,
    });
    reset();
    setShowAdd(false);
  };

  const onCsvChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await importCsv.mutateAsync({ csvText: text });
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-semibold text-gray-900">Guests</h1>
          <p className="mt-1 text-[14px] text-gray-500">
            Manage your wedding guest list and see RSVP status.
          </p>
        </div>
        <div className="flex gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onCsvChange}
            />
          </label>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add guest
          </button>
        </div>
      </div>

      {showAdd && (
        <form
          onSubmit={handleSubmit(onAdd)}
          className="rounded-2xl border border-gray-200 p-6 grid gap-4 md:grid-cols-3"
        >
          <Field label="First name" error={errors.firstName?.message}>
            <input
              {...register("firstName")}
              className={inputClass}
              disabled={isSubmitting}
            />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <input
              {...register("lastName")}
              className={inputClass}
              disabled={isSubmitting}
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              className={inputClass}
              disabled={isSubmitting}
            />
          </Field>
          <Field label="Phone">
            <input
              {...register("phone")}
              className={inputClass}
              disabled={isSubmitting}
            />
          </Field>
          <Field label="Party name">
            <input
              {...register("partyName")}
              className={inputClass}
              disabled={isSubmitting}
            />
          </Field>
          <Field label="Max plus-ones">
            <input
              type="number"
              min={0}
              {...register("maxPlusOnes")}
              className={inputClass}
              disabled={isSubmitting}
            />
          </Field>
          <div className="md:col-span-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Save"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Party", "Contact", "Status", "Meal", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading guests...
                </td>
              </tr>
            )}
            {!isLoading && guests && guests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No guests yet. Add one or import a CSV.
                </td>
              </tr>
            )}
            {guests?.map((g) => {
              const rsvp = g.rsvp;
              const status = rsvp
                ? rsvp.attending
                  ? "Attending"
                  : "Declined"
                : "Pending";
              const statusClass = rsvp
                ? rsvp.attending
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
                : "bg-gray-100 text-gray-600";

              return (
                <tr key={g.id}>
                  <td className="px-4 py-3 text-[14px] text-gray-900">
                    {g.firstName} {g.lastName}
                  </td>
                  <td className="px-4 py-3 text-[14px] text-gray-600">
                    {g.partyName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">
                    {g.email || g.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${statusClass}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] capitalize text-gray-600">
                    {rsvp?.mealChoice ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${g.firstName} ${g.lastName}?`)) {
                          deleteGuest.mutate({ guestId: g.id });
                        }
                      }}
                      className="text-gray-400 hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[14px] text-gray-900 outline-none focus:border-gray-400";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-gray-600">{label}</label>
      {children}
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
