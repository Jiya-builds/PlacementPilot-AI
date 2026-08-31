"use client";

import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { Bell, Search, LogOut, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Map,
  History,
  Sparkles,
  Target,
  AlertTriangle,
} from "lucide-react";

const searchablePages = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keywords: "home overview stats" },
  { name: "Resume", href: "/resume", icon: FileText, keywords: "resume cv upload score ats" },
  { name: "Interview", href: "/interview", icon: MessageSquare, keywords: "interview practice mock ai" },
  { name: "Roadmap", href: "/roadmap", icon: Map, keywords: "roadmap plan skills learning" },
  { name: "History", href: "/history", icon: History, keywords: "history past sessions" },
  { name: "Profile", href: "/profile", icon: User, keywords: "profile account settings" },
];

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Resume analyzed",
    description: "Your latest resume upload has been scored. Check your ATS score now.",
    time: "Just now",
    read: false,
  },
  {
    id: "2",
    title: "Interview reminder",
    description: "You haven't practiced a mock interview this week.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "Roadmap updated",
    description: "New recommended skills were added to your roadmap.",
    time: "Yesterday",
    read: true,
  },
];

// One unified shape for every kind of search result (page, skill, interview Q, etc.)
type SearchResult = {
  id: string;
  category: "Page" | "Skill" | "Strength" | "Weakness" | "Missing Skill" | "Interview Question" | "Roadmap" | "Project";
  label: string;
  sublabel?: string;
  href: string;
  icon: ElementType;
};

