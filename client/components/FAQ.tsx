"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Is PlacementPilot AI free to use?",
    answer:
      "Yes. You can access the core features like resume analysis and AI interview practice for free.",
  },
  {
    question: "How does the AI resume analyzer work?",
    answer:
      "Simply upload your resume. Our AI extracts the content, evaluates ATS compatibility, identifies strengths and weaknesses, and provides improvement suggestions.",
  },
  {
    question: "Can I practice mock interviews?",
    answer:
      "Absolutely! PlacementPilot AI generates technical interview questions and evaluates your answers with detailed feedback.",
  },
  {
    question: "Is my resume data secure?",
    answer:
      "Yes. Your resume is securely stored and processed. Authentication is protected using JWT, and your data is only accessible to your account.",
  },
  {
    question: "Which companies is this platform useful for?",
    answer:
      "It is designed for students and job seekers preparing for placements in companies like Microsoft, Google, Amazon, Adobe, TCS, Infosys, and many more.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-14">
          <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
            FAQ
          </span>

          <h2 className="text-5xl font-bold mt-6">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-400 mt-5">
            Everything you need to know about PlacementPilot AI.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex justify-between items-center px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold">
                  {faq.question}
                </span>

                <motion.div
                  animate={{
                    rotate: openIndex === index ? 180 : 0,
                  }}
                >
                  <ChevronDown />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-400 leading-7">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}