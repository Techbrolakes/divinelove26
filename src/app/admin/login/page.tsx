"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/admin";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      router.push("/admin");
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-royal text-center mb-8">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 bg-white border border-royal-100 rounded-lg font-sans text-sm text-royal-700 placeholder:text-warm-400 focus:outline-none focus:border-royal-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-white border border-royal-100 rounded-lg font-sans text-sm text-royal-700 placeholder:text-warm-400 focus:outline-none focus:border-royal-400"
          />
          {error && (
            <p className="text-red-500 text-sm text-center font-sans">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-royal text-white font-sans text-sm tracking-widest uppercase rounded-lg hover:bg-royal-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
