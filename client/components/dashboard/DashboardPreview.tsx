"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DashboardPreview() {

  const router = useRouter();


  return (

    <section className="py-16 md:py-28 px-6">


      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold">
        Your AI Dashboard
      </h2>


      <p className="text-center mt-5 text-gray-600">
        Everything at one place.
      </p>



      <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-10">


        <button
          onClick={() => router.push("/login")}
          className="
          px-6 py-3 rounded-xl 
          bg-orange-600 
          text-white
          "
        >
          Analyze Resume
        </button>



        <button
          onClick={() => router.push("/login")}
          className="
          px-6 py-3 rounded-xl 
          bg-amber-600 
          text-white
          "
        >
          Start Interview
        </button>


      </div>



      <motion.div

        initial={{opacity:0,y:50}}

        whileInView={{opacity:1,y:0}}

        viewport={{once:true}}

        className="max-w-6xl mx-auto mt-20 rounded-[28px] md:rounded-[40px] border border-orange-200 bg-orange-50 backdrop-blur-2xl p-6 md:p-10"

      >

        {/* tera same dashboard preview code */}

      </motion.div>


    </section>

  );
}