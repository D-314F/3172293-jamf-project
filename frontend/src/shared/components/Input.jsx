// src/shared/components/Input.jsx
export default function Input({
  label,
  error,
  htmlFor,
  type = "text",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const sizes = {
    sm: "h-9 text-medium",
    md: "h-10 text-body",
    lg: "h-12 text-body",
  };

  return (
    <div className="w-full flex flex-col font-[var(--font-body)]">
      {label && (
        <label
          htmlFor={htmlFor}
          className={`
            block text-medium mb-1
            font-[var(--font-label)]
            ${error ? "text-[var(--color-brand-soft)]" : "text-[var(--color-text-inverse)]"}
          `}
        >
          {label}
        </label>
      )}

      <input
        id={htmlFor}
        type={type}
        disabled={disabled}
        className={`
          w-full rounded-xl border px-4
          font-[var(--font-body)]
          bg-[var(--color-background)]
          text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-muted)]
          focus:outline-none focus:ring-2
          focus:ring-[var(--color-focus-ring)]
          focus:border-[var(--color-focus-border)]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all
          ${error
            ? "border-[var(--color-brand-soft)] ring-1 ring-[var(--color-brand-soft)]"
            : "border-[var(--color-border)]"
          }
          ${sizes[size] || sizes.md}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-medium font-[var(--font-body)] text-[var(--color-brand-soft)] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}