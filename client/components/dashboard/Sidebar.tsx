"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Map,
  History,
  User,
  LogOut,
  Navigation,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, code: "DSH" },
  { name: "Resume", href: "/resume", icon: FileText, code: "RSM" },
  { name: "Interview", href: "/interview", icon: MessageSquare, code: "INT" },
  { name: "Roadmap", href: "/roadmap", icon: Map, code: "RDM" },
  { name: "History", href: "/history", icon: History, code: "HST" },
  { name: "Profile", href: "/profile", icon: User, code: "PRF" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <aside className="w-72 h-screen border-r border-[var(--pp-line)] bg-[var(--pp-panel)] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-7 py-7 border-b border-[var(--pp-line)]">
        <span className="flex items-center justify-center w-9 h-9 rounded-md bg-[var(--pp-amber)]/10 text-[var(--pp-amber)]">
          <Navigation size={18} />
        </span>
        <h1 className="text-lg font-display font-semibold text-[var(--pp-text)]">
          PlacementPilot
        </h1>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-md px-4 py-3 text-sm transition-all ${
                active
                  ? "bg-[var(--pp-amber)]/10 text-[var(--pp-amber)]"
                  : "text-[var(--pp-text-muted)] hover:bg-[var(--pp-panel-raised)] hover:text-[var(--pp-text)]"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.name}</span>
              <span className="font-tabular text-[10px] tracking-wider text-[var(--pp-text-faint)]">
                {item.code}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[var(--pp-line)]">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 rounded-md px-4 py-3 text-sm text-[var(--pp-red)] hover:bg-[var(--pp-red)]/10 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
