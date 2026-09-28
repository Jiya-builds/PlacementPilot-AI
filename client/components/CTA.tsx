"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-20 md:py-32 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[350px] h-[350px] sm:w-[700px] sm:h-[700px] bg-orange-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="rounded-[32px] border border-orange-200 bg-orange-50 backdrop-blur-2xl p-14 text-center"
        >

          <span className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-700">
            Start Today 🚀
          </span>

          <h2 className="mt-8 text-5xl md:text-6xl font-bold leading-tight">
            Ready to Crack
            <br />
            Your Dream Placement?
          </h2>

          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-8">
            Analyze your resume with AI, practice mock interviews,
            improve your ATS score and receive a personalized
            placement roadmap—all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">

            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 font-semibold hover:scale-105 transition flex items-center justify-center gap-2 text-white">
              Get Started Free
              <ArrowRight size={20}/>
            </button>

            <button className="px-8 py-4 rounded-xl border border-orange-200 hover:bg-orange-100/70 transition">
              View Demo
            </button>

          </div>

        </motion.div>

      </div>
    </section>
  );
}