type Props = {
  avgPerDay?: number;
  daysLeft?: number;
};

export default function PredictionCard({ avgPerDay, daysLeft }: Props) {
  const safeAvg = avgPerDay ?? 0;
  const safeDays = daysLeft ?? 0;

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
    <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700 hover:scale-105 transition">
      <h2 className="text-gray-400 text-sm">Usage Prediction</h2>

      <div className="mt-4 space-y-2">
        <p>
          ⚡️ Avg/day:{" "}
          <span className="text-primary font-bold">
            {safeAvg.toFixed(2)} kWh
          </span>
        </p>

        <p>
          ⏳ Days left:{" "}
          <span className="text-accent font-bold">
            {safeDays < 1 ? "Less than a day" : `${safeDays} days`}
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