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
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">

        <h1 className="text-white text-xl">
          Loading History...
        </h1>

      </div>
    )

  }



  return(

    <div className="min-h-screen bg-[#050816] p-10">


      <h1 className="text-4xl font-bold text-white mb-8">
        Interview History 📚
      </h1>



      {
        history.length === 0 ?

        (
          <div className="text-gray-400 text-lg">
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
              border-white/10
              bg-white/5
              p-8
              "
            >


              <div className="flex justify-between">

                <h2 className="text-purple-400 text-xl font-bold">
                  Interview {index+1}
                </h2>


                <span className="text-green-400 font-bold">
                  Score {item.score}/10
                </span>


              </div>



              <div className="mt-5">

                <p className="text-gray-400">
                  Question
                </p>

                <p className="text-white text-lg mt-2">
                  {item.question}
                </p>


              </div>




              <div className="mt-5">

                <p className="text-gray-400">
                  Your Answer
                </p>

                <p className="text-gray-300 mt-2">
                  {item.answer}
                </p>

              </div>




              <div className="mt-5">

                <p className="text-gray-400">
                  AI Feedback
                </p>

                <p className="text-gray-300 mt-2">
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