"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "95%",
    title: "ATS Accuracy",
  },
  {
    value: "10K+",
    title: "Resumes Analyzed",
  },
  {
    value: "50K+",
    title: "Interview Questions",
  },
  {
    value: "98%",
    title: "Student Satisfaction",
  },
];

export default function Stats() {
  return (
    <section className="py-24">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">

        {stats.map((item, index) => (
          <motion.div

            whileHover={{
              scale: 1.05,
            }}

            key={index}

            className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 text-center"
          >

            <h2 className="text-5xl font-bold text-purple-400">
              {item.value}
            </h2>

            <p className="mt-5 text-gray-400">
              {item.title}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
}