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
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">

        <h1 className="text-white text-xl">
          Loading Dashboard...
        </h1>

      </div>
    )

  }



  return (

    <>

    <Topbar />


    <div className="min-h-screen bg-[#050816] p-8">


      {/* BUTTONS */}

      <div className="flex gap-4 mb-8">


        <button
        onClick={()=>router.push("/resume")}
        className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:scale-105 transition"
        >
          📄 Upload Resume
        </button>



        <button
        onClick={()=>router.push("/interview")}
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:scale-105 transition"
        >
          🤖 Start Interview
        </button>



        <button
        onClick={()=>router.push("/profile")}
        className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white"
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
      color="text-green-400"
      icon={FileText}
      />



      <StatCard
      title="ATS Score"
      value={`${(analysis?.atsScore || 0)*10}%`}
      subtitle="Recruiter Compatibility"
      color="text-cyan-400"
      icon={Target}
      />



      <StatCard
      title="Interview Score"
      value={interviewScore !== null ? `${Math.round(interviewScore * 10)}%` : "N/A"}
      subtitle={interviewScore !== null ? "Based on your interviews" : "Practice an interview first"}
      color="text-yellow-400"
      icon={Brain}
      />



      <StatCard
      title="Placement Readiness"
      value={`${Math.round((((analysis?.resumeScore||0)+(analysis?.atsScore||0)+(interviewScore||0))/3)*10)}%`}
      subtitle="Overall Score"
      color="text-purple-400"
      icon={TrendingUp}
      />


      </div>





      {/* INSIGHTS */}

      <div className="grid lg:grid-cols-3 gap-6 mt-8">


      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

      <div className="flex gap-3 items-center mb-5">
      <CheckCircle className="text-green-400"/>
      <h2 className="text-white text-xl">
      Strengths
      </h2>
      </div>


      {
      analysis?.strengths?.map((x:string,i:number)=>(
        <p key={i} className="text-gray-300 bg-white/5 p-3 rounded-xl mb-2">
          ✓ {x}
        </p>
      ))
      }


      </div>





      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

      <div className="flex gap-3 items-center mb-5">
      <AlertTriangle className="text-yellow-400"/>
      <h2 className="text-white text-xl">
      Improve
      </h2>
      </div>


      {
      analysis?.weaknesses?.map((x:string,i:number)=>(
        <p key={i} className="text-gray-300 bg-white/5 p-3 rounded-xl mb-2">
          ⚠ {x}
        </p>
      ))
      }


      </div>






      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

      <div className="flex gap-3 items-center mb-5">
      <Lightbulb className="text-purple-400"/>
      <h2 className="text-white text-xl">
      Missing Skills
      </h2>
      </div>


      {
      analysis?.missingSkills?.map((x:string,i:number)=>(
        <p key={i} className="text-gray-300 bg-white/5 p-3 rounded-xl mb-2">
          🚀 {x}
        </p>
      ))
      }


      </div>



      </div>


    </div>


    </>

  );

}