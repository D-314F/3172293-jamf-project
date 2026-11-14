// src/shared/components/DetailItem.jsx
export default function DetailItem({ label, value, className = "" }) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-[var(--color-border)]/40 py-3 ${className}`}
    >
      <span className="text-small font-[var(--font-label)] text-[var(--color-text-muted)]">
        {label}
      </span>

      <span className="text-medium font-[var(--font-heading)] text-[var(--color-text-inverse)] sm:text-right break-words">
        {value}
      </span>
    </div>
  );
}