import { useEffect, useState } from "react";

type Props = {
  avgPerDay?: number;
  daysLeft?: number;
};

export default function PredictionCard({ avgPerDay, daysLeft }: Props) {
  const safeAvg = Number.isFinite(avgPerDay as number) ? (avgPerDay as number) : 0;
  const safeDays = Number.isFinite(daysLeft as number) ? (daysLeft as number) : 0;

  // Animated display values
  const [displayAvg, setDisplayAvg] = useState(0);
  const [displayDays, setDisplayDays] = useState(0);

  useEffect(() => {
    // simple ease animation for numbers
    let raf: number;
    const duration = 300; // ms
    const start = performance.now();

    const startAvg = displayAvg;
    const startDays = displayDays;

    const animate = (t: number) => {
      const progress = Math.min((t - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setDisplayAvg(startAvg + (safeAvg - startAvg) * ease);
      setDisplayDays(startDays + (safeDays - startDays) * ease);

      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [safeAvg, safeDays]);

  // 🔥 Smart insight logic
  let insight = "";

  // Handle case where user has units but no usage yet
  if (safeAvg === 0) {
    insight = "Start logging usage to see insights";
  } else if (safeDays === 0) {
    insight = "⚠️ You have no electricity left";
  } else if (safeDays <= 2) {
    insight = "⚠️ Your electricity will run out very soon";
  } else if (safeAvg > 20) {
    insight = "⚡ You are consuming electricity very fast";
  } else if (safeAvg > 10) {
    insight = "📊 Your usage is moderate";
  } else {
    insight = "✅ You are conserving electricity well";
  }

  if (safeAvg === 0 && safeDays === 0) {
    insight = "Set your units and log usage to see predictions";
  }

  // 🔥 Smart recommendation logic
  let recommendation = "";

  if (safeDays > 0 && safeAvg > 0) {
    const reducedUsage = safeAvg * 0.8;
    const extraDays = Math.floor(safeDays * (safeAvg / reducedUsage) - safeDays);

    if (extraDays > 0) {
      recommendation = `💡 Reduce usage by 20% to gain about ${extraDays} extra day(s)`;
    }
  }

  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700 hover:scale-[1.02] transition-transform duration-200">
      <h2 className="text-gray-400 text-sm">Usage Prediction</h2>

      <div className="mt-4 space-y-2">
        <p>
          ⚡️ Avg/day:{" "}
          <span className="text-primary font-bold">
            {displayAvg > 0 ? displayAvg.toFixed(2) : "0.00"} kWh
          </span>
        </p>

        <p>
          ⏳ Days left:{" "}
          <span className="text-accent font-bold">
            {displayDays < 1 ? "Less than a day" : `${Math.round(displayDays)} days`}
          </span>
        </p>
      </div>
      {/* 🔥 Smart insight */}
      <p className="mt-4 text-sm text-accent">
        {insight}
      </p>

      {recommendation && (
        <p className="mt-2 text-xs text-gray-400">
          {recommendation}
        </p>
      )}
    </div>
  );
}