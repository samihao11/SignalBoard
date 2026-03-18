export default function SignalBadge({ active, label }) {
  return (
    <span
      className={`text-lg font-bold ${active ? "text-green-600" : "text-gray-300"}`}
      title={label}
    >
      {active ? "\u2713" : "\u2717"}
    </span>
  );
}
