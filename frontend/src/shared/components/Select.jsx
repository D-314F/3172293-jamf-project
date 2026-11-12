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

      <select
        name={name}
        id={htmlFor}
        disabled={disabled}
        onChange={handleSelectChange}
        value={confirmChange ? internalValue : value}
        className={`
          w-full h-10 rounded-xl border px-4
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
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-medium font-[var(--font-body)] text-[var(--color-brand-soft)] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}