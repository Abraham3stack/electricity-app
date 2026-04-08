"use client";

import { useState } from "react";

type Props = {
  onSubmit: (units: number) => void;
};

export default function UsageInput({ onSubmit }: Props) {
  const [units, setUnits] = useState("");

  const handleSubmit = () => {
    const value = Number(units);

    if (!value || value <= 0) {
      alert("Enter valid units");
      return;
    }

    onSubmit(value);
    setUnits("");
  };

  return (
    <div className="bg-card p-6 rounded-2xl border border-gray-700">
      <h2 className="text-gray-400 text-sm mb-3">
        Log Usage
      </h2>

      <input 
        type="number"
        placeholder="Enter units used" 
        value={units}
        onChange={(e) => setUnits(e.target.value)}
        className="w-full p-2 rounded bg-dark border border-gray-600 text-white mb-3"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-black font-bold py-2 rounded hover:opacity-90"
      >
        Submit
      </button>
    </div>
  );
}