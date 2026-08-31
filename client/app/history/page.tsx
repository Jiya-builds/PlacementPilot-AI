"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function HistoryPage(){

  const [history,setHistory] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{


    const fetchHistory = async()=>{

      try{

        const res = await api.get(
          "/ai/interview-history"
        );


        console.log(
          "INTERVIEW HISTORY:",
          res.data
        );


        setHistory(
          res.data.interviews || []
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


    fetchHistory();


  },[]);



  if(loading){

    return(
      <div className="min-h-screen bg-[var(--pp-bg)] flex items-center justify-center">

        <h1 className="text-[var(--pp-text)] text-xl">
          Loading History...
        </h1>

      </div>
    )

  }



  return(

    <div className="min-h-screen bg-[var(--pp-bg)] p-10">


      <h1 className="text-4xl font-bold text-[var(--pp-text)] mb-8">
        Interview History 📚
      </h1>



      {
        history.length === 0 ?

        (
          <div className="text-[var(--pp-text-muted)] text-lg">
            No interviews attempted yet.
          </div>
        )


        :

        (

        <div className="space-y-6">


        {
          history.map((item,index)=>(


            <div
              key={index}
              className="
              rounded-3xl
              border
              border-[var(--pp-line)]
              bg-[var(--pp-panel)]
              p-8
              "
            >


              <div className="flex justify-between">

                <h2 className="text-[var(--pp-ink)] text-xl font-bold">
                  Interview {index+1}
                </h2>


                <span className="text-[var(--pp-pass)] font-bold">
                  Score {item.score}/10
                </span>


              </div>



              <div className="mt-5">

                <p className="text-[var(--pp-text-muted)]">
                  Question
                </p>

                <p className="text-[var(--pp-text)] text-lg mt-2">
                  {item.question}
                </p>


              </div>




              <div className="mt-5">

                <p className="text-[var(--pp-text-muted)]">
                  Your Answer
                </p>

                <p className="text-[var(--pp-text-muted)] mt-2">
                  {item.answer}
                </p>

              </div>




              <div className="mt-5">

                <p className="text-[var(--pp-text-muted)]">
                  AI Feedback
                </p>

                <p className="text-[var(--pp-text-muted)] mt-2">
                  {item.feedback}
                </p>

              </div>



            </div>


          ))
        }


        </div>

        )

      }



    </div>

  );

}