
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
    <footer className="border-t border-[var(--pp-line)] bg-[var(--pp-bg)]">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Main Footer */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 w-fit"
            >
              <BrainCircuit
                className="text-[var(--pp-ink)]"
                size={34}
              />

              <h2 className="text-2xl font-bold text-[var(--pp-text)]">
                PlacementPilot AI
              </h2>
            </Link>

            <p className="mt-5 text-[var(--pp-text-muted)] leading-7">
              Your AI-powered co-pilot for placement preparation.
              Analyze your resume, match with jobs, practice
              interviews, and build your career roadmap.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[var(--pp-text)]">
              Product
            </h3>

            <ul className="space-y-3 text-[var(--pp-text-muted)]">

              <li>
                <Link
                  href="/resume"
                  className="hover:text-[var(--pp-ink)] transition"
                >
                  Resume Analyzer
                </Link>
              </li>

              <li>
                <Link
                  href="/resume"
                  className="hover:text-[var(--pp-ink)] transition"
                >
                  ATS Analysis
                </Link>
              </li>

              <li>
                <Link
                  href="/resume"
                  className="hover:text-[var(--pp-ink)] transition"
                >
                  Job Description Matching
                </Link>
              </li>

              <li>
                <Link
                  href="/interview"
                  className="hover:text-[var(--pp-ink)] transition"
                >
                  AI Mock Interview
                </Link>
              </li>

              <li>
                <Link
                  href="/roadmap"
                  className="hover:text-[var(--pp-ink)] transition"
                >
                  Career Roadmap
                </Link>
              </li>

            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[var(--pp-text)]">
              Resources
            </h3>

            <ul className="space-y-3 text-[var(--pp-text-muted)]">

              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-[var(--pp-ink)] transition"
                >
                  How It Works
                </Link>
              </li>

              <li>
                <Link
                  href="/#faq"
                  className="hover:text-[var(--pp-ink)] transition"
                >
                  FAQs
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="hover:text-[var(--pp-ink)] transition"
                >
                  Get Started
                </Link>
              </li>

            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-[var(--pp-text)]">
              Connect
            </h3>

            <p className="text-[var(--pp-text-muted)] leading-6 mb-5">
              Connect with me and explore more of my work and projects.
            </p>

            <div className="flex gap-3">

              {/* GitHub */}
              <a
                href="https://github.com/Jiya-builds"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-11 h-11 rounded-xl bg-[var(--pp-panel)] border border-[var(--pp-line)] flex items-center justify-center text-[var(--pp-text-muted)] hover:text-[var(--pp-ink)] hover:border-[var(--pp-ink)] transition"
              >
                <FaGithub size={20} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/jiya-arora-b02b56378/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-xl bg-[var(--pp-panel)] border border-[var(--pp-line)] flex items-center justify-center text-[var(--pp-text-muted)] hover:text-[var(--pp-ink)] hover:border-[var(--pp-ink)] transition"
              >
                <FaLinkedin size={20} />
              </a>

              {/* Email */}
              <a
                href="mailto:jiyaarorahmh@gmail.com"
                aria-label="Email"
                className="w-11 h-11 rounded-xl bg-[var(--pp-panel)] border border-[var(--pp-line)] flex items-center justify-center text-[var(--pp-text-muted)] hover:text-[var(--pp-ink)] hover:border-[var(--pp-ink)] transition"
              >
                <FaEnvelope size={20} />
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-14 border-t border-[var(--pp-line)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--pp-text-faint)]">

          <p className="text-center md:text-left">
            © 2026 PlacementPilot AI. All rights reserved.
          </p>

          <p className="text-center">
            Built with ❤️ using Next.js, Groq AI & MongoDB
          </p>

        </div>

      </div>
    </footer>
  );
}

