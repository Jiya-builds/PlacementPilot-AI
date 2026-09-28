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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">

        {stats.map((item, index) => (
          <motion.div

            whileHover={{
              scale: 1.05,
            }}

            key={index}

            className="rounded-3xl bg-orange-50 backdrop-blur-xl border border-orange-200 p-6 md:p-10 text-center"
          >

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600">
              {item.value}
            </h2>

            <p className="mt-5 text-gray-600">
              {item.title}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
}