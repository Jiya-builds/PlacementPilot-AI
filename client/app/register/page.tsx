"use client";

import Link from "next/link";
import AuthBackground from "@/components/AuthBackground";
import AuthInput from "@/components/AuthInput";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center px-6">

      <AuthBackground />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-orange-200 bg-orange-50 backdrop-blur-2xl p-6 sm:p-10">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-gray-900">
            Create Account 🚀
          </h1>

          <p className="text-gray-600 mt-3">
            Start your AI placement journey today.
          </p>

        </div>

        <form className="mt-10 space-y-6">

          <AuthInput
            label="Full Name"
            type="text"
            placeholder="Jiya"
          />

          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
          />

          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 font-semibold hover:scale-[1.02] transition-all duration-300 text-white"
          >
            Create Account
          </button>

        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-600 hover:text-orange-700 transition"
          >
            Sign In
          </Link>
        </p>

      </div>

    </main>
  );
}