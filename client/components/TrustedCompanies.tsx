"use client";

import { motion } from "framer-motion";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Adobe",
  "Netflix",
  "Meta",
  "TCS",
  "Infosys",
];

export default function TrustedCompanies() {
  return (
    <section className="py-16">

      <p className="text-center text-gray-400 uppercase tracking-[6px]">
        Inspired By Top Tech Companies
      </p>

      <div className="overflow-hidden mt-10">

        <motion.div

          animate={{ x: ["0%", "-50%"] }}

          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}

          className="flex gap-16 whitespace-nowrap text-4xl font-bold text-white/20"
        >
          {[...companies, ...companies].map((c, i) => (
            <span key={i}>{c}</span>
          ))}

        </motion.div>

      </div>

    </section>
  );
}