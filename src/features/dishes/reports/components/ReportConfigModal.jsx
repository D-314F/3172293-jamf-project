import { useState } from "react";

// Configuración de campos disponibles para el reporte de platillos
import { dishReportFields } from "../config/dishReportFields";

// Caso de uso que orquesta la generación del reporte de platillos
import { generateDishReport } from "../services/generateDishReport";

// Componentes UI reutilizables (design system)
import { Button, Input, Select, Checkbox } from "@/shared";

// Helpers de alertas personalizadas
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService"; 


export default function ReportConfigModal({ isOpen, onClose }) {
  const [format, setFormat] = useState("pdf");
  const [scope, setScope] = useState("all");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState(() =>
    dishReportFields.filter((field) => field.default)
  );

  if (!isOpen) return null;

  // Seleccionar / Deseleccionar un campo
  const handleFieldToggle = (field) => {
    const exists = selectedFields.find((f) => f.key === field.key);
    setSelectedFields(
      exists
        ? selectedFields.filter((f) => f.key !== field.key)
        : [...selectedFields, field]
    );
  };

  // Seleccionar todos los campos
  const handleSelectAll = () => {
    if (selectedFields.length === dishReportFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields([...dishReportFields]);
    }
  };

  // Generar reporte
  const handleGenerateReport = async () => {
    if (selectedFields.length === 0) {
      return alert("Debes seleccionar al menos un campo para incluir en el reporte.");
    }

    setLoading(true);

    try {
      await generateDishReport({ format, selectedFields, scope, category });

      await showSuccessAlert({
        title: "Reporte generado",
        text: `El reporte en formato ${format.toUpperCase()} se procesó correctamente.`,
        timer: 2000,
      });

      onClose();
    } catch (error) {
      console.error("Error al generar reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar generación
  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Se descartará la configuración del reporte.",
      timer: 2500,
    });

    if (result.isConfirmed) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)] p-6 sm:p-8 shadow-2xl text-[var(--color-black)] space-y-6">
        
        {/* Título */}
        <div className="flex items-center justify-between border-b border-zinc-700/50 pb-4">
          <h2 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Generar reporte de platillos
          </h2>
        </div>

        {/* Formato del reporte */}
        <div>
          <Select
            label="Formato del reporte"
            labelClassName="text-[var(--color-text-inverse)] mb-2 block"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { label: "PDF (.pdf)", value: "pdf" },
              { label: "Excel (.xlsx)", value: "excel" },
              { label: "CSV (.csv)", value: "csv" },
            ]}
          />
        </div>

        {/* Selección de Campos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--color-text-inverse)]">
              Campos a incluir:
            </label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-[var(--color-brand)] hover:underline font-medium"
            >
              {selectedFields.length === dishReportFields.length
                ? "Deseleccionar todos"
                : "Marcar todos"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 max-h-40 overflow-y-auto">
            {dishReportFields.map((field) => (
              <Checkbox
                key={field.key}
                id={`field-${field.key}`}
                label={field.label}
                checked={selectedFields.some((f) => f.key === field.key)}
                onChange={() => handleFieldToggle(field)}
              />
            ))}
          </div>
        </div>

        {/* Alcance del reporte */}
        <div>
          <Select
            label="Alcance del reporte"
            labelClassName="text-[var(--color-text-inverse)] mb-2 block"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[
              { label: "Todos los platillos", value: "all" },
              { label: "Solo platillos activos", value: "active" },
              { label: "Filtrar por categoría", value: "category" },
            ]}
          />
        </div>

        {/* Campo dinámico si es por categoría */}
        {scope === "category" && (
          <div>
            <Input
              label="Categoría"
              labelClassName="text-[var(--color-text-inverse)] mb-2 block"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Postres, Bebidas..."
            />
          </div>
        )}

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