export default function Topbar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Lazily fetch the user's profile (skills, resume analysis, interviews, roadmap)
  // the first time they open the search box, so search has real data to work with.
  const loadProfile = async () => {
    if (profileFetched || profileLoading) return;
    setProfileLoading(true);
    try {
      const res = await api.get("/auth/profile");
      setProfile(res.data.user);
    } catch (error: any) {
      console.log("SEARCH PROFILE FETCH ERROR:", error.response?.data || error.message);
    } finally {
      setProfileLoading(false);
      setProfileFetched(true);
    }
  };

  // Build the full searchable index once profile data is available.
  const searchIndex: SearchResult[] = useMemo(() => {
    const results: SearchResult[] = [];

    searchablePages.forEach((page) => {
      results.push({
        id: `page-${page.href}`,
        category: "Page",
        label: page.name,
        href: page.href,
        icon: page.icon,
      });
    });

    if (profile) {
      (profile.skills || []).forEach((skill: string, i: number) => {
        results.push({
          id: `skill-${i}`,
          category: "Skill",
          label: skill,
          href: "/profile",
          icon: Sparkles,
        });
      });

      const analysis = profile.analysis || {};

      (analysis.strengths || []).forEach((s: string, i: number) => {
        results.push({
          id: `strength-${i}`,
          category: "Strength",
          label: s,
          href: "/resume",
          icon: Target,
        });
      });

      (analysis.weaknesses || []).forEach((w: string, i: number) => {
        results.push({
          id: `weakness-${i}`,
          category: "Weakness",
          label: w,
          href: "/resume",
          icon: AlertTriangle,
        });
      });

      (analysis.missingSkills || []).forEach((m: string, i: number) => {
        results.push({
          id: `missing-${i}`,
          category: "Missing Skill",
          label: m,
          href: "/resume",
          icon: AlertTriangle,
        });
      });

      (analysis.interviewQuestions || []).forEach((q: string, i: number) => {
        results.push({
          id: `iq-${i}`,
          category: "Interview Question",
          label: q,
          href: "/interview",
          icon: MessageSquare,
        });
      });

      (profile.interviews || []).forEach((iv: any, i: number) => {
        if (iv.question) {
          results.push({
            id: `hist-${i}`,
            category: "Interview Question",
            label: iv.question,
            sublabel: iv.feedback ? `Feedback: ${iv.feedback}` : undefined,
            href: "/history",
            icon: History,
          });
        }
      });

      const roadmap = analysis.roadmap || {};
      ["shortTerm", "midTerm", "longTerm"].forEach((term) => {
        (roadmap[term] || []).forEach((item: string, i: number) => {
          results.push({
            id: `roadmap-${term}-${i}`,
            category: "Roadmap",
            label: item,
            href: "/roadmap",
            icon: Map,
          });
        });
      });

      (analysis.suggestedProjects || []).forEach((p: any, i: number) => {
        if (p.title) {
          results.push({
            id: `project-${i}`,
            category: "Project",
            label: p.title,
            sublabel: p.description,
            href: "/resume",
            icon: FileText,
          });
        }
      });
    }

    return results;
  }, [profile]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, searchIndex]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToResult = (href: string) => {
    setQuery("");
    setShowResults(false);
    router.push(href);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <header
      className="
      h-20 
      border-b 
      border-[var(--pp-line)] 
      bg-[var(--pp-bg)] 
      flex 
      items-center 
      justify-between 
      px-8
      "
    >
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--pp-text)]">Dashboard</h1>
        <p className="text-[var(--pp-text-muted)] mt-1">Welcome back 👋</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div ref={searchRef} className="relative">
          <div
            className="
            flex 
            items-center 
            gap-3 
            bg-[var(--pp-panel)] 
            border 
            border-[var(--pp-line)] 
            rounded-xl 
            px-4 
            py-3
            "
          >
            <Search size={18} className="text-[var(--pp-text-muted)]" />

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => {
                setShowResults(true);
                loadProfile();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredResults.length > 0) {
                  goToResult(filteredResults[0].href);
                }
                if (e.key === "Escape") {
                  setShowResults(false);
                }
              }}
              placeholder="Search pages, skills, interviews..."
              className="
              bg-transparent 
              outline-none 
              text-[var(--pp-text)] 
              placeholder:text-[var(--pp-text-faint)]
              w-52
              "
            />

            {profileLoading && (
              <Loader2 size={14} className="text-[var(--pp-text-faint)] animate-spin" />
            )}
          </div>

          {showResults && query.trim() && (
            <div
              className="
              absolute 
              right-0 
              mt-2 
              w-80 
              bg-[var(--pp-panel-raised)] 
              border 
              border-[var(--pp-line)] 
              rounded-xl 
              shadow-xl 
              overflow-hidden 
              z-50
              max-h-96
              overflow-y-auto
              "
            >
              {filteredResults.length > 0 ? (
                filteredResults.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => goToResult(r.href)}
                      className="
                      w-full 
                      flex 
                      items-start 
                      gap-3 
                      px-4 
                      py-3 
                      text-left 
                      hover:bg-[var(--pp-panel-raised)] 
                      transition
                      border-b
                      border-[var(--pp-line)]
                      last:border-b-0
                      "
                    >
                      <Icon size={16} className="text-[var(--pp-amber)] mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[var(--pp-text)] text-sm truncate">{r.label}</p>
                        <p className="text-[var(--pp-text-faint)] text-xs mt-0.5">{r.category}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-[var(--pp-text-faint)] text-sm">
                  No results found for &quot;{query}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="
            relative
            w-12 
            h-12 
            rounded-xl 
            bg-[var(--pp-panel)] 
            border 
            border-[var(--pp-line)] 
            flex 
            items-center 
            justify-center 
            hover:bg-[var(--pp-amber)]/15 
            transition
            "
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                className="
                absolute 
                -top-1 
                -right-1 
                w-5 
                h-5 
                bg-red-500 
                text-[var(--pp-text)] 
                text-xs 
                font-bold 
                rounded-full 
                flex 
                items-center 
                justify-center
                "
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="
              absolute 
              right-0 
              mt-2 
              w-80 
              bg-[var(--pp-panel-raised)] 
              border 
              border-[var(--pp-line)] 
              rounded-xl 
              shadow-xl 
              overflow-hidden 
              z-50
              "
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--pp-line)]">
                <span className="text-[var(--pp-text)] font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[var(--pp-amber)] hover:text-[var(--pp-amber)]"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`
                      px-4 
                      py-3 
                      border-b 
                      border-[var(--pp-line)] 
                      hover:bg-[var(--pp-panel)] 
                      transition
                      ${!n.read ? "bg-[var(--pp-amber)]/5" : ""}
                      `}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[var(--pp-text)] text-sm font-medium flex items-center gap-2">
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-[var(--pp-amber)] inline-block" />
                            )}
                            {n.title}
                          </p>
                          <p className="text-[var(--pp-text-muted)] text-xs mt-1">
                            {n.description}
                          </p>
                          <p className="text-[var(--pp-text-faint)] text-xs mt-1">{n.time}</p>
                        </div>
                        <button
                          onClick={() => dismissNotification(n.id)}
                          className="text-[var(--pp-text-faint)] hover:text-[var(--pp-text)] text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-[var(--pp-text-faint)] text-sm">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          onClick={() => router.push("/profile")}
          className="
          w-12 
          h-12 
          rounded-full 
          bg-gradient-to-r 
          from-[var(--pp-amber)] 
          to-[var(--pp-amber-dim)] 
          flex 
          items-center 
          justify-center 
          font-bold 
          text-[var(--pp-text)]
          "
        >
          <User size={22} />
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="
          w-12 
          h-12 
          rounded-xl 
          bg-[var(--pp-red)]/15 
          text-[var(--pp-red)] 
          flex 
          items-center 
          justify-center 
          hover:bg-[var(--pp-red)] 
          hover:text-[var(--pp-text)] 
          transition
          "
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
