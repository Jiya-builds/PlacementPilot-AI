"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Rocket, Lightbulb, Code } from "lucide-react";


export default function RoadmapPage(){

  const [analysis,setAnalysis] = useState<any>(null);
  const [loading,setLoading] = useState(true);



  useEffect(()=>{


    const fetchRoadmap = async()=>{

      try{

        const res = await api.get(
          "/ai/resume-analysis"
        );

        console.log("ROADMAP DATA:", res.data);


        console.log(
          "ROADMAP DATA:",
          res.data.analysis.roadmap
        );
console.log(res.data.analysis);

        setAnalysis(
          res.data.analysis
        );


      }catch(error:any){

        console.log(
          error.response?.data || error.message
        );

      }
      finally{

        setLoading(false);

      }

    };


    fetchRoadmap();


  },[]);





  if(loading){

    return(

      <div className="min-h-screen bg-white flex items-center justify-center">

        <h1 className="text-gray-900 text-xl">
          Generating AI Roadmap...
        </h1>

      </div>

    );

  }




  return(

    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-10">


      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
        AI Career Roadmap 🚀
      </h1>





      {/* Growth Plan */}

<div className="rounded-3xl border border-orange-200 bg-orange-50 p-5 sm:p-8">

  <div className="flex items-center gap-3 mb-6">
    <Rocket className="text-orange-600"/>

    <h2 className="text-2xl text-gray-900 font-bold">
      Your Growth Plan
    </h2>
  </div>


  {
[
  {
    title:"🚀 Short Term",
    data: analysis?.roadmap?.shortTerm
  },
  {
    title:"📈 Mid Term",
    data: analysis?.roadmap?.midTerm
  },
  {
    title:"🎯 Long Term",
    data: analysis?.roadmap?.longTerm
  }
].map((section:any,index:number)=>(

<div
key={index}
className="bg-orange-50 rounded-xl p-6 mb-4"
>

<h3 className="text-orange-600 font-bold text-xl mb-4">
{section.title}
</h3>

{
section.data?.map((item:string,i:number)=>(

<p
key={i}
className="text-gray-700 mb-2"
>
✓ {item}
</p>

))
}

</div>

))
}

</div>


      {/* Missing Skills */}


      <div className="
      mt-8
      rounded-3xl
      border
      border-orange-200
      bg-orange-50
      p-5 sm:p-8
      ">


        <div className="flex items-center gap-3 mb-5">


          <Lightbulb className="text-amber-600"/>


          <h2 className="text-2xl text-gray-900 font-bold">
            Skills To Learn
          </h2>


        </div>




        <div className="flex flex-wrap gap-3">


          {
            analysis?.missingSkills?.map(
              (skill:string,index:number)=>(

                <span
                key={index}
                className="
                px-4
                py-2
                rounded-full
                bg-orange-600/20
                text-orange-700
                "
                >

                  {skill}

                </span>

              )
            )
          }


        </div>


      </div>









      {/* Suggested Projects */}


      <div className="
      mt-8
      rounded-3xl
      border
      border-orange-200
      bg-orange-50
      p-5 sm:p-8
      ">



        <div className="flex items-center gap-3 mb-5">


          <Code className="text-yellow-600"/>


          <h2 className="text-2xl text-gray-900 font-bold">
            Suggested Projects
          </h2>


        </div>





        <div className="grid md:grid-cols-2 gap-5">


          {
analysis?.suggestedProjects?.map(
(project:any,index:number)=>(
<div key={index}>

<h3>{project.title}</h3>

<p>{project.description}</p>

<div>
{
(project.skills || project.technologies || []).map((tech:string)=>(
<span key={tech}>{tech}</span>
))
}
</div>

</div>
))
}


        </div>


      </div>




    </div>

  );

}