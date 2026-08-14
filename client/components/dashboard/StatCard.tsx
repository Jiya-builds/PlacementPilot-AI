"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
}

// Reads the value as a gauge, instrument-panel style: green when
// nominal, amber when it needs attention, red when it's a warning.
function gaugeStatus(value: string): { pct: number; hex: string } {
  const num = parseInt(value.replace("%", ""), 10);

  if (isNaN(num)) {
    return { pct: 0, hex: "var(--pp-text-faint)" };
  }
  if (num >= 70) {
    return { pct: num, hex: "var(--pp-green)" };
  }
  if (num >= 40) {
    return { pct: num, hex: "var(--pp-amber)" };
  }
  return { pct: num, hex: "var(--pp-red)" };
}

export default function StatCard({ title, value, subtitle, icon: Icon }: Props) {
  const { pct, hex } = gaugeStatus(value);

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6 hover:border-[var(--pp-amber)]/40 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-tabular text-[11px] tracking-wider text-[var(--pp-text-faint)]">
            {title.toUpperCase()}
          </p>

          <h2
            className="text-3xl font-display font-semibold mt-3 font-tabular"
            style={{ color: hex }}
          >
            {value}
          </h2>

          <p className="mt-2 text-sm text-[var(--pp-text-muted)]">
            {subtitle}
          </p>
        </div>

        {/* Gauge ring instead of a flat icon tile */}
        <div className="relative w-16 h-16 shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="var(--pp-line)"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke={hex}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon size={20} style={{ color: hex }} />
          </div>
        </div>
      </div>
    </div>
  );
}
