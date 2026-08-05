"use client";

import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-12">

          {/* Logo */}

          <div>
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-purple-400" size={34} />

              <h2 className="text-2xl font-bold">
                PlacementPilot AI
              </h2>
            </div>

            <p className="mt-5 text-gray-400 leading-7">
              AI-powered placement preparation platform
              helping students improve resumes,
              practice interviews and land
              dream jobs.
            </p>
          </div>

          {/* Product */}

          <div>
            <h3 className="font-semibold text-lg mb-5">
              Product
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li><Link href="/resume" className="hover:text-white transition">Resume Analyzer</Link></li>
              <li><Link href="/interview" className="hover:text-white transition">Mock Interview</Link></li>
              <li><Link href="/resume" className="hover:text-white transition">ATS Score</Link></li>
              <li><Link href="/roadmap" className="hover:text-white transition">Career Roadmap</Link></li>
            </ul>
          </div>

          {/* Resources */}

          <div>
            <h3 className="font-semibold text-lg mb-5">
              Resources
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li><Link href="/#faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition">How it works</Link></li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="font-semibold text-lg mb-5">
              Connect
            </h3>

            <div className="flex gap-4">

              <Link
  href="#"
  className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-purple-500 transition"
>
  <FaGithub size={22} />
</Link>

              <Link
  href="#"
  className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-500 transition"
>
  <FaLinkedin size={22} />
</Link>

              <Link
  href="#"
  className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-pink-500 transition"
>
  <FaEnvelope size={22} />
</Link>

            </div>
          </div>

        </div>

        <div className="mt-14 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500">

          <p>
            © 2026 PlacementPilot AI. All rights reserved.
          </p>

          <p className="mt-4 md:mt-0">
            Built with ❤️ using Next.js, Groq AI & MongoDB
          </p>

        </div>

      </div>
    </footer>
  );
}