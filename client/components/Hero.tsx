"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const waypoints = [
  { label: "RESUME", status: "VERIFIED" },
  { label: "INTERVIEW", status: "IN PROGRESS" },
  { label: "PLACEMENT", status: "PENDING" },
];

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-[var(--pp-bg)]">
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Status chip — reads like the header stamp on a result sheet */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-3 border border-[var(--pp-line)] bg-[var(--pp-panel)] rounded-full pl-2 pr-5 py-1.5 font-tabular text-xs tracking-wider">
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--pp-pass)]/10 text-[var(--pp-pass)] px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--pp-pass)]" />
              ADMISSIONS OPEN
            </span>
            <span className="text-[var(--pp-text-muted)]">
              AI-POWERED PLACEMENT PREP
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 text-center text-5xl md:text-7xl font-display font-semibold leading-[1.05] text-[var(--pp-text)]"
        >
          Your placement season,
          <br />
          <span className="text-[var(--pp-ink)]">
            graded and verified.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-7 max-w-2xl mx-auto text-center text-lg text-[var(--pp-text-muted)]"
        >
          Resume analysis, ATS scoring, AI mock interviews, and a
          personalized roadmap — a clear report card for where you stand
          before campus placements begin.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-11 flex justify-center gap-4"
        >
          <button
            onClick={() => router.push("/register")}
            className="group px-7 py-3.5 rounded-lg bg-[var(--pp-ink)] hover:brightness-110 transition text-[var(--pp-panel)] text-base font-semibold flex items-center gap-2"
          >
            Analyze My Resume
            <ArrowRight
              className="group-hover:translate-x-1 transition"
              size={18}
            />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-7 py-3.5 rounded-lg border border-[var(--pp-line-strong)] text-[var(--pp-text)] hover:bg-[var(--pp-panel)] transition text-base"
          >
            See How It Works
          </button>
        </motion.div>

        {/* Signature element: the result card — a student's progress
            through the placement process, rendered as marksheet
            waypoints rather than a generic floating stat card. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-between font-tabular text-[11px] tracking-wider text-[var(--pp-text-faint)] mb-3 px-1">
            <span className="flex items-center gap-1.5">
              <BadgeCheck size={12} className="text-[var(--pp-stamp)]" />
              PROGRESS CARD
            </span>
            <span>CYCLE: NEXT PLACEMENT SEASON</span>
          </div>

          <div className="relative flex items-center justify-between px-1">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] pp-flight-path" />

            {waypoints.map((wp, i) => (
              <div
                key={wp.label}
                className="relative z-10 flex flex-col items-center gap-2 bg-[var(--pp-bg)] px-3"
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    i === 0
                      ? "bg-[var(--pp-pass)] border-[var(--pp-pass)]"
                      : i === 1
                      ? "bg-[var(--pp-stamp)] border-[var(--pp-stamp)]"
                      : "bg-transparent border-[var(--pp-text-faint)]"
                  }`}
                />
                <span className="font-tabular text-xs tracking-wider text-[var(--pp-text)]">
                  {wp.label}
                </span>
                <span
                  className={`font-tabular text-[10px] tracking-wider ${
                    i === 0
                      ? "text-[var(--pp-pass)]"
                      : i === 1
                      ? "text-[var(--pp-stamp)]"
                      : "text-[var(--pp-text-faint)]"
                  }`}
                >
                  {wp.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
