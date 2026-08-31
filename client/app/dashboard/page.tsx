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

        const res = await api.get(
          "/ai/resume-analysis"
        );

        console.log("ANALYSIS DATA:", res.data);

        setAnalysis(res.data.analysis);


      } catch(error:any){

        console.log(
          "ANALYSIS ERROR:",
          error.response?.data || error.message
        );

      }
      finally{
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

        console.log(
          "INTERVIEW SCORE ERROR:",
          error.response?.data || error.message
        );

      }

    };


    fetchAnalysis();
    fetchInterviewScore();

  }, []);




  if(loading){

    return(
      <div className="min-h-screen bg-[var(--pp-bg)] flex items-center justify-center">

        <h1 className="text-[var(--pp-text)] text-xl">
          Loading Dashboard...
        </h1>

      </div>
    )

  }



  return (

    <>

    <Topbar />


    <div className="min-h-screen bg-[var(--pp-bg)] p-8">


      {/* BUTTONS */}

      <div className="flex gap-4 mb-8">


        <button
        onClick={()=>router.push("/resume")}
        className="px-6 py-3 rounded-xl bg-[var(--pp-ink)] text-[var(--pp-text)] font-semibold hover:scale-105 transition"
        >
          📄 Upload Resume
        </button>



        <button
        onClick={()=>router.push("/interview")}
        className="px-6 py-3 rounded-xl bg-[var(--pp-ink-soft)] text-[var(--pp-text)] font-semibold hover:scale-105 transition"
        >
          🤖 Start Interview
        </button>



        <button
        onClick={()=>router.push("/profile")}
        className="px-6 py-3 rounded-xl bg-[var(--pp-panel-raised)] border border-[var(--pp-line)] text-[var(--pp-text)]"
        >
          👤 Profile
        </button>


      </div>





      {/* STATS */}

      <div className="grid lg:grid-cols-4 gap-6">


      <StatCard
      title="Resume Score"
      value={`${(analysis?.resumeScore || 0)*10}%`}
      subtitle="AI Resume Rating"
      color="text-[var(--pp-pass)]"
      icon={FileText}
      />



      <StatCard
      title="ATS Score"
      value={`${(analysis?.atsScore || 0)*10}%`}
      subtitle="Recruiter Compatibility"
      color="text-[var(--pp-ink)]"
      icon={Target}
      />



      <StatCard
      title="Interview Score"
      value={interviewScore !== null ? `${Math.round(interviewScore * 10)}%` : "N/A"}
      subtitle={interviewScore !== null ? "Based on your interviews" : "Practice an interview first"}
      color="text-[var(--pp-gold)]"
      icon={Brain}
      />



      <StatCard
      title="Placement Readiness"
      value={`${Math.round((((analysis?.resumeScore||0)+(analysis?.atsScore||0)+(interviewScore||0))/3)*10)}%`}
      subtitle="Overall Score"
      color="text-[var(--pp-ink)]"
      icon={TrendingUp}
      />


      </div>





      {/* INSIGHTS */}

      <div className="grid lg:grid-cols-3 gap-6 mt-8">


      <div className="rounded-3xl border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

      <div className="flex gap-3 items-center mb-5">
      <CheckCircle className="text-[var(--pp-pass)]"/>
      <h2 className="text-[var(--pp-text)] text-xl">
      Strengths
      </h2>
      </div>


      {
      analysis?.strengths?.map((x:string,i:number)=>(
        <p key={i} className="text-[var(--pp-text-muted)] bg-[var(--pp-panel)] p-3 rounded-xl mb-2">
          ✓ {x}
        </p>
      ))
      }


      </div>





      <div className="rounded-3xl border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

      <div className="flex gap-3 items-center mb-5">
      <AlertTriangle className="text-[var(--pp-gold)]"/>
      <h2 className="text-[var(--pp-text)] text-xl">
      Improve
      </h2>
      </div>


      {
      analysis?.weaknesses?.map((x:string,i:number)=>(
        <p key={i} className="text-[var(--pp-text-muted)] bg-[var(--pp-panel)] p-3 rounded-xl mb-2">
          ⚠ {x}
        </p>
      ))
      }


      </div>






      <div className="rounded-3xl border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

      <div className="flex gap-3 items-center mb-5">
      <Lightbulb className="text-[var(--pp-ink)]"/>
      <h2 className="text-[var(--pp-text)] text-xl">
      Missing Skills
      </h2>
      </div>


      {
      analysis?.missingSkills?.map((x:string,i:number)=>(
        <p key={i} className="text-[var(--pp-text-muted)] bg-[var(--pp-panel)] p-3 rounded-xl mb-2">
          🚀 {x}
        </p>
      ))
      }


      </div>



      </div>



      {/* JOB MATCH — only shown when the resume was analyzed against a
          specific job description */}
      {analysis?.jobMatch && (
        <div className="mt-8 rounded-3xl border border-[var(--pp-line)] bg-[var(--pp-panel)] p-6">

          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-3 items-center">
              <Target className="text-[var(--pp-ink)]" />
              <h2 className="text-[var(--pp-text)] text-xl">
                Job Match
              </h2>
            </div>

            <span className="font-tabular text-2xl font-semibold text-[var(--pp-ink)]">
              {(analysis.jobMatch.matchScore || 0) * 10}%
            </span>
          </div>

          {analysis.jobMatch.summary && (
            <p className="text-[var(--pp-text-muted)] mb-5">
              {analysis.jobMatch.summary}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs tracking-wider text-[var(--pp-text-faint)] mb-2">
                MATCHED SKILLS
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.jobMatch.matchedSkills?.length ? (
                  analysis.jobMatch.matchedSkills.map((s: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full bg-[var(--pp-pass)]/10 text-[var(--pp-pass)]"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[var(--pp-text-faint)]">None found</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-wider text-[var(--pp-text-faint)] mb-2">
                MISSING FOR THIS ROLE
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.jobMatch.missingForJob?.length ? (
                  analysis.jobMatch.missingForJob.map((s: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full bg-[var(--pp-red)]/10 text-[var(--pp-red)]"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[var(--pp-text-faint)]">None — great fit!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>


    </>

  );

}