import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import Swal from "sweetalert2";
import {
    showConfirmDeleteAlert,
    showSuccessAlert,
    showCancelAlert,
    } from "@/shared/services/alertService";

    export default function StatusSwitch({
    checked = false,
    onChange,
    disabled = false,
    size = "md",
    itemName = "este registro",
    }) {
    const [isActive, setIsActive] = useState(checked);

    useEffect(() => {
        setIsActive(checked);
    }, [checked]);

    const handleToggle = async () => {
        if (disabled) return;

        const newValue = !isActive;
        const actionVerb = newValue ? "activar" : "desactivar";
        const actionTitle = newValue ? "¡Activado!" : "¡Desactivado!";
        const actionPast = newValue ? "activado" : "desactivado";

        const result = await showConfirmDeleteAlert({
        title: "¿Estás seguro?",
        text: `¿Deseas ${actionVerb} ${itemName}?`,
        confirmButtonText: `Sí, ${actionVerb}`,
        cancelButtonText: "No, cancelar",
        });

        if (result.isConfirmed) {
        setIsActive(newValue);

        if (onChange) {
            await onChange(newValue);
        }

        await showSuccessAlert({
            title: actionTitle,
            text: `El registro fue ${actionPast} con éxito.`,
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

    const sizes = {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
    };

    const knobSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    return (
        <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        title={isActive ? "Activo (clic para desactivar)" : "Inactivo (clic para activar)"}
        className={`
            relative inline-flex items-center
            rounded-full transition-colors duration-200
            ${sizes[size]}
            ${isActive ? "bg-green-500" : "bg-gray-400"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        >
        <span
            className={`
            absolute left-0.5 flex items-center justify-center
            rounded-full bg-white shadow
            transition-transform duration-200
            ${knobSizes[size]}
            ${isActive ? "translate-x-full" : "translate-x-0"}
            `}
        >
            {isActive ? (
            <Check size={12} className="text-green-600" />
            ) : (
            <X size={12} className="text-gray-500" />
            )}
        </span>
        </button>
    );
}