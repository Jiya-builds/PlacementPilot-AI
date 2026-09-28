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

      <p className="px-4 text-center text-gray-600 uppercase tracking-[3px] sm:tracking-[6px] text-sm sm:text-base">
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

          className="flex gap-10 md:gap-16 whitespace-nowrap text-2xl md:text-4xl font-bold text-orange-300"
        >
          {[...companies, ...companies].map((c, i) => (
            <span key={i}>{c}</span>
          ))}

        </motion.div>

      </div>

    </section>
  );
}