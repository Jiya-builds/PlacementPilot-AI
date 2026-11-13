"use client";

import { useState } from "react";
import Link from "next/link";
import AuthBackground from "@/components/AuthBackground";
import AuthInput from "@/components/AuthInput";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      router.push("/dashboard");
    } catch (err: any) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          "Could not sign in. Server may be waking up, please wait a minute and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center px-6">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-orange-200 bg-orange-50 backdrop-blur-2xl p-6 sm:p-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome Back 👋
          </h1>

          <p className="text-gray-600 mt-3">
            Continue your placement journey.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-10 space-y-6">
          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="text-orange-600 hover:text-orange-700"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 font-semibold hover:scale-[1.02] transition text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{" "}
          <Link
              href="/register"
            className="text-orange-600 hover:underline font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}