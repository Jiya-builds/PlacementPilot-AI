"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBackground from "@/components/AuthBackground";
import AuthInput from "@/components/AuthInput";
import api from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      // Account created — send them to login to sign in
      router.push("/login?registered=true");
    } catch (err: any) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[var(--pp-bg)] overflow-hidden flex items-center justify-center px-6">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--pp-line)] bg-[var(--pp-panel)] backdrop-blur-2xl p-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--pp-text)]">
            Create Account 🚀
          </h1>

          <p className="text-[var(--pp-text-muted)] mt-3">
            Start your AI placement journey today.
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-10 space-y-6">
          <AuthInput
            label="Full Name"
            type="text"
            placeholder="Jiya"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="text-[var(--pp-red)] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--pp-ink)] to-[var(--pp-ink-soft)] font-semibold hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-[var(--pp-text-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--pp-ink)] hover:text-[var(--pp-ink)] transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
