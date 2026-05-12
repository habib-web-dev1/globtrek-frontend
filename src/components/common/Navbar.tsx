"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Globe,
  LogOut,
  LayoutDashboard,
  Compass,
  MessageSquare,
  Briefcase,
  Users,
  Package,
  Star,
  Home,
  ShieldAlert,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, token, logout, isDemoAdmin } = useAuthStore();
  const isLoggedIn = !!token;
  const isAdmin = user?.role === "ADMIN";

  // Detect if we're on a page with a dark hero (only home page)
  const isHeroPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    // Read initial scroll position without calling setState in effect body
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  const publicLinks = [
    { name: "Home", href: "/", icon: <Home size={16} /> },
    { name: "Explore", href: "/destinations", icon: <Compass size={16} /> },
    {
      name: "AI Planner",
      href: "/ai-planner",
      icon: <MessageSquare size={16} />,
    },
  ];

  const userLinks = [
    { name: "Home", href: "/", icon: <Home size={16} /> },
    {
      name: "Destinations",
      href: "/destinations",
      icon: <Compass size={16} />,
    },
    {
      name: "AI Planner",
      href: "/ai-planner",
      icon: <MessageSquare size={16} />,
    },
    {
      name: "Dashboard",
      href: "/user/dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    {
      name: "My Bookings",
      href: "/user/bookings",
      icon: <Briefcase size={16} />,
    },
  ];

  const adminLinks = [
    {
      name: "Overview",
      href: "/admin/analytics",
      icon: <LayoutDashboard size={16} />,
    },
    { name: "Destinations", href: "/admin/items", icon: <Package size={16} /> },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: <Briefcase size={16} />,
    },
    { name: "Users", href: "/admin/users", icon: <Users size={16} /> },
    { name: "Reviews", href: "/admin/reviews", icon: <Star size={16} /> },
  ];

  const currentLinks = !isLoggedIn
    ? publicLinks
    : isAdmin
      ? adminLinks
      : userLinks;

  // Navbar is transparent only on hero page when not scrolled
  const isTransparent = isHeroPage && !scrolled;

  return (
    <>
      {/* Demo Admin Banner */}
      {isDemoAdmin && isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-white text-center py-1.5 text-xs font-black flex items-center justify-center gap-2">
          <ShieldAlert size={13} />
          DEMO ADMIN MODE — View only. Edit &amp; delete actions are disabled.
        </div>
      )}
      <nav
        className={`fixed w-full z-[100] transition-all duration-300 ${isDemoAdmin && isAdmin ? "top-7" : "top-0"} ${
          isTransparent
            ? "bg-transparent py-5"
            : "bg-white py-3 shadow-sm border-b border-slate-100"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 font-black tracking-tighter"
          >
            <div className="bg-blue-600 p-1.5 rounded-xl text-white flex-shrink-0">
              <Globe size={22} />
            </div>
            <span
              className={`text-xl ${isTransparent ? "text-white" : "text-slate-900"}`}
            >
              GlobeTrek<span className="text-blue-500">AI</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-1">
            {currentLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                    isTransparent
                      ? "text-white hover:bg-white/10"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                >
                  Join Free
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="leading-none">
                    <p className="text-xs font-black text-blue-600 uppercase">
                      {user?.role}
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {user?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isTransparent ? "text-white" : "text-slate-900"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl">
            <div className="p-5 flex flex-col gap-1.5">
              {currentLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all text-sm ${
                    pathname === link.href
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-3">
                {!isLoggedIn ? (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 text-center border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 bg-blue-600 text-white text-center rounded-2xl font-bold text-sm"
                    >
                      Join Free
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 text-red-600 text-center rounded-2xl font-bold text-sm border border-red-100"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
