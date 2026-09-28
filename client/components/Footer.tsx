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
    <footer className="border-t border-orange-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-12">

          {/* Logo */}

          <div>
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-orange-600" size={34} />

              <h2 className="text-2xl font-bold">
                PlacementPilot AI
              </h2>
            </div>

            <p className="mt-5 text-gray-600 leading-7">
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

            <ul className="space-y-3 text-gray-600">
              <li><Link href="#">Resume Analyzer</Link></li>
              <li><Link href="#">Mock Interview</Link></li>
              <li><Link href="#">ATS Score</Link></li>
              <li><Link href="#">Career Roadmap</Link></li>
            </ul>
          </div>

          {/* Resources */}

          <div>
            <h3 className="font-semibold text-lg mb-5">
              Resources
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li><Link href="#">Documentation</Link></li>
              <li><Link href="#">FAQs</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms</Link></li>
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
  className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center hover:bg-orange-500 transition"
>
  <FaGithub size={22} />
</Link>

              <Link
  href="#"
  className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center hover:bg-amber-500 transition"
>
  <FaLinkedin size={22} />
</Link>

              <Link
  href="#"
  className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center hover:bg-amber-500 transition"
>
  <FaEnvelope size={22} />
</Link>

            </div>
          </div>

        </div>

        <div className="mt-14 border-t border-orange-200 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500">

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