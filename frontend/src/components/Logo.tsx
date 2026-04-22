import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:shadow-[0_0_12px_rgba(250,204,21,0.8)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          className="w-4 h-4"
        >
          <path d="M13 2L3 14h7v8l10-12h-7z" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
          PowerTrack
        </span>
        <span className="text-[10px] sm:text-xs text-gray-400">
          Smart Electricity Insights
        </span>
      </div>
    </Link>
  );
}