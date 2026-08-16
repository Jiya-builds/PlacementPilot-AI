"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

import Topbar from "@/components/dashboard/Topbar";
import StatCard from "@/components/dashboard/StatCard";

import {
  FileText,
  Target,
  Brain,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [analysis, setAnalysis] = useState<any>(null);
  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get("/ai/resume-analysis");
        setAnalysis(res.data.analysis);
      } catch (error: any) {
        console.log("ANALYSIS ERROR:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchInterviewScore = async () => {
      try {
        const res = await api.get("/ai/interview-history");
        const interviews = res.data.interviews || [];

        if (interviews.length > 0) {
          const avg =
            interviews.reduce((sum: number, iv: any) => sum + (iv.score || 0), 0) /
            interviews.length;

          setInterviewScore(avg);
        }
      } catch (error: any) {
        console.log("INTERVIEW SCORE ERROR:", error.response?.data || error.message);
      }
    };

    fetchAnalysis();
    fetchInterviewScore();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--pp-bg)] flex items-center justify-center">
        <h1 className="text-[var(--pp-text)] text-xl font-display">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <>
      <Topbar />

      <div className="min-h-screen bg-[var(--pp-bg)] p-8">
        {/* ACTIONS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => router.push("/resume")}
            className="px-6 py-3 rounded-lg bg-[var(--pp-ink)] text-[var(--pp-panel)] font-semibold hover:brightness-110 transition flex items-center gap-2"
          >
            <FileText size={18} />
            Upload Resume
          </button>

          <button
            onClick={() => router.push("/interview")}
            className="px-6 py-3 rounded-lg bg-[var(--pp-panel-raised)] border border-[var(--pp-line-strong)] text-[var(--pp-ink)] font-semibold hover:bg-[var(--pp-line)]/30 transition flex items-center gap-2"
          >
            <Brain size={18} />
            Start Interview
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-3 rounded-lg bg-transparent border border-[var(--pp-line)] text-[var(--pp-text-muted)] hover:border-[var(--pp-line-strong)] hover:text-[var(--pp-text)] transition flex items-center gap-2"
          >
            Profile
          </button>
        </div>

        {/* STATS — the "marks obtained" row */}
        <div className="grid lg:grid-cols-4 gap-6">
          <StatCard
            title="Resume Score"
            value={`${(analysis?.resumeScore || 0) * 10}%`}
            subtitle="AI Resume Rating"
            color=""
            icon={FileText}
          />

          <StatCard
            title="ATS Score"
            value={`${(analysis?.atsScore || 0) * 10}%`}
            subtitle="Recruiter Compatibility"
            color=""
            icon={Target}
          />

          <StatCard
            title="Interview Score"
            value={interviewScore !== null ? `${Math.round(interviewScore * 10)}%` : "N/A"}
            subtitle={interviewScore !== null ? "Based on your interviews" : "Practice an interview first"}
            color=""
            icon={Brain}
          />

          <StatCard
            title="Placement Readiness"
            value={`${Math.round((((analysis?.resumeScore || 0) + (analysis?.atsScore || 0) + (interviewScore || 0)) / 3) * 10)}%`}
            subtitle="Overall Score"
            color=""
            icon={TrendingUp}
          />
        </div>

        {/* INSIGHTS — remarks section, like a report card's teacher remarks */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">
            <div className="flex gap-3 items-center mb-5">
              <CheckCircle size={20} className="text-[var(--pp-pass)]" />
              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold">
                Strengths
              </h2>
            </div>

            {analysis?.strengths?.length ? (
              analysis.strengths.map((x: string, i: number) => (
                <p
                  key={i}
                  className="text-sm text-[var(--pp-text-muted)] bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] p-3 rounded-md mb-2"
                >
                  {x}
                </p>
              ))
            ) : (
              <p className="text-sm text-[var(--pp-text-faint)]">
                Upload a resume to see your strengths.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">
            <div className="flex gap-3 items-center mb-5">
              <AlertTriangle size={20} className="text-[var(--pp-gold)]" />
              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold">
                Improve
              </h2>
            </div>

            {analysis?.weaknesses?.length ? (
              analysis.weaknesses.map((x: string, i: number) => (
                <p
                  key={i}
                  className="text-sm text-[var(--pp-text-muted)] bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] p-3 rounded-md mb-2"
                >
                  {x}
                </p>
              ))
            ) : (
              <p className="text-sm text-[var(--pp-text-faint)]">
                Upload a resume to see improvement areas.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">
            <div className="flex gap-3 items-center mb-5">
              <Lightbulb size={20} className="text-[var(--pp-stamp)]" />
              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold">
                Missing Skills
              </h2>
            </div>

            {analysis?.missingSkills?.length ? (
              analysis.missingSkills.map((x: string, i: number) => (
                <p
                  key={i}
                  className="text-sm text-[var(--pp-text-muted)] bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] p-3 rounded-md mb-2"
                >
                  {x}
                </p>
              ))
            ) : (
              <p className="text-sm text-[var(--pp-text-faint)]">
                Upload a resume to see missing skills.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
