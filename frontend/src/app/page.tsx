"use client";

import Link from "next/link";

export default function Home() {
  
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 text-yellow-400 font-bold text-lg hover:opacity-80 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#facc15">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
          PowerTrack
        </Link>

        <Link
          href="/login"
          className="px-4 py-2 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition"
        >
          Login
        </Link>
      </nav>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="relative flex items-center gap-3 mb-4">
          <div className="absolute -inset-6 bg-yellow-400/10 blur-2xl rounded-full"></div>
          {/* Lightning SVG Icon */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400">
            PowerTrack
          </h1>
        </div>

        <p className="text-lg text-gray-300 max-w-2xl mb-6">
          Know exactly how fast your electricity is running out. Track usage, monitor trends, and predict how long your units will last — all in one place.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 hover:bg-yellow-300"
          >
            Get Started
          </Link>

          <Link
            href="/register"
            className="border border-yellow-400 px-6 py-3 rounded-lg transition transform hover:scale-105 hover:bg-yellow-400 hover:text-black"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-yellow-400">
          What You Can Do
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-[#1e293b] rounded-xl hover:scale-105 transition">
            <h3 className="font-semibold mb-2">Track Units</h3>
            <p className="text-sm text-gray-400">
              Input your electricity units and monitor how much you have left in real time.
            </p>
          </div>

          <div className="p-6 bg-[#1e293b] rounded-xl hover:scale-105 transition">
            <h3 className="font-semibold mb-2">Log Usage</h3>
            <p className="text-sm text-gray-400">
              Record daily usage to understand your consumption habits.
            </p>
          </div>

          <div className="p-6 bg-[#1e293b] rounded-xl hover:scale-105 transition">
            <h3 className="font-semibold mb-2">Predict Duration</h3>
            <p className="text-sm text-gray-400">
              Get insights on how many days your electricity will last based on usage.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          See It In Action
        </h2>

        <div className="bg-black/40 p-2 rounded-2xl border border-gray-800 shadow-lg hover:scale-[1.02] transition max-w-2xl mx-auto">
          <div className="rounded-xl overflow-hidden">
            <img
              src="/dashboard-preview.png"
              alt="Dashboard preview"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Navigation Hint */}
      <section className="text-center pb-16">
        <p className="text-gray-500 text-sm">
          After signing up, head to your dashboard to start tracking.
        </p>
      </section>
    </main>
  );
}