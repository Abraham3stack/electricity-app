type Props = {
  message: string;
};

export default function AlertBanner({ message}: Props) {
  if (!message || message === "All good") return null;

  return (
    <div className="bg-danger/10 text-white p-4 rounded-xl mb-6 shadow-lg border border-danger hover:scale-105 transition">
      <p className="font-semibold">{message}</p>
    </div>
  );
}