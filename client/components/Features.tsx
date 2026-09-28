"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Target,
  Brain,
  CheckCircle,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700 text-sm">
            Dashboard Preview
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6">
            Your AI Career Dashboard
          </h2>

          <p className="text-gray-600 mt-5">
            Everything you need in one place.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl border border-orange-200 bg-orange-50 backdrop-blur-xl p-8 shadow-2xl"
        >
          {/* Top */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="rounded-2xl bg-[#111827] p-6">
              <div className="flex items-center gap-3">
                <FileText className="text-orange-600" />
                <span>Resume Score</span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6 text-orange-600">
                92%
              </h3>

              <div className="mt-6 h-3 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full w-[92%] bg-orange-500 rounded-full text-white" />
              </div>
            </div>

            <div className="rounded-2xl bg-[#111827] p-6">
              <div className="flex items-center gap-3">
                <Target className="text-yellow-600" />
                <span>ATS Score</span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6 text-yellow-600">
                95%
              </h3>

              <div className="mt-6 h-3 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full w-[95%] bg-yellow-500 rounded-full" />
              </div>
            </div>

          </div>

          {/* Bottom */}

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div className="rounded-2xl bg-[#111827] p-6">
              <div className="flex items-center gap-3">
                <Brain className="text-amber-600" />
                <span>Top Skills</span>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                {["React", "Node.js", "MongoDB", "AI", "JWT"].map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-2 rounded-full bg-orange-500/10 text-orange-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#111827] p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" />
                <span>Interview Readiness</span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6 text-green-600">
                87%
              </h3>

              <div className="mt-6 h-3 rounded-full bg-gray-700 overflow-hidden">
                <div className="h-full w-[87%] bg-green-500 rounded-full text-white" />
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}