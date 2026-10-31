import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
    showConfirmDeleteAlert,
    showSuccessAlert,
    showCancelAlert,
    } from "@/shared/services/alertService";

    // Componente Select
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

        if (onChange) {
            await onChange(newValue);
        }

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
        <div className="w-full flex flex-col">
        {label && (
            <label
            htmlFor={htmlFor}
            className={`
                block 
                text-caption
                mb-1
                text-secondary
                text-white
                ${error ? "text-red-800" : "text-secondary"}
            `}
            >
            {label}
            </label>
        )}

        <select
            name={name}
            onChange={handleSelectChange}
            value={confirmChange ? internalValue : value}
            id={htmlFor}
            className={`
            w-full
            h-10
            rounded-md
            border
            px-4
            ${error ? "border-red-800" : "border-border"}
            ${className || "bg-white text-black"} 
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
            <p className="text-caption text-red-800 place-self-start mt-1">
            {error}
            </p>
        )}
        </div>
    );
}