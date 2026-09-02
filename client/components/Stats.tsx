
"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "AI",
    title: "Powered Resume Analysis",
  },
  {
    value: "ATS",
    title: "Compatibility Analysis",
  },
  {
    value: "JD",
    title: "Job-Specific Matching",
  },
  {
    value: "24/7",
    title: "Placement Preparation",
  },
];

export default function Stats() {
  return (
    <section className="py-24">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6">

        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            whileHover={{
              scale: 1.05,
              y: -5,
            }}
            className="rounded-3xl bg-[var(--pp-panel)] backdrop-blur-xl border border-[var(--pp-line)] p-10 text-center transition-all duration-300"
          >

            <h2 className="text-4xl md:text-5xl font-bold text-[var(--pp-ink)]">
              {item.value}
            </h2>

            <p className="mt-5 text-[var(--pp-text-muted)]">
              {item.title}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
}

