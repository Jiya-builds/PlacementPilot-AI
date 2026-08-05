"use client";

import { motion } from "framer-motion";
import { Upload, Brain, FileCheck, Trophy } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Resume",
    desc: "Upload your latest resume in PDF format."
  },
  {
    icon: Brain,
    title: "AI Analysis",
    desc: "Our AI deeply analyzes your resume."
  },
  {
    icon: FileCheck,
    title: "Get ATS Report",
    desc: "Receive ATS score and improvement tips."
  },
  {
    icon: Trophy,
    title: "Crack Interviews",
    desc: "Practice interviews and become placement ready."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto py-28 px-6">

      <h2 className="text-5xl font-bold text-center">
        How It Works
      </h2>

      <p className="text-center text-gray-400 mt-5">
        Four simple steps to become placement ready.
      </p>

      <div className="grid md:grid-cols-4 gap-8 mt-20">

        {steps.map((step, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8 }}
            className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8"
          >

            <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center">
              <step.icon size={28}/>
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              {step.title}
            </h3>

            <p className="mt-3 text-gray-400">
              {step.desc}
            </p>

            <div className="absolute top-5 right-6 text-5xl text-white/10 font-bold">
              0{i+1}
            </div>

          </motion.div>
        ))}

      </div>

    </section>
  );
}