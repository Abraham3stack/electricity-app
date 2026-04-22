"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on dashboard pages to avoid duplicate header
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Run on mount and whenever route changes
    syncAuth();
    setMenuOpen(false);

    // Listen for storage changes (other tabs)
    window.addEventListener("storage", syncAuth);

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", syncAuth);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur">
      {/* Left: Logo */}
      <Logo />

      {/* Right: Navigation */}
      <div className="flex items-center gap-2 sm:gap-4">
        {!isLoggedIn ? (
          <>
            <Link
              href="/login"
              className={`hidden sm:block text-sm transition ${
                pathname === "/login"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Login
            </Link>

            <Link
              href="/register"
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-semibold transition ${
                pathname === "/register"
                  ? "bg-yellow-300 text-black"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              Get Started
            </Link>
          </>
        ) : (
          <>
            {/* Desktop: show dashboard + name + logout */}
            <div className="hidden md:flex items-center gap-4">
              {pathname !== "/dashboard" && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 border rounded-lg border-yellow-400 hover:bg-yellow-400 hover:text-black transition"
                >
                  Dashboard
                </Link>
              )}

              {pathname !== "/planner" && (
                <Link
                  href="/planner"
                  className="px-4 py-2 border rounded-lg border-gray-600 text-gray-300 hover:border-yellow-400 hover:text-white transition"
                >
                  Plan Usage
                </Link>
              )}

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 transition">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-sm text-gray-300">
                  {user?.name || "User"}
                </span>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                className="text-sm border border-red-500 text-red-400 px-3 py-1 rounded hover:bg-red-500/10 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile: avatar dropdown */}
            <div ref={menuRef} className="relative md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1 w-auto px-2 h-8 rounded-full bg-yellow-400 text-black justify-center font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 transition"
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-200 text-black font-bold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              {menuOpen && (
                <div className={`absolute right-0 mt-2 w-40 bg-[#0f172a] text-white border border-gray-700 rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 ease-out ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    {user?.name || "User"}
                  </div>

                  {pathname !== "/dashboard" && (
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800 transition"
                    >
                      Dashboard
                    </Link>
                  )}

                  {pathname !== "/planner" && (
                    <Link
                      href="/planner"
                      className="block px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800 transition"
                    >
                      ⚡ Plan Usage
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.href = "/login";
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
