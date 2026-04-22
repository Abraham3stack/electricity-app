"use client";

import { useEffect, useState, useRef } from "react";
import BalanceCard from "@/components/BalanceCard";
import { getBalance, initializeUnits } from "@/lib/api";
import PredictionCard from "@/components/PredictionCard";
import { getPrediction } from "@/lib/api";
import AlertBanner from "@/components/AlertBanner";
import{ getAlert } from "@/lib/api";
import UsageInput from "@/components/UsageInput";
import { logUsage } from "@/lib/api";
import UsageChart from "@/components/UsageChart";
import { getUsageHistory } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function Dashboard() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [costPerUnit, setCostPerUnit] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedToken = getToken();

    if (!storedToken) {
      router.replace("/login");
      return;
    }

    setToken(storedToken);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || "User");
      } catch {
        setUserName("User");
      }
    } else {
      setUserName("User");
    }

    const savedCost = localStorage.getItem("costPerUnit");
    if (savedCost) setCostPerUnit(Number(savedCost));

    setIsCheckingAuth(false);
  }, [router]);

  const [balance, setBalance] = useState(0);
  const [initialUnits, setInitialUnits] = useState("");
  const [initLoading, setInitLoading] = useState(false);

  // Handler for initializing units
  const handleInitializeUnits = async () => {
    if (!token || initLoading) return;

    const units = Number(initialUnits);

    if (!units || units <= 0) {
      setToast({ message: "Enter valid units", type: "error" });
      return;
    }

    try {
      setInitLoading(true);

      await initializeUnits(token, units);

      const [balanceData, predictionData, alertData, historyData] = await Promise.all([
        getBalance(token),
        getPrediction(token),
        getAlert(token),
        getUsageHistory(token),
      ]);

      setBalance(balanceData.data.remaining);
      localStorage.setItem("balance", String(balanceData.data.remaining));
      setPrediction(predictionData.data);
      setAlert(alertData.data.alert);
      setHistory(historyData.data);

      setToast({ message: "Units initialized successfully", type: "success" });
      setInitialUnits("");
    } catch (error: any) {
      setToast({ message: error?.message || "Failed to initialize units", type: "error" });
    } finally {
      setInitLoading(false);
    }
  };

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) return;

      try {
        const [balanceData, predictionData, alertData, historyData] = await Promise.all([
          getBalance(token),
          getPrediction(token),
          getAlert(token),
          getUsageHistory(token),
        ]);

        setBalance(balanceData.data.remaining);
        localStorage.setItem("balance", String(balanceData.data.remaining));
        setPrediction(predictionData.data);
        setAlert(alertData.data.alert);
        setHistory(historyData.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllData();
  }, [token]);

  // Prediction function
  const [prediction, setPrediction] = useState({
    avgPerDay: 0,
    estimatedDaysLeft: 0,
  });

  // Alert function
  const [alert, setAlert] = useState("");

  // HandleUsageSubmit Function
  const handleUsageSubmit = async (units: number) => {
    if (!token) return;
    try {
      await logUsage(token, units);

      const [balanceData, predictionData, alertData, historyData] = await Promise.all([
        getBalance(token),
        getPrediction(token),
        getAlert(token),
        getUsageHistory(token),
      ]);

      setBalance(balanceData.data.remaining);
      localStorage.setItem("balance", String(balanceData.data.remaining));

      // Fix: ensure avg shows on first entry
      const pred = predictionData.data;
      if (pred.avgPerDay === 0 && units > 0) {
        pred.avgPerDay = units;
      }

      setPrediction(pred);
      setAlert(alertData.data.alert);
      setHistory(historyData.data);

      setToast({ message: "Usage logged successfully", type: "success" });
    } catch (error: any) {
      setToast({
        message: error?.message || "Something went wrong",
        type: "error",
      });
    }
  };

  // UsageHistory function
  const [history, setHistory] = useState<{ date: string; unitsUsed: number }[]>([]);

  const totalUnitsUsed = history.reduce((acc, item) => acc + item.unitsUsed, 0);
  const estimatedCost = totalUnitsUsed * costPerUnit;

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  if (isCheckingAuth) return null;

  return (
    <div className="min-h-screen bg-dark text-white p-4 md:p-6">
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
          toast.type === "success" ? "bg-success text-white" : "bg-danger text-white"
        }`}>
          {toast.message}
        </div>
      )}
      <div className="sticky top-0 z-50 flex justify-between items-center mb-4 md:mb-6 gap-2 px-4 sm:px-6 py-4 bg-[#0f172a]/80 backdrop-blur border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {pathname !== "/planner" && (
            <button
              onClick={() => router.push("/planner")}
              className="px-4 py-2 border rounded-lg border-gray-600 text-gray-300 hover:border-yellow-400 hover:text-white transition"
            >
              ⚡ Plan Usage
            </button>
          )}

          {pathname === "/planner" && (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border rounded-lg border-yellow-400 hover:bg-yellow-400 hover:text-black transition"
            >
              📊 Dashboard
            </button>
          )}

          <button
            onClick={() => {
              removeToken();
              router.push("/login");
            }}
            className="text-sm border border-red-500 text-red-400 px-3 py-1 rounded hover:bg-red-500/10 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Avatar Dropdown */}
        <div ref={menuRef} className="relative md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1 w-auto bg-yellow-400 text-black font-bold px-2 h-8 rounded-full cursor-pointer hover:scale-105 hover:opacity-90 active:scale-95 transition"
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-200 text-black text-sm">
              {userName?.charAt(0).toUpperCase()}
            </span>
            <span className={`text-xs transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#0f172a] border border-gray-700 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 text-sm text-gray-400">
                Hi {userName} 👋
              </div>

              {pathname !== "/planner" && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/planner");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition"
                >
                  ⚡ Plan Usage
                </button>
              )}

              {pathname === "/planner" && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/dashboard");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition"
                >
                  📊 Dashboard
                </button>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  removeToken();
                  router.push("/login");
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <AlertBanner message={alert} />

      <div className="bg-card p-6 rounded-2xl border border-gray-700 mb-6">
        <h2 className="text-gray-400 text-sm mb-3">
          {balance === 0 ? "Set Initial Units (kWh)" : "Add Units (kWh)"}
        </h2>

        <input
          type="number"
          placeholder={
            balance === 0
              ? "Enter your current electricity units (e.g. 120)"
              : "Add more units (e.g. 50)"
          }
          value={initialUnits}
          onChange={(e) => setInitialUnits(e.target.value)}
          className="w-full p-2 rounded bg-dark border border-gray-600 text-white mb-3"
        />

        <button
          onClick={handleInitializeUnits}
          disabled={!initialUnits || initLoading}
          className={`w-full font-bold py-2 rounded transition ${initLoading ? "bg-gray-500 cursor-not-allowed" : "bg-primary text-black hover:opacity-90"}`}
        >
          {initLoading ? "Processing..." : balance === 0 ? "Set Units" : "Add Units"}
        </button>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-gray-700 mb-6">
        <h2 className="text-gray-400 text-sm mb-3">Electricity Cost (₦ per unit)</h2>

        <input
          type="number"
          placeholder="Enter cost per unit (e.g. 50)"
          value={costPerUnit || ""}
          onChange={(e) => {
            const value = Number(e.target.value);
            setCostPerUnit(value);
            localStorage.setItem("costPerUnit", String(value));
          }}
          className="w-full p-2 rounded bg-dark border border-gray-600 text-white mb-3"
        />

        <div className="text-sm text-gray-400">
          Total Units Used: <span className="text-white font-semibold">{totalUnitsUsed}</span>
        </div>

        <div className="text-lg font-bold text-primary mt-2">
          Estimated Cost: ₦{estimatedCost.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div>
          <BalanceCard remaining={balance} />
          <p className="text-xs text-gray-400 mt-2">
            Remaining electricity (kWh) — matches your meter reading
          </p>
        </div>

        <PredictionCard 
          avgPerDay={prediction.avgPerDay}
          daysLeft={prediction.estimatedDaysLeft}
        />

        <UsageInput onSubmit={handleUsageSubmit} />

        <UsageChart data={history} />
      </div>
    </div>
  );
}