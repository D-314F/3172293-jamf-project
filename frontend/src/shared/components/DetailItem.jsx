// src/shared/components/DetailItem.jsx

export default function DetailItem({ label, value, className = "" }) {
  return (
    <div className={`flex justify-between items-center border-b border-[var(--color-border)]/40 py-3 ${className}`}>
      <span className="text-caption font-[var(--font-heading)] text-[var(--color-text-inverse)]">
        {label}
      </span>

      <span className="text-caption font-[var(--font-body)] text-[var(--color-text-muted)] text-right">
        {value}
      </span>
    </div>
  );
}