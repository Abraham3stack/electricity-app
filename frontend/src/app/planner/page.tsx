"use client";

import { useMemo, useState, useEffect } from "react";

// Simple appliance catalog
const APPLIANCES = [
  { key: "fridge", name: "Fridge", watts: 150 },
  { key: "tv", name: "TV", watts: 100 },
  { key: "ac", name: "AC", watts: 1500 },
  { key: "fan", name: "Fan", watts: 75 },
];

type HoursMap = Record<string, number>;

export default function PlannerPage() {
  const [hours, setHours] = useState<HoursMap>(() => {
    const init: HoursMap = {};
    APPLIANCES.forEach((a) => (init[a.key] = 0));
    return init;
  });

  const [costPerUnit, setCostPerUnit] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const savedCost = localStorage.getItem("costPerUnit");
    const savedBalance = localStorage.getItem("balance");

    if (savedCost) setCostPerUnit(Number(savedCost));
    if (savedBalance) setBalance(Number(savedBalance));
  }, []);

  // kWh = (watts * hours) / 1000
  const perApplianceKwh = useMemo(() => {
    return APPLIANCES.map((a) => {
      const h = hours[a.key] || 0;
      const kwh = (a.watts * h) / 1000;
      return { ...a, hours: h, kwh };
    });
  }, [hours]);

  const totalKwh = useMemo(() => {
    return perApplianceKwh.reduce((acc, a) => acc + a.kwh, 0);
  }, [perApplianceKwh]);

  const dailyCost = totalKwh * costPerUnit;
  const daysLeft = totalKwh > 0 ? balance / totalKwh : 0;

  return (
    <div className="min-h-screen bg-dark text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Energy Planner</h1>
        <p className="text-gray-400 mb-6">
          Estimate your daily electricity usage by selecting appliances and hours used.
        </p>

        <div className="bg-card border border-gray-700 rounded-2xl p-4 md:p-6 space-y-4">
          {APPLIANCES.map((a) => (
            <div key={a.key} className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs text-gray-400">{a.watts}W</div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={24}
                  value={hours[a.key] ?? 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setHours((prev) => ({ ...prev, [a.key]: isNaN(val) ? 0 : val }));
                  }}
                  className="w-20 p-2 rounded bg-dark border border-gray-600 text-white text-sm"
                />
                <span className="text-sm text-gray-400">hrs/day</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-card border border-gray-700 rounded-2xl p-4 md:p-6">
          <div className="text-sm text-gray-400">Estimated Daily Usage</div>
          <div className="text-2xl font-bold text-primary">
            {totalKwh.toFixed(2)} kWh/day
          </div>

          <div className="mt-4 space-y-1 text-sm text-gray-400">
            {perApplianceKwh.map((a) => (
              <div key={a.key} className="flex justify-between">
                <span>{a.name}</span>
                <span className="text-white">{a.kwh.toFixed(2)} kWh</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 bg-card border border-gray-700 rounded-2xl p-4 md:p-6">
          <div className="text-sm text-gray-400">Estimated Daily Cost</div>
          <div className="text-2xl font-bold text-primary">
            ₦{dailyCost.toLocaleString()}
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Estimated Days Electricity Will Last:
          </div>
          <div className="text-lg font-semibold text-white mt-1">
            {daysLeft > 0 ? `${daysLeft.toFixed(1)} days` : "--"}
          </div>
        </div>
      </div>
    </div>
  );
}