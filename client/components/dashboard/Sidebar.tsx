"use client";

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



  const handleLogout = ()=>{

    localStorage.removeItem("token");

    router.replace("/login");

  };



  return(

    <aside className="
    w-72
    h-screen
    border-r
    border-white/10
    bg-[#0B1020]
    flex
    flex-col
    ">


      {/* Logo */}

      <div className="
      flex
      items-center
      gap-3
      px-8
      py-8
      ">

        <BrainCircuit
          className="text-purple-500"
          size={34}
        />

        <h1 className="
        text-2xl
        font-bold
        text-white
        ">
          PlacementPilot
        </h1>

      </div>





      {/* Links */}

      <nav className="
      flex-1
      px-4
      space-y-3
      ">


        {
          links.map((item)=>{

            const Icon = item.icon;


            return(

              <Link

                key={item.name}

                href={item.href}

                className="
                flex
                items-center
                gap-4
                rounded-xl
                px-5
                py-4
                text-gray-300
                hover:bg-purple-600
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
      border-white/10
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
          py-4
          text-red-400
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

  );

}