"use client";

import { motion } from "framer-motion";
import {
  Brain,
  FileSearch,
  MessageSquare,
  Map,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    desc: "Get detailed resume feedback with strengths, weaknesses and improvement suggestions.",
  },
  {
    icon: FileSearch,
    title: "ATS Optimization",
    desc: "Improve your resume score and increase the chances of passing ATS filters.",
  },
  {
    icon: MessageSquare,
    title: "AI Mock Interviews",
    desc: "Practice technical interviews with AI-generated questions and feedback.",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    desc: "Receive a personalized learning roadmap based on your skills and goals.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "Monitor interview performance, resume improvements and overall readiness.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    desc: "JWT authentication and secure data handling keep your information protected.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Why Choose Us
          </span>

          <h2 className="text-5xl font-bold mt-6">
            Everything You Need to Ace Placements
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
            PlacementPilot AI combines resume analysis, AI interviews,
            career guidance and progress tracking into one platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-purple-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <Icon className="text-purple-400" size={28} />
                </div>

                <h3 className="text-2xl font-semibold mt-6">
                  {item.title}
                </h3>

                <p className="text-gray-400 mt-4 leading-7">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}