"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ConfettiEffect from "@/components/ui/ConfettiEffect";
import { lookupGuest, submitRsvp } from "@/actions/rsvp";
import {
  guestLookupSchema,
  rsvpSchema,
  type Guest,
  type GuestLookupInput,
  type RsvpInput,
} from "@/lib/schemas";
import { MEAL_OPTIONS } from "@/lib/constants";

type Step = "lookup" | "form" | "success";

export default function RsvpSection() {
  const [step, setStep] = useState<Step>("lookup");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGuestFound = (g: Guest) => {
    setGuest(g);
    setStep("form");
  };

  const handleSubmitSuccess = () => {
    setStep("success");
    setShowConfetti(true);
  };

  return (
    <SectionWrapper
      id="rsvp"
      className="relative bg-gradient-to-b from-ivory via-cream to-ivory noise-overlay"
    >
      <div className="relative z-[2] max-w-xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-4"
          >
            We hope you can make it
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-light text-royal tracking-wide"
          >
            RSVP
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-px bg-gold mx-auto mt-6"
          />
        </div>

        {/* Form card */}
        <div className="bg-white rounded-sm p-8 md:p-12 card-emboss stationery-border">
          <AnimatePresence mode="wait">
            {step === "lookup" && (
              <motion.div
                key="lookup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GuestLookupForm onFound={handleGuestFound} />
              </motion.div>
            )}
            {step === "form" && guest && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <RsvpForm guest={guest} onSuccess={handleSubmitSuccess} />
              </motion.div>
            )}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-royal-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-royal"
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
        </div>

        {showConfetti && <ConfettiEffect />}
      </div>
    </SectionWrapper>
  );
}

const inputClass =
  "w-full px-4 py-3.5 bg-ivory/60 border border-royal-100/60 rounded-sm font-sans text-sm text-royal-700 placeholder:text-warm-400/80 focus:outline-none focus:border-gold/60 focus:bg-white transition-all duration-300";

function GuestLookupForm({ onFound }: { onFound: (g: Guest) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<GuestLookupInput>({
    resolver: zodResolver(guestLookupSchema),
  });

  const onSubmit = async (data: GuestLookupInput) => {
    const result = await lookupGuest(data);
    if (result.guest) {
      onFound(result.guest);
    } else {
      setError("root", { message: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-center font-sans text-sm text-warm-500 mb-8 leading-relaxed">
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
        className="w-full py-3.5 bg-royal text-white font-sans text-[11px] tracking-[0.2em] uppercase rounded-sm hover:bg-royal-dark transition-all duration-300 disabled:opacity-50"
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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guestId: guest.id,
      attending: true,
    },
  });

  const attending = watch("attending");

  const onSubmit = async (data: RsvpInput) => {
    const result = await submitRsvp(data);
    if (result.success) {
      onSuccess();
    } else {
      setError("root", { message: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <p className="font-serif text-xl text-royal font-light">
          Welcome, {guest.first_name} {guest.last_name}!
        </p>
        {guest.party_name && (
          <p className="font-sans text-xs text-warm-400 mt-1 tracking-wide">
            {guest.party_name}
          </p>
        )}
      </div>

      <input type="hidden" {...register("guestId")} />

      {/* Attending */}
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
          <span className="font-serif text-sm text-royal-700 italic group-hover:text-gold transition-colors">
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
          <span className="font-serif text-sm text-royal-700 italic group-hover:text-gold transition-colors">
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
            {/* Meal choice */}
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

            {/* Dietary restrictions */}
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

            {/* Plus one fields */}
            {guest.max_plus_ones > 0 && (
              <div className="border-t border-gold/10 pt-6 space-y-5">
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

      {/* Notes */}
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
        className="w-full py-3.5 bg-royal text-white font-sans text-[11px] tracking-[0.2em] uppercase rounded-sm hover:bg-royal-dark transition-all duration-300 disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send RSVP"}
      </button>
    </form>
  );
}
