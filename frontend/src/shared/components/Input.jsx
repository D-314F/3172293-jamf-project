// src/shared/components/Input.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  error,
  htmlFor,
  type = "text",
  size = "md",
  className = "",
  labelClassName = "text-medium",
  disabled = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

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
            block mb-1
            font-[var(--font-label)]
            ${labelClassName}
            ${error ? "text-[var(--color-brand-soft)]" : "text-[var(--color-text-inverse)]"}
          `}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          id={htmlFor}
          type={resolvedType}
          disabled={disabled}
          className={`
            w-full rounded-xl border pl-4 ${isPassword ? "pr-12" : "pr-4"}
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

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-0 top-1/2 -translate-y-1/2 min-w-[48px] min-h-[48px] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] disabled:opacity-40 cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-[var(--font-body)] text-[var(--color-brand-soft)] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}