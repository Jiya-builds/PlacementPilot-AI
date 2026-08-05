"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {

  const router = useRouter();

  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[180px] rounded-full" />


      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">


        {/* Badge */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >

          <div className="flex items-center gap-2 border border-purple-500/30 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2">

            <Sparkles size={16} className="text-purple-400" />

            <span className="text-sm text-gray-300">
              AI Powered Placement Preparation
            </span>

          </div>

        </motion.div>





        {/* Heading */}

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 text-center text-6xl md:text-7xl font-extrabold leading-tight"
        >

          Crack Your Dream
          
          <br />

          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">

            Placement with AI

          </span>


        </motion.h1>






        {/* Subtitle */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .4 }}
          className="mt-8 max-w-3xl mx-auto text-center text-lg text-gray-400"
        >

          Analyze your Resume, improve ATS Score,
          prepare for technical interviews and receive
          a personalized AI Career Roadmap.

        </motion.p>







        {/* Buttons */}

        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.6 }}
          className="mt-12 flex justify-center gap-5"
        >



          <button

            onClick={() => router.push("/login")}

            className="group px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 transition text-lg font-semibold flex items-center gap-2"

          >

            Analyze Resume


            <ArrowRight
              className="group-hover:translate-x-1 transition"
              size={20}
            />


          </button>






          <button

            onClick={() => router.push("/login")}

            className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition text-lg"

          >

            Live Demo


          </button>




        </motion.div>


      </div>








      {/* Floating Card */}

      <motion.div

        animate={{
          y:[0,-15,0]
        }}

        transition={{
          duration:4,
          repeat:Infinity
        }}

        className="hidden lg:flex absolute right-24 top-40 w-72 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex-col gap-3 shadow-2xl"

      >


        <BrainCircuit 
          className="text-purple-400" 
          size={40}
        />



        <h3 className="text-xl font-bold">
          Resume Score
        </h3>



        <div className="text-5xl font-extrabold text-purple-400">
          92%
        </div>




        <p className="text-gray-400">
          AI suggests improvements instantly.
        </p>



      </motion.div>



    </section>
  );
}