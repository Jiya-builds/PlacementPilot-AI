"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function ResumeUploadPage(){

  const [file,setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");

  const router = useRouter();



  const uploadResume = async()=>{


    if(!file){

      setMessage("Please select PDF resume");
      return;

    }


    const formData = new FormData();

    formData.append(
      "resume",
      file
    );

    // Optional — lets the AI tailor its analysis against a specific
    // job posting instead of just general placement readiness.
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription.trim());
    }


    try{


      setLoading(true);


      const res = await api.post(
        "/resume/upload",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      );


      console.log(
        "UPLOAD RESPONSE:",
        res.data
      );


      setMessage(
        "Resume uploaded successfully 🎉"
      );


      // AI analysis run

      await api.get(
        "/ai/resume-analysis"
      );


      router.push("/dashboard");



    }catch(error:any){


      console.log(
        error.response?.data || error.message
      );


      setMessage(
        "Upload failed"
      );


    }
    finally{

      setLoading(false);

    }


  };



  return (

    <div className="min-h-screen bg-[var(--pp-bg)] flex items-center justify-center p-6">


      <div className="max-w-xl w-full bg-[var(--pp-panel)] border border-[var(--pp-line)] rounded-3xl p-10">


        <h1 className="text-3xl font-bold text-[var(--pp-text)] text-center">
          Upload Resume 📄
        </h1>


        <p className="text-[var(--pp-text-muted)] text-center mt-3">
          Upload your PDF resume and let AI analyze it.
        </p>




        <input

          type="file"

          accept="application/pdf"

          onChange={(e)=>
            setFile(
              e.target.files?.[0] || null
            )
          }

          className="
          mt-8
          w-full
          text-[var(--pp-text)]
          bg-[var(--pp-panel)]
          border
          border-[var(--pp-line)]
          rounded-xl
          p-4
          "

        />

        {/* Job description — optional, tailors the analysis to a
            specific role instead of just general placement readiness */}
        <div className="mt-6">
          <label className="text-sm text-[var(--pp-text-muted)]">
            Job Description <span className="text-[var(--pp-text-faint)]">(optional)</span>
          </label>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description here to see how well your resume matches this specific role..."
            rows={6}
            className="
            mt-2
            w-full
            text-[var(--pp-text)]
            bg-[var(--pp-panel)]
            border
            border-[var(--pp-line)]
            rounded-xl
            p-4
            text-sm
            outline-none
            focus:border-[var(--pp-ink)]
            placeholder:text-[var(--pp-text-faint)]
            resize-none
            "
          />

          <p className="text-xs text-[var(--pp-text-faint)] mt-2">
            Leave this blank for a general resume analysis, or paste a job
            description to get a match score against that specific role.
          </p>
        </div>




        <button

          onClick={uploadResume}

          className="
          mt-6
          w-full
          py-3
          rounded-xl
          bg-gradient-to-r
          from-[var(--pp-ink)]
          to-[var(--pp-ink-soft)]
          text-[var(--pp-text)]
          font-semibold
          "

        >

          {
            loading
            ?
            "Uploading..."
            :
            "Upload & Analyze"
          }


        </button>



        {
          message &&

          <p className="text-center text-[var(--pp-ink)] mt-5">
            {message}
          </p>

        }



      </div>


    </div>

  );

}
