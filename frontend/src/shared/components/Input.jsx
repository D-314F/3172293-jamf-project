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
  // M3: controles interactivos con altura táctil mínima de 48px
  const sizes = {
    sm: "min-h-[48px] h-12 text-medium",
    md: "min-h-[48px] h-12 text-body",
    lg: "min-h-[52px] h-13 text-body",
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