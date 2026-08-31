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


      <p className="text-center mt-5 text-[var(--pp-text-muted)]">
        Everything at one place.
      </p>



      <div className="flex justify-center gap-5 mt-10">


        <button
          onClick={() => router.push("/login")}
          className="
          px-6 py-3 rounded-xl 
          bg-[var(--pp-ink)] 
          text-[var(--pp-text)]
          "
        >
          Analyze Resume
        </button>



        <button
          onClick={() => router.push("/login")}
          className="
          px-6 py-3 rounded-xl 
          bg-[var(--pp-ink-soft)] 
          text-[var(--pp-text)]
          "
        >
          Start Interview
        </button>


      </div>



      <motion.div

        initial={{opacity:0,y:50}}

        whileInView={{opacity:1,y:0}}

        viewport={{once:true}}

        className="max-w-6xl mx-auto mt-20 rounded-[40px] border border-[var(--pp-line)] bg-[var(--pp-panel)] backdrop-blur-2xl p-10"

      >

        {/* tera same dashboard preview code */}

      </motion.div>


    </section>

  );
}