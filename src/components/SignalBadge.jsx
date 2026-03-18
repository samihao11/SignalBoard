export default function SignalBadge({ active, label }) {
  return (
    <span
      className={`signal-badge ${active ? "signal-active" : "signal-inactive"}`}
      title={label}
    >
      {active ? "\u2713" : "\u2717"}
    </span>
  );
}
