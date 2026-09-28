"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] lg:w-[700px] lg:h-[700px] bg-orange-600/20 blur-[140px] lg:blur-[180px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-2 border border-orange-500/30 bg-orange-50 backdrop-blur-xl rounded-full px-4 sm:px-5 py-2 max-w-full">
            <Sparkles
              size={15}
              className="text-orange-600 shrink-0 sm:w-4 sm:h-4"
            />

            <span className="text-xs sm:text-sm text-gray-700 text-center">
              AI Powered Placement Preparation
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 sm:mt-10 text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] sm:leading-tight px-1"
        >
          Crack Your Dream
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            Placement with AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8 max-w-3xl mx-auto text-center text-sm sm:text-base lg:text-lg text-gray-600 leading-6 sm:leading-7 lg:leading-8 px-2"
        >
          Analyze your Resume, improve ATS Score, prepare for technical
          interviews and receive a personalized AI Career Roadmap.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-5 px-4 sm:px-0"
        >
          <button
            onClick={() => router.push("/login")}
            className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 transition text-base sm:text-lg font-semibold flex items-center justify-center gap-2 text-white"
          >
            Analyze Resume

            <ArrowRight
              className="group-hover:translate-x-1 transition"
              size={19}
            />
          </button>

          <button
            onClick={() => router.push("/login")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-orange-200 bg-orange-50 backdrop-blur-lg hover:bg-orange-100/70 transition text-base sm:text-lg"
          >
            Live Demo
          </button>
        </motion.div>
      </div>

      {/* Floating Card - Desktop Only */}
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="hidden lg:flex absolute right-24 top-40 w-72 rounded-3xl border border-orange-200 bg-orange-50 backdrop-blur-xl p-6 flex-col gap-3 shadow-2xl"
      >
        <BrainCircuit className="text-orange-600" size={40} />

        <h3 className="text-xl font-bold">Resume Score</h3>

        <div className="text-5xl font-extrabold text-orange-600">92%</div>

        <p className="text-gray-600">
          AI suggests improvements instantly.
        </p>
      </motion.div>
    </section>
  );
}

