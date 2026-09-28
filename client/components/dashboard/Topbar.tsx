"use client";

import { Bell, Search, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar() {

  const router = useRouter();



  const logout = () => {

    localStorage.removeItem("token");

    router.replace("/login");

  };



  return (
    <header
      className="
      min-h-20
      border-b
      border-orange-200
      bg-white
      flex
      items-center
      justify-between
      gap-3
      py-3
      pl-[4.5rem]
      pr-4
      md:px-8
      "
    >


      {/* Left */}

      <div className="min-w-0">

        <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
          Dashboard
        </h1>


        <p className="text-gray-600 text-sm md:text-base mt-1 truncate">
          Welcome back 👋
        </p>

      </div>




      {/* Right */}

      <div className="flex shrink-0 items-center gap-2 md:gap-5">



        {/* Search (hidden on phones) */}

        <div
          className="
          hidden
          md:flex
          items-center
          gap-3
          bg-orange-50
          border
          border-orange-200
          rounded-xl
          px-4
          py-3
          "
        >

          <Search
            size={18}
            className="text-gray-600"
          />


          <input

            placeholder="Search..."

            className="
            bg-transparent
            outline-none
            text-gray-900
            placeholder:text-gray-500
            "

          />

        </div>



        {/* Notification (hidden on very small screens) */}

        <button

          className="
          hidden
          sm:flex
          w-10
          h-10
          md:w-12
          md:h-12
          rounded-xl
          bg-orange-50
          border
          border-orange-200
          items-center
          justify-center
          text-gray-900
          hover:bg-orange-700
          transition
          "

        >

          <Bell size={20}/>

        </button>



        {/* Profile */}

        <button

          onClick={() => router.push("/profile")}

          className="
          w-10
          h-10
          md:w-12
          md:h-12
          rounded-full
          bg-gradient-to-r
          from-orange-600
          to-amber-600
          flex
          items-center
          justify-center
          font-bold
          text-white
          "

        >

          <User size={20}/>

        </button>



        {/* Logout */}

        <button

          onClick={logout}

          className="
          w-10
          h-10
          md:w-12
          md:h-12
          rounded-xl
          bg-red-500/20
          text-red-500
          flex
          items-center
          justify-center
          hover:bg-red-500
          hover:text-white
          transition
          "

        >

          <LogOut size={20}/>

        </button>


      </div>

    </header>
  );
}
