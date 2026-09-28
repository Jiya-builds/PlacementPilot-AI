"use client";

import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthInput({ label, ...props }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-700">{label}</label>

      <input
        {...props}
        className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 outline-none text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
      />
    </div>
  );
}