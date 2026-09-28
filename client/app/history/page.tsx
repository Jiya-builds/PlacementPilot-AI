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
      <div className="min-h-screen bg-white flex items-center justify-center">

        <h1 className="text-gray-900 text-xl">
          Loading History...
        </h1>

      </div>
    )

  }



  return(

    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-10">


      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
        Interview History 📚
      </h1>



      {
        history.length === 0 ?

        (
          <div className="text-gray-600 text-lg">
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
              border-orange-200
              bg-orange-50
              p-5 sm:p-8
              "
            >


              <div className="flex justify-between gap-3">

                <h2 className="text-orange-600 text-xl font-bold">
                  Interview {index+1}
                </h2>


                <span className="text-green-600 font-bold">
                  Score {item.score}/10
                </span>


              </div>



              <div className="mt-5">

                <p className="text-gray-600">
                  Question
                </p>

                <p className="text-gray-900 text-lg mt-2">
                  {item.question}
                </p>


              </div>




              <div className="mt-5">

                <p className="text-gray-600">
                  Your Answer
                </p>

                <p className="text-gray-700 mt-2">
                  {item.answer}
                </p>

              </div>




              <div className="mt-5">

                <p className="text-gray-600">
                  AI Feedback
                </p>

                <p className="text-gray-700 mt-2">
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