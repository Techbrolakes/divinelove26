"use client";

import { useState } from "react";
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

  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions(),
  );

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
      if (result.token) {
        setAuthToken(result.token);
      }
      router.push("/admin");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setError("password", { message });
    }
  };

  return (
    <div className="w-[550px] rounded-2xl border border-gray-200 px-8 py-10">
      <div className="flex flex-col">
        <h1 className="text-[24px] font-semibold text-gray-900">
          Sign in to your account
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-6"
      >
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-[14px] font-medium text-gray-600"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            className="w-full rounded-lg border border-gray-200 bg-white px-[14px] py-3 text-[16px] text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-[13px] text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-[14px] font-medium text-gray-600"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full rounded-lg border border-gray-200 bg-white px-[14px] py-3 pr-10 text-[16px] text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
              disabled={isSubmitting}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[13px] text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer flex w-full items-center justify-center rounded-full bg-primary py-4 text-[16px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}
