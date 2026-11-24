// src/shared/components/Select.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  showConfirmDeleteAlert,
  showSuccessAlert,
  showCancelAlert,
} from "@/shared/services/alertService";

export default function Select({
  label,
  error,
  htmlFor,
  name,
  onChange,
  value,
  options = [],
  className = "",
  confirmChange = false,
  hidePlaceholder = false,
  itemName = "este registro",
  disabled = false,
}) {
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const handleSelectChange = async (e) => {
    if (!confirmChange) {
      onChange?.(e);
      return;
    }

    const newValue = e.target.value;
    if (newValue === internalValue) return;

    const result = await showConfirmDeleteAlert({
      title: "¿Estás seguro?",
      text: `¿Deseas cambiar el estado de ${itemName} a "${newValue}"?`,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "No, cancelar",
    });

    if (result.isConfirmed) {
      setInternalValue(newValue);
      if (onChange) await onChange(newValue);
      await showSuccessAlert({
        title: "¡Estado actualizado!",
        text: `El estado cambió a "${newValue}" con éxito.`,
        timer: 1800,
      });
    } else if (
      result.dismiss === Swal.DismissReason.cancel ||
      result.isDismissed
    ) {
      showCancelAlert({
        title: "Cancelado",
        text: "El estado no sufrió ningún cambio.",
        timer: 1800,
      });
    }
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

      <div className="relative w-full flex items-center">
        <select
          name={name}
          id={htmlFor}
          disabled={disabled}
          onChange={handleSelectChange}
          value={confirmChange ? internalValue : value}
          className={`
            w-full min-h-[48px] h-12 rounded-xl border pl-4 pr-10
            appearance-none
            text-body
            font-[var(--font-body)]
            bg-[var(--color-background)]
            text-[var(--color-text-primary)]
            focus:outline-none focus:ring-2
            focus:ring-[var(--color-focus-ring)]
            focus:border-[var(--color-focus-border)]
            disabled:opacity-60 disabled:cursor-not-allowed
            cursor-pointer transition-all
            ${error ? "border-[var(--color-brand-soft)]" : "border-[var(--color-border)]"}
            ${className}
          `}
        >
          {!hidePlaceholder && (
            <option value="">Seleccione una opción</option>
          )}
          {options.map((opt, index) => {
            const optValue = opt.value ?? opt.id ?? opt.label;
            return (
              <option key={`${optValue}-${index}`} value={optValue}>
                {opt.label}
              </option>
            );
          })}
        </select>

        {/* Flecha clásica estándar MD3 a 16px (right-4) del borde */}
        <div className="absolute right-4 pointer-events-none text-[var(--color-text-primary)] flex items-center justify-center">
          <svg
            className="w-5 h-5 fill-current opacity-70"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-medium font-[var(--font-body)] text-[var(--color-brand-soft)] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}