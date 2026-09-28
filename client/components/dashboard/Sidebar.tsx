"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Map,
  History,
  User,
  LogOut,
  BrainCircuit,
  Menu,
  X,
} from "lucide-react";


const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Resume",
    href: "/resume",
    icon: FileText,
  },
  {
    name: "Interview",
    href: "/interview",
    icon: MessageSquare,
  },
  {
    name: "Roadmap",
    href: "/roadmap",
    icon: Map,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];



export default function Sidebar(){


  const router = useRouter();

  const [open, setOpen] = useState(false);



  const handleLogout = ()=>{

    localStorage.removeItem("token");

    router.replace("/login");

  };



  return(

    <>

      {/* Mobile menu button */}

      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="
        fixed
        left-4
        top-4
        z-40
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        border
        border-orange-200
        bg-white
        text-gray-900
        md:hidden
        "
      >
        <Menu size={22}/>
      </button>


      {/* Mobile overlay */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}


      <aside
        className={`
        fixed
        inset-y-0
        left-0
        z-50
        flex
        w-72
        max-w-[85vw]
        flex-col
        border-r
        border-orange-200
        bg-white
        transition-transform
        duration-300
        md:sticky
        md:top-0
        md:h-dvh
        md:max-w-none
        md:shrink-0
        md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >


        {/* Logo */}

        <div className="
        flex
        items-center
        justify-between
        px-6
        py-6
        md:px-8
        md:py-8
        ">

          <div className="flex items-center gap-3">

            <BrainCircuit
              className="text-orange-500"
              size={30}
            />

            <h1 className="
            text-xl
            font-bold
            text-gray-900
            md:text-2xl
            ">
              PlacementPilot
            </h1>

          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-gray-600 hover:text-orange-600 md:hidden"
          >
            <X size={24}/>
          </button>

        </div>



        {/* Links */}

        <nav className="
        flex-1
        space-y-2
        overflow-y-auto
        px-4
        ">

          {
            links.map((item)=>{

              const Icon = item.icon;

              return(

                <Link

                  key={item.name}

                  href={item.href}

                  onClick={() => setOpen(false)}

                  className="
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  px-5
                  py-3.5
                  text-gray-700
                  hover:bg-orange-700
                  hover:text-white
                  transition-all
                  "

                >

                  <Icon size={22}/>

                  {item.name}

                </Link>

              )

            })
          }

        </nav>



        {/* Logout */}

        <div className="
        p-5
        border-t
        border-orange-200
        ">

          <button

            onClick={handleLogout}

            className="
            flex
            w-full
            items-center
            gap-4
            rounded-xl
            px-5
            py-3.5
            text-red-500
            hover:bg-red-500
            hover:text-white
            transition-all
            "

          >

            <LogOut size={22}/>

            Logout

          </button>

        </div>


      </aside>

    </>

  );

}
