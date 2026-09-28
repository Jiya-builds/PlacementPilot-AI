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


    fetchAnalysis();

  }, []);




  if(loading){

    return(
      <div className="min-h-screen bg-white flex items-center justify-center">

        <h1 className="text-gray-900 text-xl">
          Loading Dashboard...
        </h1>

      </div>
    )

  }



  return (

    <>

    <Topbar />


    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">


      {/* BUTTONS */}

      <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 md:mb-8">


        <button
        onClick={()=>router.push("/resume")}
        className="px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:scale-105 transition"
        >
          📄 Upload Resume
        </button>



        <button
        onClick={()=>router.push("/interview")}
        className="px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:scale-105 transition"
        >
          🤖 Start Interview
        </button>



        <button
        onClick={()=>router.push("/profile")}
        className="px-6 py-3 rounded-xl bg-orange-100/70 border border-orange-200 text-gray-900"
        >
          👤 Profile
        </button>


      </div>





      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">


      <StatCard
      title="Resume Score"
      value={`${(analysis?.resumeScore || 0)*10}%`}
      subtitle="AI Resume Rating"
      color="text-green-600"
      icon={FileText}
      />



      <StatCard
      title="ATS Score"
      value={`${(analysis?.atsScore || 0)*10}%`}
      subtitle="Recruiter Compatibility"
      color="text-yellow-600"
      icon={Target}
      />



      <StatCard
      title="Interview Score"
      value="85%"
      subtitle="AI Prediction"
      color="text-amber-600"
      icon={Brain}
      />



      <StatCard
      title="Placement Readiness"
      value={`${Math.round((((analysis?.resumeScore||0)+(analysis?.atsScore||0))/2)*10)}%`}
      subtitle="Overall Score"
      color="text-orange-600"
      icon={TrendingUp}
      />


      </div>





      {/* INSIGHTS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-8">


      <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">

      <div className="flex gap-3 items-center mb-5">
      <CheckCircle className="text-green-600"/>
      <h2 className="text-gray-900 text-xl">
      Strengths
      </h2>
      </div>


      {
      analysis?.strengths?.map((x:string,i:number)=>(
        <p key={i} className="text-gray-700 bg-orange-50 p-3 rounded-xl mb-2">
          ✓ {x}
        </p>
      ))
      }


      </div>





      <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">

      <div className="flex gap-3 items-center mb-5">
      <AlertTriangle className="text-amber-600"/>
      <h2 className="text-gray-900 text-xl">
      Improve
      </h2>
      </div>


      {
      analysis?.weaknesses?.map((x:string,i:number)=>(
        <p key={i} className="text-gray-700 bg-orange-50 p-3 rounded-xl mb-2">
          ⚠ {x}
        </p>
      ))
      }


      </div>






      <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">

      <div className="flex gap-3 items-center mb-5">
      <Lightbulb className="text-orange-600"/>
      <h2 className="text-gray-900 text-xl">
      Missing Skills
      </h2>
      </div>


      {
      analysis?.missingSkills?.map((x:string,i:number)=>(
        <p key={i} className="text-gray-700 bg-orange-50 p-3 rounded-xl mb-2">
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