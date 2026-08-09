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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-zinc-900 border-4 border-[var(--color-brand)] p-6 shadow-2xl text-[var(--color-text-inverse)]">
        
        <h2 className="mb-6 text-xl font-semibold text-[var(--color-text-inverse)]">
          Generar reporte de inventario
        </h2>

        {/* Select de Formato con estilos oscuros y de marca */}
        <div className="mb-4">
          <Select
            label="Formato del reporte"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { label: "PDF", value: "pdf" },
              { label: "Excel", value: "excel" },
            ]}
            className="bg-zinc-800 text-white border-[var(--color-brand)] w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-zinc-200 my-4">
          {inventoryReportFields.map((field) => (
            <Checkbox
              key={field.key}
              label={field.label}
              checked={selectedFields.some((f) => f.key === field.key)}
              onChange={() => handleFieldToggle(field)}
            />
          ))}
        </div>

        {/* Select de Alcance con estilos oscuros y de marca */}
        <div className="mb-4">
          <Select
            label="Alcance del reporte"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[
              { label: "Todo el inventario", value: "all" },
              { label: "Filtrar por categoría", value: "category" },
            ]}
            className="bg-zinc-800 text-white border-[var(--color-brand)] w-full"
          />
        </div>

        {scope === "category" && (
          <div className="mb-4">
            <Input
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Bebidas"
            />
          </div>
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