"use client";

import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthInput({ label, ...props }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-[var(--pp-text-muted)]">{label}</label>

      <input
        {...props}
        className="w-full rounded-xl border border-[var(--pp-line)] bg-[var(--pp-panel)] px-4 py-3 outline-none text-[var(--pp-text)] placeholder:text-[var(--pp-text-faint)] transition-all duration-300 focus:border-[var(--pp-ink)] focus:ring-2 focus:ring-[var(--pp-ink)]/20"
      />
    </div>
  );
}