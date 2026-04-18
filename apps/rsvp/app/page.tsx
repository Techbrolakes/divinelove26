"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { z } from "zod";
import { Mail, User, CheckCircle2 } from "lucide-react";
import { useTRPC } from "@/lib/trpc";
import ConfettiEffect from "@/components/ui/ConfettiEffect";

const registerSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").trim(),
  email: z
    .string()
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),
});
type RegisterInput = z.infer<typeof registerSchema>;

const inputClass =
  "w-full pl-11 pr-4 py-4 bg-white border border-royal-100 rounded-xl font-sans text-[16px] text-royal-700 placeholder:text-gray-400 focus:outline-none focus:border-royal focus:ring-4 focus:ring-royal/10 transition-all duration-300";

export default function RsvpPage() {
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center py-16 px-6">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-royal via-royal-dark to-[#030f2e]" />

      {/* Diamond pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial spotlight */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26,86,196,0.4) 0%, transparent 60%)",
        }}
      />

      {/* Floating monogram watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <Image
          src="/logo/monogram-white-on-blue.jpeg"
          alt=""
          width={500}
          height={500}
          className="w-[480px] h-[480px] rounded-full opacity-[0.04] blur-[2px]"
          aria-hidden
        />
      </motion.div>

      {/* Decorative corner flourishes */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l border-t border-white/20 rounded-tl-2xl hidden md:block" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r border-t border-white/20 rounded-tr-2xl hidden md:block" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l border-b border-white/20 rounded-bl-2xl hidden md:block" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r border-b border-white/20 rounded-br-2xl hidden md:block" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-sans text-[10px] uppercase text-white/50 mb-5"
          >
            You are cordially invited
          </motion.p>

          <h1 className="font-serif italic font-light text-white/95 text-5xl md:text-7xl tracking-tight leading-none">
            Ikhioya
            <span className="inline-block mx-3 text-white/50 text-4xl md:text-5xl">
              &amp;
            </span>
            Idah
          </h1>

          <div className="flex items-center justify-center gap-5 mt-8">
            <span className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="text-white/40 text-2xl">&#10086;</span>
            <span className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          <p className="mt-6 font-sans text-[11px] tracking-[0.4em] uppercase text-white/60">
            20 &middot; June &middot; 2026
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Shimmer glow behind card */}
          <div className="absolute -inset-px bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-3xl blur-xl opacity-70" />

          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            {/* Top accent */}
            <div className="absolute inset-x-8 top-0 h-[3px] bg-gradient-to-r from-transparent via-royal to-transparent rounded-full" />

            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <RegisterForm
                    onSuccess={() => {
                      setDone(true);
                      setShowConfetti(true);
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal to-royal-dark flex items-center justify-center shadow-[0_15px_40px_-10px_rgba(11,61,145,0.5)]"
                  >
                    <CheckCircle2
                      className="w-10 h-10 text-white"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gray-900 mb-3">
                    Reservation Received
                  </p>
                  <h3 className="font-serif italic text-4xl md:text-5xl text-royal-dark mb-4 font-light">
                    Thank you
                  </h3>

                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="h-px w-12 bg-gradient-to-r from-transparent via-royal/30 to-transparent" />
                    <span className="text-royal/50 text-lg">&#10086;</span>
                    <span className="h-px w-12 bg-gradient-to-r from-transparent via-royal/30 to-transparent" />
                  </div>

                  <p className="font-sans text-[14px] text-gray-900 leading-relaxed max-w-md mx-auto">
                    Your seat is reserved. We&apos;ll send your private
                    invitation — complete with a code to present at the door —
                    straight to your inbox.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer hashtag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center font-sans text-[10px] tracking-[0.4em] uppercase text-white/40 mt-8"
        >
          #DivineLove26
        </motion.p>

        {showConfetti && <ConfettiEffect />}
      </div>
    </section>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const trpc = useTRPC();
  const submit = useMutation(trpc.rsvp.register.mutationOptions());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
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
      <div className="text-center mb-2">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gray-900 mb-3">
          Reserve your seat
        </p>
        <h2 className="font-serif italic text-3xl md:text-4xl text-royal-dark font-light mb-3">
          Join us on our day
        </h2>
        <p className="font-sans text-[14px] text-gray-900 leading-relaxed max-w-sm mx-auto">
          Share your name and email, and we&apos;ll send a private invitation
          with a code for the door.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pb-2">
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-royal/30 to-transparent" />
        <span className="text-royal/40 text-sm">&#10086;</span>
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-royal/30 to-transparent" />
      </div>

      <div>
        <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gray-900 mb-2 pl-1">
          Full name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-royal/50" />
          <input
            {...register("fullName")}
            placeholder="As you'd like it on the invitation"
            className={inputClass}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1.5 font-sans pl-1">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gray-900 mb-2 pl-1">
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-royal/50" />
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1.5 font-sans pl-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {errors.root && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-center">
          <p className="text-red-600 text-sm font-sans">
            {errors.root.message}
          </p>
        </div>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full cursor-pointer py-4 bg-gradient-to-br from-royal to-royal-dark text-white font-sans text-[11px] tracking-[0.3em] uppercase rounded-xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(11,61,145,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(11,61,145,0.6)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Shimmer effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <span className="relative">
          {isSubmitting ? "Reserving..." : "Reserve My Seat"}
        </span>
      </motion.button>

      <p className="text-center font-serif italic text-gray-900 text-[13px] pt-1">
        Ikhioya &amp; Idah &middot; 20 June 2026
      </p>
    </form>
  );
}
