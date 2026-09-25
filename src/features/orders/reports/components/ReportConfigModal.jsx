import { useState } from "react";
import { orderReportFields } from "../config/orderReportFields";
import { generateOrderReport } from "../services/generateOrderReport";
import { Button, Input, Select, Checkbox } from "@/shared";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService";

export default function ReportConfigModal({ isOpen, onClose }) {
const [format, setFormat] = useState("pdf");
const [scope, setScope] = useState("all");
const [filterValue, setFilterValue] = useState("");
const [loading, setLoading] = useState(false);

const [selectedFields, setSelectedFields] = useState(() =>
orderReportFields.filter((field) => field.default)
);

if (!isOpen) return null;

const handleFieldToggle = (field) => {
const exists = selectedFields.find((f) => f.key === field.key);
if (exists) {
    setSelectedFields(selectedFields.filter((f) => f.key !== field.key));
} else {
    setSelectedFields([...selectedFields, field]);
}
};

const handleSelectAll = () => {
if (selectedFields.length === orderReportFields.length) {
    setSelectedFields([]);
} else {
    setSelectedFields([...orderReportFields]);
}
};

const handleGenerateReport = async () => {
if (selectedFields.length === 0) {
    return alert("Debes seleccionar al menos un campo para incluir en el reporte.");
}

if (scope !== "all" && !filterValue.trim()) {
    return alert("Por favor ingresa el valor del filtro seleccionado.");
}

setLoading(true);

try {
    const generated = generateOrderReport({
    format,
    selectedFields,
    scope,
    filterValue,
    });

    if (generated) {
    await showSuccessAlert({
        title: "Reporte de órdenes generado",
        text: `El archivo en formato ${format.toUpperCase()} se generó correctamente.`,
        timer: 2000,
    });
    onClose();
    }
} catch (error) {
    console.error("Error al generar el reporte de órdenes:", error);
} finally {
    setLoading(false);
}
};

const handleCancel = async () => {
const result = await showCancelAlert({
    title: "¿Deseas cancelar?",
    text: "Se descartará la configuración seleccionada.",
    timer: 2500,
});

if (result.isConfirmed) {
    onClose();
}
};

return (
<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4">
    <div className="w-full max-w-lg rounded-3xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)] p-6 sm:p-8 shadow-2xl text-[var(--color-black)] space-y-6">
    <div className="flex items-center justify-between border-b border-zinc-700/50 pb-4">
        <h2 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
        Generar reporte de órdenes
        </h2>
    </div>

    {/* Selección de Formato */}
    <div>
        <Select
        label="Formato del reporte"
        labelClassName="text-[var(--color-text-inverse)] mb-2 block"
        name="reportFormat"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        options={[
            { label: "PDF (.pdf)", value: "pdf" },
            { label: "Excel (.xlsx)", value: "excel" },
        ]}
        />
    </div>

    {/* Selección de Campos */}
    <div className="space-y-3">
        <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-inverse)]">
            Campos a incluir:
        </p>
        <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-[var(--color-brand)] hover:underline font-medium"
        >
            {selectedFields.length === orderReportFields.length
            ? "Deseleccionar todos"
            : "Marcar todos"}
        </button>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 max-h-40 overflow-y-auto">
        {orderReportFields.map((field) => {
            const checked = selectedFields.some((f) => f.key === field.key);
            return (
            <Checkbox
                key={field.key}
                id={field.key}
                name={field.key}
                label={field.label}
                checked={checked}
                onChange={() => handleFieldToggle(field)}
            />
            );
        })}
        </div>
    </div>

    {/* Alcance y Filtros */}
    <div className="space-y-3">
        <Select
        label="Alcance del reporte"
        labelClassName="text-[var(--color-text-inverse)] mb-2 block"
        name="reportScope"
        value={scope}
        onChange={(e) => {
            setScope(e.target.value);
            setFilterValue("");
        }}
        options={[
            { label: "Todas las órdenes", value: "all" },
            { label: "Filtrar por Estado", value: "status" },
            { label: "Filtrar por Proveedor", value: "supplier" },
            { label: "Filtrar por ID de Orden", value: "orderId" },
        ]}
        />

        {scope !== "all" && (
        <Input
            label={
            scope === "status"
                ? "Estado (ej: Pendiente, Entregado, Cancelado)"
                : scope === "supplier"
                ? "Nombre del proveedor"
                : "ID de la orden"
            }
            labelClassName="text-[var(--color-text-inverse)] mb-2 block"
            name="filterValue"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Ingrese el valor a buscar..."
        />
        )}
    </div>

    {/* Acciones */}
    <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
        <Button
        type="button"
        variant="secondary"
        onClick={handleCancel}
        disabled={loading}
        className="w-full sm:w-auto"
        >
        Cancelar
        </Button>

        <Button
        type="button"
        onClick={handleGenerateReport}
        disabled={loading}
        className="bg-[var(--color-brand)] text-[var(--color-text-primary)] font-[var(--font-heading)] hover:bg-[var(--color-brand-hover)] transition w-full sm:w-auto"
        >
        {loading ? "Generando..." : "Descargar reporte"}
        </Button>
    </div>
    </div>
</div>
);
}