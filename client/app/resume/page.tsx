"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function ResumeUploadPage(){

  const [file,setFile] = useState<File | null>(null);
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

    <div className="min-h-screen bg-white flex items-center justify-center p-6">


      <div className="max-w-xl w-full bg-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-10">


        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Upload Resume 📄
        </h1>


        <p className="text-gray-600 text-center mt-3">
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
          text-gray-900
          bg-orange-50
          border
          border-orange-200
          rounded-xl
          p-4
          "

        />




        <button

          onClick={uploadResume}

          className="
          mt-6
          w-full
          py-3
          rounded-xl
          bg-gradient-to-r
          from-orange-600
          to-amber-600
          text-white
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

          <p className="text-center text-orange-600 mt-5">
            {message}
          </p>

        }



      </div>


    </div>

  );

}