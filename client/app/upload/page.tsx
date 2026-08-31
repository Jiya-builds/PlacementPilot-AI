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
<div className="min-h-screen bg-[var(--pp-bg)] flex items-center justify-center">

<div className="bg-[var(--pp-panel)] border border-[var(--pp-line)] rounded-3xl p-10">

<h1 className="text-3xl text-[var(--pp-text)] font-bold mb-6">
Upload Resume
</h1>


<input
type="file"
accept=".pdf"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
className="text-[var(--pp-text)]"
/>


<button
onClick={uploadResume}
className="mt-6 w-full bg-[var(--pp-ink)] py-3 rounded-xl text-[var(--pp-text)]"
>
Upload
</button>


<p className="text-[var(--pp-text-muted)] mt-4">
{message}
</p>


</div>

</div>
)

}
