"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {

  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);



  useEffect(() => {

    const checkAuth = () => {

      const token = localStorage.getItem("token");

      if(token){
        setLoggedIn(true);
      }
      else{
        setLoggedIn(false);
      }

    };


    checkAuth();


  }, []);




  const handleLogout = () => {


    console.log("LOGOUT CLICKED");


    localStorage.removeItem("token");


    console.log(
      "TOKEN AFTER LOGOUT:",
      localStorage.getItem("token")
    );


    setLoggedIn(false);


    router.replace("/login");


  };





  return (

    <motion.nav

      initial={{
        y:-20,
        opacity:0
      }}

      animate={{
        y:0,
        opacity:1
      }}

      className="
      w-full 
      px-8 
      py-5 
      flex 
      justify-between 
      items-center
      "

    >



      {/* Logo */}

      <div className="flex items-center gap-2 text-xl font-bold">

        <Sparkles className="text-purple-500" />

        PlacementPilot AI

      </div>





      {/* Menu */}

      <div className="flex gap-6 items-center">


        <button 
          onClick={() => {
            const el = document.getElementById("features");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-gray-300 hover:text-white"
        >
          Features
        </button>



        <button 
          onClick={() => {
            const el = document.getElementById("about");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-gray-300 hover:text-white"
        >
          About
        </button>






        {
          loggedIn ? (

            <>


              <button

                onClick={() => router.push("/dashboard")}

                className="
                px-5 
                py-2 
                rounded-xl 
                bg-blue-600 
                hover:bg-blue-700 
                text-white
                "

              >

                Dashboard

              </button>





              <button

                onClick={handleLogout}

                className="
                px-5 
                py-2 
                rounded-xl 
                bg-red-600 
                hover:bg-red-700 
                text-white
                "

              >

                Logout

              </button>



            </>


          ) : (


            <button

              onClick={() => router.push("/login")}

              className="
              px-5 
              py-2 
              rounded-xl 
              bg-purple-600 
              hover:bg-purple-700 
              text-white
              "

            >

              Login

            </button>


          )
        }




      </div>



    </motion.nav>

  );

}