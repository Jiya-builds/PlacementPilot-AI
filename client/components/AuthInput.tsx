"use client";

import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthInput({ label, ...props }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300">{label}</label>

      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none text-white placeholder:text-gray-500 transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
      />
    </div>
  );
}