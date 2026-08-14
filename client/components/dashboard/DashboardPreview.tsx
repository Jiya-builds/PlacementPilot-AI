"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DashboardPreview() {

  const router = useRouter();


  return (

    <section className="py-28 px-6">


      <h2 className="text-center text-5xl font-bold">
        Your AI Dashboard
      </h2>


      <p className="text-center mt-5 text-gray-400">
        Everything at one place.
      </p>



      <div className="flex justify-center gap-5 mt-10">


        <button
          onClick={() => router.push("/login")}
          className="
          px-6 py-3 rounded-xl 
          bg-purple-600 
          text-white
          "
        >
          Analyze Resume
        </button>



        <button
          onClick={() => router.push("/login")}
          className="
          px-6 py-3 rounded-xl 
          bg-blue-600 
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

        className="max-w-6xl mx-auto mt-20 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10"

      >

        {/* tera same dashboard preview code */}

      </motion.div>


    </section>

  );
}