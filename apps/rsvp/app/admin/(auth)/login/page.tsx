"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { setAuthToken } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation(trpc.auth.login.mutationOptions());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      if (result.token) setAuthToken(result.token);
      router.push("/admin");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setError("password", { message });
    }
  };

  return (
    <div className="relative z-10 grid w-full grid-cols-1 md:grid-cols-[1.05fr_1fr]">
      {/* Left — wedding brand panel */}
      <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-gradient-to-br from-royal via-royal-dark to-[#04123a] p-12">
        {/* Diamond fill pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Soft monogram halo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/logo/monogram-white-on-blue.jpeg"
            alt=""
            width={500}
            height={500}
            className="w-[420px] h-[420px] rounded-full opacity-[0.06] blur-sm"
            aria-hidden
          />
        </div>
        {/* Hairline gold inner frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-6 rounded-[2px] border border-white/10"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-7 rounded-[2px] border border-white/[0.04]"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Crisp monogram on top */}
          <div className="relative mb-6">
            <Image
              src="/logo/monogram-white-on-blue.jpeg"
              alt="Divine Love 26"
              width={120}
              height={120}
              className="h-[88px] w-[88px] rounded-full object-cover ring-1 ring-white/30 shadow-[0_0_60px_rgba(168,180,196,0.25)]"
              priority
            />
          </div>

          <p className="font-sans text-[10px] tracking-[0.55em] uppercase text-white/55 mb-5">
            Event Administration
          </p>
          <h1 className="font-serif italic font-light text-white text-[44px] md:text-[52px] leading-none mb-2">
            Divine Love 26
          </h1>
          <p className="font-serif italic text-royal-100 text-xl mb-8">
            Idah &amp; Ikhioya
          </p>

          <div className="flex items-center justify-center gap-3 mb-7">
            <span className="h-px w-14 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-white/70" />
            <span className="h-px w-14 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-white/55">
            20 &middot; June &middot; 2026
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-16 md:px-14 bg-warm-50/30">
        <div className="w-full max-w-md">
          {/* Mobile-only monogram */}
          <div className="md:hidden flex justify-center mb-6">
            <Image
              src="/logo/monogram-white-on-blue.jpeg"
              alt="Divine Love 26"
              width={88}
              height={88}
              className="h-16 w-16 rounded-full object-cover ring-1 ring-royal-100"
              priority
            />
          </div>

          <div className="mb-8 text-center">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-warm-500 mb-3">
              Staff Portal
            </p>
            <h2 className="font-sans font-medium text-royal-dark text-[28px] md:text-[32px] leading-tight tracking-tight mb-2">
              Sign in to admin
            </h2>
            <p className="font-sans text-[13px] text-gray-500">
              Manage registrations, send invitations, and check in guests.
            </p>
          </div>

          <div className="relative rounded-2xl border border-gray-100 bg-white p-8 md:p-9 shadow-[0_20px_60px_-30px_rgba(11,61,145,0.25)]">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-royal/30 to-transparent"
            />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block font-sans text-[10px] tracking-[0.3em] uppercase text-warm-500 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-royal-100 bg-royal-50/30 px-4 py-3 font-sans text-sm text-royal-700 outline-none placeholder:text-warm-400/70 focus:border-royal-300 focus:bg-white focus:ring-2 focus:ring-royal-100 transition-all disabled:opacity-50"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1.5 font-sans text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-sans text-[10px] tracking-[0.3em] uppercase text-warm-500 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-royal-100 bg-royal-50/30 px-4 py-3 pr-11 font-sans text-sm text-royal-700 outline-none placeholder:text-warm-400/70 focus:border-royal-300 focus:bg-white focus:ring-2 focus:ring-royal-100 transition-all disabled:opacity-50"
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-royal transition-colors cursor-pointer"
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
                {errors.password && (
                  <p className="mt-1.5 font-sans text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-lg bg-royal py-3.5 font-sans text-[11px] tracking-[0.25em] uppercase text-white transition-all hover:bg-royal-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center font-serif italic text-sm text-warm-500">
            #DIVINELOVE26
          </p>
        </div>
      </div>
    </div>
  );
}
