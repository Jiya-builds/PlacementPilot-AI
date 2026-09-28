"use client";

import { useState } from "react";
import api from "@/services/api";

export default function UploadPage(){

  const [file,setFile] = useState<File | null>(null);
  const [message,setMessage] = useState("");



  const uploadResume = async()=>{

    if(!file){
      setMessage("Please select resume");
      return;
    }


    const formData = new FormData();

    formData.append("resume",file);


    try{

      const res = await api.post(
        "/resume/upload",
        formData,
      );


      console.log(res.data);

      setMessage("Resume uploaded successfully ✅");


    }catch(error:any){

      console.log(
        error.response?.data || error.message
      );

      setMessage("Upload failed");

    }

  };


return(
<div className="min-h-screen bg-white flex items-center justify-center p-4">

<div className="w-full max-w-xl bg-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-10">

<h1 className="text-3xl text-gray-900 font-bold mb-6">
Upload Resume
</h1>


<input
type="file"
accept=".pdf"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
className="text-gray-900"
/>


<button
onClick={uploadResume}
className="mt-6 w-full bg-orange-600 py-3 rounded-xl text-white"
>
Upload
</button>


<p className="text-gray-700 mt-4">
{message}
</p>


</div>

</div>
)

}
