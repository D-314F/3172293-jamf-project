// src/features/inventory/reports/components/ReportConfigModal.jsx
import { useState } from "react";

// Configuración de campos disponibles para el reporte de inventario
import { inventoryReportFields } from "../config/inventoryReportFields";

// Caso de uso que orquesta la generación del reporte de inventario
import { generateInventoryReport } from "../services/generateInventoryReport";

// Componentes UI reutilizables (design system)
import { Button, Input, Select, Checkbox } from "@/shared";

// Componente modal para configuración de reportes de inventario
export default function ReportConfigModal({ isOpen, onClose }) {
  const [format, setFormat] = useState("pdf");
  const [scope, setScope] = useState("all");
  const [category, setCategory] = useState("");
  const [selectedFields, setSelectedFields] = useState(() =>
    inventoryReportFields.filter((field) => field.default || true) // por defecto todos
  );

  if (!isOpen) return null;

  const handleFieldToggle = (field) => {
    const exists = selectedFields.find((f) => f.key === field.key);
    setSelectedFields(
      exists
        ? selectedFields.filter((f) => f.key !== field.key)
        : [...selectedFields, field]
    );
  };

  const handleGenerateReport = () => {
    generateInventoryReport({ format, selectedFields, scope, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-zinc-900 border-4 border-emerald-600 p-6 shadow-2xl text-black">
        <h2 className="mb-6 text-xl font-semibold text-emerald-500">
          Generar reporte de inventario
        </h2>

        <Select
          label="Formato del reporte"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={[
            { label: "PDF", value: "pdf" },
            { label: "Excel", value: "excel" },
          ]}
        />

        <div className="grid grid-cols-2 gap-2 text-zinc-200 mt-4">
          {inventoryReportFields.map((field) => (
            <Checkbox
              key={field.key}
              label={field.label}
              checked={selectedFields.some((f) => f.key === field.key)}
              onChange={() => handleFieldToggle(field)}
            />
          ))}
        </div>

        <Select
          label="Alcance del reporte"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          options={[
            { label: "Todo el inventario", value: "all" },
            { label: "Filtrar por categoría", value: "category" },
          ]}
        />

        {scope === "category" && (
          <Input
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ej: Bebidas"
          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGenerateReport}>
            Generar reporte
          </Button>
        </div>
      </div>
    </div>
  );
}
