"use client";

import { motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setMenuOpen(false);
    router.replace("/login");
  };

  const handleNavigation = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5"
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 shrink-0"
        >
          <Sparkles className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
          <span>PlacementPilot</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-5 lg:gap-6 items-center">
          <button className="text-gray-700 hover:text-orange-600 transition-colors">
            Features
          </button>

          <button className="text-gray-700 hover:text-orange-600 transition-colors">
            About
          </button>

          {loggedIn ? (
            <>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-900"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden mt-4 rounded-2xl bg-orange-100/70 backdrop-blur-md border border-orange-200 p-4"
        >
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-left text-gray-700 hover:text-orange-600 py-2"
            >
              Features
            </button>

            <button
              onClick={() => setMenuOpen(false)}
              className="text-left text-gray-700 hover:text-orange-600 py-2"
            >
              About
            </button>

            {loggedIn ? (
              <>
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className="w-full px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
              >
                Login
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

