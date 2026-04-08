type Props = {
  remaining: number;
};

export default function BalanceCard({ remaining }: { remaining: number }) {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg border border-gray-700 hover:scale-105 transition">
      <h2 className="text-sm text-gray-400">Remaining Units</h2>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-2xl">⚡️</span>
        <p className="text-4xl font-bold text-primary">{remaining}</p>
      </div>
    </div>
  );
}