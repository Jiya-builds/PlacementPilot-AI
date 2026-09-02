
"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Target,
  Brain,
  CheckCircle,
  Briefcase,
} from "lucide-react";

const skills = ["React", "Node.js", "MongoDB", "AI", "JWT"];

export default function DashboardPreview() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="px-4 py-2 rounded-full bg-[var(--pp-ink)]/10 border border-[var(--pp-ink)]/25 text-[var(--pp-ink)] text-sm">
            Dashboard Preview
          </span>

          <h2 className="text-5xl md:text-6xl font-bold mt-6 text-[var(--pp-text)]">
            Your AI Career Dashboard
          </h2>

          <p className="text-[var(--pp-text-muted)] mt-5 max-w-2xl mx-auto">
            One place to understand your resume, improve your profile,
            match with jobs, and prepare for interviews.
          </p>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-[var(--pp-line)] bg-[var(--pp-panel)] backdrop-blur-xl p-6 md:p-8 shadow-2xl"
        >

          {/* Top Cards */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Resume Score */}
            <div className="rounded-2xl bg-[#111827] p-6">
              <div className="flex items-center gap-3">
                <FileText className="text-[var(--pp-ink)]" />

                <span className="text-white">
                  Resume Score
                </span>
              </div>

              <h3 className="text-5xl font-bold mt-6 text-[var(--pp-ink)]">
                92%
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Overall resume quality
              </p>

              <div className="mt-6 h-3 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full w-[92%] bg-[var(--pp-ink)] rounded-full" />
              </div>
            </div>

            {/* ATS Score */}
            <div className="rounded-2xl bg-[#111827] p-6">
              <div className="flex items-center gap-3">
                <Target className="text-[var(--pp-ink)]" />

                <span className="text-white">
                  ATS Score
                </span>
              </div>

              <h3 className="text-5xl font-bold mt-6 text-[var(--pp-ink)]">
                95%
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                ATS compatibility
              </p>

              <div className="mt-6 h-3 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full w-[95%] bg-[var(--pp-ink)] rounded-full" />
              </div>
            </div>

          </div>

          {/* Middle Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">

            {/* Job Match */}
            <div className="rounded-2xl bg-[#111827] p-6">

              <div className="flex items-center gap-3">
                <Briefcase className="text-[var(--pp-ink)]" />

                <span className="text-white">
                  Job Match
                </span>
              </div>

              <h3 className="text-5xl font-bold mt-6 text-[var(--pp-ink)]">
                88%
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Resume match for a target role
              </p>

              <div className="mt-6 h-3 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full w-[88%] bg-[var(--pp-ink)] rounded-full" />
              </div>

            </div>

            {/* Interview Readiness */}
            <div className="rounded-2xl bg-[#111827] p-6">

              <div className="flex items-center gap-3">
                <CheckCircle className="text-[var(--pp-pass)]" />

                <span className="text-white">
                  Interview Readiness
                </span>
              </div>

              <h3 className="text-5xl font-bold mt-6 text-[var(--pp-pass)]">
                87%
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Based on AI interview practice
              </p>

              <div className="mt-6 h-3 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full w-[87%] bg-green-500 rounded-full" />
              </div>

            </div>

          </div>

          {/* Skills */}
          <div className="mt-6 rounded-2xl bg-[#111827] p-6">

            <div className="flex items-center gap-3">
              <Brain className="text-[var(--pp-ink)]" />

              <span className="text-white">
                Detected Skills
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full bg-[var(--pp-ink)]/10 border border-[var(--pp-ink)]/20 text-[var(--pp-ink)] text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

          </div>

          {/* Preview Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--pp-text-faint)]">
              Example dashboard preview — your actual scores are
              generated from your resume and job description.
            </p>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

