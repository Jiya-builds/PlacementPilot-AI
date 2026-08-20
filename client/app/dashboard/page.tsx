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
  Search,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [analysis, setAnalysis] = useState<any>(null);
  const [interviewScore, setInterviewScore] =
    useState<number | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [atsLoading, setAtsLoading] =
    useState(false);

  const [atsResult, setAtsResult] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  /* ============================================================
     FETCH ANALYSIS
  ============================================================ */

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(
          "/ai/my-analysis"
        );

        const savedAnalysis =
          res.data.analysis;

        setAnalysis(savedAnalysis);

        if (savedAnalysis?.atsDetails) {
          setAtsResult({
            atsScore:
              savedAnalysis.atsScore ?? null,

            matchedSkills:
              savedAnalysis.atsDetails
                .matchedSkills || [],

            missingSkills:
              savedAnalysis.atsDetails
                .missingSkills || [],

            matchedKeywords:
              savedAnalysis.atsDetails
                .matchedKeywords || [],

            missingKeywords:
              savedAnalysis.atsDetails
                .missingKeywords || [],

            experienceMatch:
              savedAnalysis.atsDetails
                .experienceMatch || "",

            projectMatch:
              savedAnalysis.atsDetails
                .projectMatch || "",

            educationMatch:
              savedAnalysis.atsDetails
                .educationMatch || "",

            summary:
              savedAnalysis.atsDetails
                .summary || "",

            recommendations:
              savedAnalysis.atsDetails
                .recommendations || [],
          });

          setJobDescription(
            savedAnalysis.atsDetails
              .jobDescription || ""
          );
        }
      } catch (error: any) {
        console.log(
          "ANALYSIS ERROR:",
          error.response?.data ||
            error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  /* ============================================================
     FETCH INTERVIEW SCORE
  ============================================================ */

  useEffect(() => {
    const fetchInterviewScore =
      async () => {
        try {
          const res =
            await api.get(
              "/ai/interview-history"
            );

          const interviews =
            Array.isArray(
              res.data.interviews
            )
              ? res.data.interviews
              : [];

          if (interviews.length > 0) {
            const scores =
              interviews
                .map((iv: any) =>
                  Number(iv.score)
                )
                .filter(
                  (score: number) =>
                    !isNaN(score)
                );

            if (scores.length > 0) {
              const average =
                scores.reduce(
                  (
                    sum: number,
                    score: number
                  ) =>
                    sum + score,
                  0
                ) / scores.length;

              setInterviewScore(
                average
              );
            }
          }
        } catch (error: any) {
          console.log(
            "INTERVIEW SCORE ERROR:",
            error.response?.data ||
              error.message
          );
        }
      };

    fetchInterviewScore();
  }, []);

  /* ============================================================
     CALCULATE ATS
  ============================================================ */

  const handleATSAnalysis =
    async () => {
      if (
        jobDescription.trim().length < 50
      ) {
        alert(
          "Please paste a valid Job Description."
        );
        return;
      }

      setAtsLoading(true);

      try {
        const res =
          await api.post(
            "/ai/ats-match",
            {
              jobDescription:
                jobDescription.trim(),
            }
          );

        if (res.data.success) {
          const ats = res.data.ats;

          setAtsResult(ats);

          setAnalysis(
            (prev: any) => ({
              ...prev,

              atsScore:
                ats.atsScore,

              atsDetails: {
                jobDescription:
                  jobDescription.trim(),

                matchedSkills:
                  ats.matchedSkills || [],

                missingSkills:
                  ats.missingSkills || [],

                matchedKeywords:
                  ats.matchedKeywords || [],

                missingKeywords:
                  ats.missingKeywords || [],

                experienceMatch:
                  ats.experienceMatch || "",

                projectMatch:
                  ats.projectMatch || "",

                educationMatch:
                  ats.educationMatch || "",

                summary:
                  ats.summary || "",

                recommendations:
                  ats.recommendations || [],
              },
            })
          );
        }
      } catch (error: any) {
        console.log(
          "ATS ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data?.message ||
            "Unable to calculate ATS score."
        );
      } finally {
        setAtsLoading(false);
      }
    };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--pp-bg)] flex items-center justify-center">
        <h1 className="text-[var(--pp-text)] text-xl font-display">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  /* ============================================================
     SCORES
  ============================================================ */

  const resumeScore =
    typeof analysis?.resumeScore ===
    "number"
      ? Math.round(
          analysis.resumeScore
        )
      : null;

  const atsScore =
    typeof atsResult?.atsScore ===
    "number"
      ? Math.round(
          atsResult.atsScore
        )
      : typeof analysis?.atsScore ===
        "number"
      ? Math.round(
          analysis.atsScore
        )
      : null;

  const interviewPercentage =
    interviewScore !== null
      ? Math.round(
          interviewScore * 10
        )
      : null;

  const availableScores =
    [
      resumeScore,
      atsScore,
      interviewPercentage,
    ].filter(
      (
        score
      ): score is number =>
        score !== null
    );

  const placementReadiness =
    availableScores.length > 0
      ? Math.round(
          availableScores.reduce(
            (
              sum,
              score
            ) =>
              sum + score,
            0
          ) /
            availableScores.length
        )
      : null;

  return (
    <>
      <Topbar />

      <div className="min-h-screen bg-[var(--pp-bg)] p-8">

        {/* ACTION BUTTONS */}

        <div className="flex gap-4 mb-8">

          <button
            onClick={() =>
              router.push("/resume")
            }
            className="px-6 py-3 rounded-lg bg-[var(--pp-ink)] text-[var(--pp-panel)] font-semibold hover:brightness-110 transition flex items-center gap-2"
          >
            <FileText size={18} />
            Upload Resume
          </button>

          <button
            onClick={() =>
              router.push("/interview")
            }
            className="px-6 py-3 rounded-lg bg-[var(--pp-panel-raised)] border border-[var(--pp-line-strong)] text-[var(--pp-ink)] font-semibold hover:bg-[var(--pp-line)]/30 transition flex items-center gap-2"
          >
            <Brain size={18} />
            Start Interview
          </button>

          <button
            onClick={() =>
              router.push("/profile")
            }
            className="px-6 py-3 rounded-lg bg-transparent border border-[var(--pp-line)] text-[var(--pp-text-muted)] hover:border-[var(--pp-line-strong)] hover:text-[var(--pp-text)] transition"
          >
            Profile
          </button>

        </div>

        {/* ATS */}

        <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6 mb-8">

          <div className="flex items-center gap-3 mb-4">

            <Search
              size={22}
              className="text-[var(--pp-stamp)]"
            />

            <div>
              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold">
                Check ATS Match
              </h2>

              <p className="text-sm text-[var(--pp-text-muted)] mt-1">
                Paste the Job Description to
                calculate how well your resume
                matches the specific role.
              </p>
            </div>

          </div>

          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(
                e.target.value
              )
            }
            placeholder="Paste the complete Job Description here..."
            className="w-full min-h-[180px] rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel-raised)] text-[var(--pp-text)] placeholder:text-[var(--pp-text-faint)] p-4 outline-none focus:border-[var(--pp-line-strong)] resize-y"
          />

          <div className="flex justify-between items-center mt-4">

            <p className="text-xs text-[var(--pp-text-faint)]">
              Minimum 50 characters
            </p>

            <button
              onClick={
                handleATSAnalysis
              }
              disabled={atsLoading}
              className="px-6 py-3 rounded-lg bg-[var(--pp-ink)] text-[var(--pp-panel)] font-semibold hover:brightness-110 transition disabled:opacity-50"
            >
              {atsLoading
                ? "Analyzing..."
                : "Calculate ATS Match"}
            </button>

          </div>

        </div>

        {/* STATS */}

        <div className="grid lg:grid-cols-4 gap-6">

          <StatCard
            title="Resume Score"
            value={
              resumeScore !== null
                ? `${resumeScore}%`
                : "N/A"
            }
            subtitle="Resume Quality"
            color=""
            icon={FileText}
          />

          <StatCard
            title="ATS Score"
            value={
              atsScore !== null
                ? `${atsScore}%`
                : "N/A"
            }
            subtitle={
              atsScore !== null
                ? "Match with Job Description"
                : "Add a Job Description"
            }
            color=""
            icon={Target}
          />

          <StatCard
            title="Interview Score"
            value={
              interviewPercentage !==
              null
                ? `${interviewPercentage}%`
                : "N/A"
            }
            subtitle={
              interviewPercentage !==
              null
                ? "Based on your interviews"
                : "Practice an interview first"
            }
            color=""
            icon={Brain}
          />

          <StatCard
            title="Placement Readiness"
            value={
              placementReadiness !==
              null
                ? `${placementReadiness}%`
                : "N/A"
            }
            subtitle="Overall Score"
            color=""
            icon={TrendingUp}
          />

        </div>

        {/* ATS DETAILS */}

        {atsResult && (
          <div className="grid lg:grid-cols-2 gap-6 mt-8">

            {/* MATCHED */}

            <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold mb-4">
                Matched Skills
              </h2>

              {atsResult.matchedSkills?.length ? (
                atsResult.matchedSkills.map(
                  (
                    skill: string,
                    i: number
                  ) => (
                    <span
                      key={i}
                      className="inline-block text-sm mr-2 mb-2 px-3 py-2 rounded-md bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] text-[var(--pp-text-muted)]"
                    >
                      ✓ {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-[var(--pp-text-faint)]">
                  No matching skills found.
                </p>
              )}

            </div>

            {/* MISSING */}

            <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold mb-4">
                Missing Job Skills
              </h2>

              {atsResult.missingSkills?.length ? (
                atsResult.missingSkills.map(
                  (
                    skill: string,
                    i: number
                  ) => (
                    <span
                      key={i}
                      className="inline-block text-sm mr-2 mb-2 px-3 py-2 rounded-md bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] text-[var(--pp-text-muted)]"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-[var(--pp-pass)]">
                  No major missing skills found.
                </p>
              )}

            </div>

            {/* SUMMARY */}

            <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6 lg:col-span-2">

              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold mb-3">
                ATS Analysis
              </h2>

              <p className="text-sm text-[var(--pp-text-muted)] leading-6">
                {atsResult.summary ||
                  "No summary available."}
              </p>

            </div>

            {/* RECOMMENDATIONS */}

            <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6 lg:col-span-2">

              <div className="flex items-center gap-3 mb-4">

                <Lightbulb
                  size={20}
                  className="text-[var(--pp-stamp)]"
                />

                <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold">
                  ATS Recommendations
                </h2>

              </div>

              {atsResult.recommendations?.length ? (
                atsResult.recommendations.map(
                  (
                    recommendation: string,
                    i: number
                  ) => (
                    <p
                      key={i}
                      className="text-sm text-[var(--pp-text-muted)] bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] p-3 rounded-md mb-2"
                    >
                      {recommendation}
                    </p>
                  )
                )
              ) : (
                <p className="text-sm text-[var(--pp-text-faint)]">
                  No recommendations available.
                </p>
              )}

            </div>

          </div>
        )}

        {/* RESUME INSIGHTS */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* STRENGTHS */}

          <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

            <div className="flex gap-3 items-center mb-5">

              <CheckCircle
                size={20}
                className="text-[var(--pp-pass)]"
              />

              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold">
                Strengths
              </h2>

            </div>

            {analysis?.strengths?.length ? (
              analysis.strengths.map(
                (
                  x: string,
                  i: number
                ) => (
                  <p
                    key={i}
                    className="text-sm text-[var(--pp-text-muted)] bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] p-3 rounded-md mb-2"
                  >
                    {x}
                  </p>
                )
              )
            ) : (
              <p className="text-sm text-[var(--pp-text-faint)]">
                Upload a resume to see your strengths.
              </p>
            )}

          </div>

          {/* IMPROVE */}

          <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

            <div className="flex gap-3 items-center mb-5">

              <AlertTriangle
                size={20}
                className="text-[var(--pp-gold)]"
              />

              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold">
                Improve
              </h2>

            </div>

            {analysis?.weaknesses?.length ? (
              analysis.weaknesses.map(
                (
                  x: string,
                  i: number
                ) => (
                  <p
                    key={i}
                    className="text-sm text-[var(--pp-text-muted)] bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] p-3 rounded-md mb-2"
                  >
                    {x}
                  </p>
                )
              )
            ) : (
              <p className="text-sm text-[var(--pp-text-faint)]">
                Upload a resume to see improvement areas.
              </p>
            )}

          </div>

          {/* MISSING SKILLS */}

          <div className="rounded-lg border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

            <div className="flex gap-3 items-center mb-5">

              <Lightbulb
                size={20}
                className="text-[var(--pp-stamp)]"
              />

              <h2 className="text-[var(--pp-text)] text-lg font-display font-semibold">
                Missing Skills
              </h2>

            </div>

            {analysis?.missingSkills?.length ? (
              analysis.missingSkills.map(
                (
                  x: string,
                  i: number
                ) => (
                  <p
                    key={i}
                    className="text-sm text-[var(--pp-text-muted)] bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] p-3 rounded-md mb-2"
                  >
                    {x}
                  </p>
                )
              )
            ) : (
              <p className="text-sm text-[var(--pp-text-faint)]">
                Upload a resume to see recommended skills.
              </p>
            )}

          </div>

        </div>

      </div>
    </>
  );
}