"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="relative py-32 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[700px] h-[700px] bg-purple-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-14 text-center"
        >

          <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
            Start Today 🚀
          </span>

          <h2 className="mt-8 text-5xl md:text-6xl font-bold leading-tight">
            Ready to Crack
            <br />
            Your Dream Placement?
          </h2>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-8">
            Analyze your resume with AI, practice mock interviews,
            improve your ATS score and receive a personalized
            placement roadmap—all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">

            <button
              onClick={() => router.push("/register")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:scale-105 transition flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight size={20}/>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("how-it-works");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-xl border border-white/15 hover:bg-white/10 transition"
            >
              View Demo
            </button>

          </div>

        </motion.div>

      </div>
    </section>
  );
}