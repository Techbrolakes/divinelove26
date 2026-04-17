"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { z } from "zod";
import { useTRPC } from "@/lib/trpc";
import { MEAL_OPTIONS } from "@/lib/constants";
import ConfettiEffect from "@/components/ui/ConfettiEffect";

const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL || "/";

const guestLookupSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
});
type GuestLookupInput = z.infer<typeof guestLookupSchema>;

const rsvpSchema = z.object({
  guestId: z.string().uuid(),
  attending: z.boolean(),
  mealChoice: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  plusOneName: z.string().optional(),
  plusOneMealChoice: z.string().optional(),
  plusOneDietary: z.string().optional(),
  notes: z.string().optional(),
});
type RsvpInput = z.infer<typeof rsvpSchema>;

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  partyName: string | null;
  maxPlusOnes: number | null;
};

type Step = "lookup" | "form" | "success";

const inputClass =
  "w-full px-4 py-3.5 bg-royal-50/40 border border-royal-100/60 rounded-lg font-sans text-sm text-royal-700 placeholder:text-warm-400/70 focus:outline-none focus:border-royal-300 focus:ring-2 focus:ring-royal-100 focus:bg-white transition-all duration-300";

export default function RsvpPage() {
  const [step, setStep] = useState<Step>("lookup");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <section className="relative min-h-screen py-20 md:py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-royal via-royal-dark to-[#041d4a]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/logo/monogram-white-on-blue.jpeg"
          alt=""
          width={400}
          height={400}
          className="w-[350px] h-[350px] rounded-full opacity-[0.03] blur-sm"
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <motion.a
          href={MARKETING_URL}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-block mb-6 font-sans text-[10px] tracking-[0.35em] uppercase text-white/50 hover:text-white transition-colors"
        >
          &larr; Back to wedding
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-white/40 mb-4">
            We hope you can make it
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-white tracking-wide">
            RSVP
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white rounded-lg p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        >
          <AnimatePresence mode="wait">
            {step === "lookup" && (
              <motion.div
                key="lookup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GuestLookupForm
                  onFound={(g) => {
                    setGuest(g);
                    setStep("form");
                  }}
                />
              </motion.div>
            )}
            {step === "form" && guest && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RsvpForm
                  guest={guest}
                  onSuccess={() => {
                    setStep("success");
                    setShowConfetti(true);
                  }}
                />
              </motion.div>
            )}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-royal-50 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-royal"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-3xl text-royal mb-4 font-light">
                  Thank You!
                </h3>
                <p className="font-sans text-sm text-warm-500 leading-relaxed">
                  Your RSVP has been received. We can&apos;t wait to celebrate
                  with you!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {showConfetti && <ConfettiEffect />}
      </div>
    </section>
  );
}

function GuestLookupForm({ onFound }: { onFound: (g: Guest) => void }) {
  const trpc = useTRPC();
  const lookup = useMutation(trpc.rsvp.lookupGuest.mutationOptions());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<GuestLookupInput>({
    resolver: zodResolver(guestLookupSchema),
  });

  const onSubmit = async (data: GuestLookupInput) => {
    try {
      const guest = await lookup.mutateAsync(data);
      onFound({
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        partyName: guest.partyName,
        maxPlusOnes: guest.maxPlusOnes,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "We couldn't find your name on the guest list.";
      setError("root", { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-center font-sans text-sm text-warm-500 mb-6 leading-relaxed">
        Please enter your name as it appears on the invitation.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            {...register("firstName")}
            placeholder="First Name"
            className={inputClass}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1.5 font-sans">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("lastName")}
            placeholder="Last Name"
            className={inputClass}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1.5 font-sans">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {errors.root && (
        <p className="text-red-500 text-sm text-center font-sans">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-royal text-white font-sans text-[11px] tracking-[0.2em] uppercase rounded-lg hover:bg-royal-dark active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
      >
        {isSubmitting ? "Looking you up..." : "Find My Invitation"}
      </button>
    </form>
  );
}

function RsvpForm({
  guest,
  onSuccess,
}: {
  guest: Guest;
  onSuccess: () => void;
}) {
  const trpc = useTRPC();
  const submit = useMutation(trpc.rsvp.submitRsvp.mutationOptions());

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { guestId: guest.id, attending: true },
  });

  const attending = watch("attending");

  const onSubmit = async (data: RsvpInput) => {
    try {
      await submit.mutateAsync(data);
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError("root", { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-4">
        <p className="font-serif text-xl text-royal font-light">
          Welcome, {guest.firstName} {guest.lastName}!
        </p>
        {guest.partyName && (
          <p className="font-sans text-xs text-warm-400 mt-1 tracking-wide">
            {guest.partyName}
          </p>
        )}
      </div>

      <input type="hidden" {...register("guestId")} />

      <div className="flex justify-center gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="radio"
            value="true"
            {...register("attending", {
              setValueAs: (v: string) => v === "true",
            })}
            defaultChecked
            className="w-4 h-4 accent-royal"
          />
          <span className="font-serif text-sm text-royal-700 italic group-hover:text-royal transition-colors">
            Joyfully Accepts
          </span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="radio"
            value="false"
            {...register("attending", {
              setValueAs: (v: string) => v === "true",
            })}
            className="w-4 h-4 accent-royal"
          />
          <span className="font-serif text-sm text-royal-700 italic group-hover:text-royal transition-colors">
            Regretfully Declines
          </span>
        </label>
      </div>

      <AnimatePresence>
        {attending && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5 overflow-hidden"
          >
            <div>
              <label className="block font-sans text-[10px] tracking-[0.25em] uppercase text-warm-500 mb-2">
                Meal Preference
              </label>
              <select {...register("mealChoice")} className={inputClass}>
                <option value="">Select a meal</option>
                {MEAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-sans text-[10px] tracking-[0.25em] uppercase text-warm-500 mb-2">
                Dietary Restrictions
              </label>
              <input
                {...register("dietaryRestrictions")}
                placeholder="Any allergies or dietary needs"
                className={inputClass}
              />
            </div>

            {(guest.maxPlusOnes ?? 0) > 0 && (
              <div className="border-t border-royal-50 pt-6 space-y-5">
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-warm-500">
                  Plus One
                </p>
                <input
                  {...register("plusOneName")}
                  placeholder="Guest name"
                  className={inputClass}
                />
                <select
                  {...register("plusOneMealChoice")}
                  className={inputClass}
                >
                  <option value="">Meal preference</option>
                  {MEAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  {...register("plusOneDietary")}
                  placeholder="Dietary restrictions"
                  className={inputClass}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block font-sans text-[10px] tracking-[0.25em] uppercase text-warm-500 mb-2">
          Message to the Couple
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Share a wish or a note..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {errors.root && (
        <p className="text-red-500 text-sm text-center font-sans">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-royal text-white font-sans text-[11px] tracking-[0.2em] uppercase rounded-lg hover:bg-royal-dark active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send RSVP"}
      </button>
    </form>
  );
}
