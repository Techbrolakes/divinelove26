"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2, ShieldCheck, UserPlus2, Users } from "lucide-react";
import { useTRPC } from "@/lib/trpc";
import { useAdminMe } from "@/features/auth/use-auth";

const formSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  firstName: z.string().trim().min(1, "Required"),
  lastName: z.string().trim().min(1, "Required"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .max(128, "Too long"),
});
type FormData = z.infer<typeof formSchema>;

export default function TeamPage() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: me } = useAdminMe();
  const [showPassword, setShowPassword] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const adminsQuery = useQuery(trpc.admin.listAdmins.queryOptions());
  const adminsKey = trpc.admin.listAdmins.queryKey();

  const createAdmin = useMutation(
    trpc.admin.createAdmin.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: adminsKey });
        reset();
        toast.success("Admin account created");
      },
      onError: (err) => {
        toast.error(err.message || "Couldn't create admin");
      },
    }),
  );

  const deleteAdmin = useMutation(
    trpc.admin.deleteAdmin.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: adminsKey });
        setPendingDeleteId(null);
        toast.success("Admin removed");
      },
      onError: (err) => {
        toast.error(err.message || "Couldn't remove admin");
      },
    }),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", firstName: "", lastName: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    await createAdmin.mutateAsync(data);
  };

  const admins = adminsQuery.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gray-500">
          Administration
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-sans text-[28px] md:text-[32px] font-medium text-royal-dark leading-none tracking-tight">
            Team
          </h1>
          <p className="font-sans text-[13px] text-gray-500 max-w-md">
            Add admin accounts. New admins can sign in immediately with the
            credentials you set here.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        {/* Add admin card */}
        <div className="overflow-hidden rounded-xl border border-royal-100 bg-white shadow-[0_1px_2px_rgba(11,61,145,0.04)]">
          <div className="flex items-center gap-3 border-b border-royal-100 bg-gradient-to-r from-royal-50 via-royal-50/80 to-royal-50 px-5 py-3.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-royal ring-1 ring-royal-100">
              <UserPlus2 className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-sans text-[13px] font-semibold text-royal-dark leading-tight">
                Add an admin
              </p>
              <p className="font-sans text-[11.5px] text-gray-500">
                They&apos;ll be able to sign in right away.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 p-5 md:p-6"
          >
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="First name"
                error={errors.firstName?.message}
              >
                <input
                  type="text"
                  autoComplete="given-name"
                  className={inputClass}
                  disabled={isSubmitting}
                  {...register("firstName")}
                />
              </Field>
              <Field label="Last name" error={errors.lastName?.message}>
                <input
                  type="text"
                  autoComplete="family-name"
                  className={inputClass}
                  disabled={isSubmitting}
                  {...register("lastName")}
                />
              </Field>
            </div>

            <Field label="Email" error={errors.email?.message}>
              <input
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                className={inputClass}
                disabled={isSubmitting}
                {...register("email")}
              />
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-royal transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-md bg-royal py-2.5 font-sans text-[12px] font-semibold text-white transition-colors hover:bg-royal-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating…" : "Create admin"}
            </button>
          </form>
        </div>

        {/* Admins list */}
        <div className="overflow-hidden rounded-xl border border-royal-100 bg-white shadow-[0_1px_2px_rgba(11,61,145,0.04)]">
          <div className="flex items-center justify-between border-b border-royal-100 bg-gradient-to-r from-royal-50 via-royal-50/80 to-royal-50 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-royal ring-1 ring-royal-100">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-sans text-[13px] font-semibold text-royal-dark leading-tight">
                  Active admins
                </p>
                <p className="font-sans text-[11.5px] text-gray-500">
                  Anyone here can sign in to the dashboard.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 font-sans text-[11px] font-semibold tabular-nums text-royal-dark ring-1 ring-royal-100">
              {admins.length}
            </span>
          </div>

          {adminsQuery.isLoading ? (
            <div className="px-5 py-10 text-center">
              <p className="font-sans text-sm text-gray-400">Loading…</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-royal-50 text-royal/60">
                <Users className="h-4 w-4" />
              </div>
              <p className="font-sans text-[13.5px] font-semibold text-gray-700">
                No admins yet
              </p>
              <p className="mt-1 font-sans text-[12px] text-gray-400">
                Use the form on the left to add the first one.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {admins.map((a) => {
                const isMe = me?.id === a.id;
                const initials =
                  `${a.firstName[0] ?? ""}${a.lastName[0] ?? ""}`.toUpperCase();
                const created = new Date(a.createdAt).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" },
                );
                const isPending = pendingDeleteId === a.id;
                const isDeleting =
                  deleteAdmin.isPending &&
                  deleteAdmin.variables?.adminId === a.id;

                return (
                  <li
                    key={a.id}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-royal-50/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-royal to-royal-dark text-[12px] font-semibold text-white ring-2 ring-white shadow-[0_2px_6px_rgba(11,61,145,0.18)]">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-sans text-[13.5px] font-semibold text-gray-900 truncate">
                          {a.firstName} {a.lastName}
                        </p>
                        {isMe && (
                          <span className="inline-flex rounded-full bg-royal-50 px-2 py-0.5 font-sans text-[9.5px] font-semibold tracking-[0.18em] uppercase text-royal-dark ring-1 ring-inset ring-royal-100">
                            You
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 font-sans text-[12px] text-gray-500 truncate">
                        {a.email}{" "}
                        <span className="text-gray-300">·</span> added{" "}
                        <span className="tabular-nums">{created}</span>
                      </p>
                    </div>
                    {!isMe && !isPending && (
                      <button
                        onClick={() => setPendingDeleteId(a.id)}
                        className="cursor-pointer rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${a.firstName}`}
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {!isMe && isPending && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setPendingDeleteId(null)}
                          disabled={isDeleting}
                          className="cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-1.5 font-sans text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            deleteAdmin.mutate({ adminId: a.id })
                          }
                          disabled={isDeleting}
                          className="cursor-pointer rounded-md bg-red-600 px-3 py-1.5 font-sans text-[11px] font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-sans text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:border-royal/40 focus:ring-2 focus:ring-royal-50 transition-colors disabled:opacity-50";

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
    <div>
      <label className="block font-sans text-[11px] font-semibold text-gray-600 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 font-sans text-[11.5px] text-red-600">{error}</p>
      )}
    </div>
  );
}
