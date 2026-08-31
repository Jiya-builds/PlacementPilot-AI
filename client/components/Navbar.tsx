"use client";

import { motion } from "framer-motion";
import { Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setLoggedIn(!!token);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.replace("/login");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full px-8 py-4 flex justify-between items-center border-b border-[var(--pp-line)] bg-[var(--pp-bg)]"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 text-lg font-display font-semibold text-[var(--pp-text)]">
        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--pp-amber)]/10 text-[var(--pp-amber)]">
          <Navigation size={16} />
        </span>
        PlacementPilot
      </div>

      {/* Menu */}
      <div className="flex gap-7 items-center">
        <button
          onClick={() => {
            const el = document.getElementById("features");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-sm text-[var(--pp-text-muted)] hover:text-[var(--pp-text)] transition"
        >
          Features
        </button>

        <button
          onClick={() => {
            const el = document.getElementById("about");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-sm text-[var(--pp-text-muted)] hover:text-[var(--pp-text)] transition"
        >
          About
        </button>

        {loggedIn ? (
          <>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--pp-text)] border border-[var(--pp-line)] hover:bg-[var(--pp-panel)] transition"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--pp-red)] border border-[var(--pp-red)]/30 hover:bg-[var(--pp-red)]/10 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--pp-amber)] text-[var(--pp-bg)] hover:brightness-110 transition"
          >
            Login
          </button>
        )}
      </div>
    </motion.nav>
  );
}
