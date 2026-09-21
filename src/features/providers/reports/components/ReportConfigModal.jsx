import { useState } from "react";

// Configuración de campos disponibles para el reporte de proveedores
import { providerReportFields } from "../config/providerReportFields";

// Caso de uso que orquesta la generación del reporte de proveedores
import { generateProviderReport } from "../services/generateProviderReport";

// Componentes UI reutilizables (design system)
import { Button, Input, Select, Checkbox } from "@/shared";

// Helpers de alertas personalizadas
import {
  showSuccessAlert,
  showCancelAlert,
} from "@/shared/services/alertService";

// Componente modal para configuración de reportes de proveedores
export default function ReportConfigModal({ isOpen, onClose }) {
  // Estado del formato de salida
  const [format, setFormat] = useState("pdf");

  // Estado del alcance del reporte
  const [scope, setScope] = useState("all");

  // Estado para filtro por tipo de documento
  const [documentType, setDocumentType] = useState("");

  // Estado de carga
  const [loading, setLoading] = useState(false);

  // Estado de campos seleccionados
  const [selectedFields, setSelectedFields] = useState(() =>
    providerReportFields.filter((field) => field.default)
  );

  // Si el modal no está abierto, no se muestra
  if (!isOpen) return null;

  // Activar / desactivar campos
  const handleFieldToggle = (field) => {
    const exists = selectedFields.find(
      (selectedField) => selectedField.key === field.key
    );

    if (exists) {
      setSelectedFields(
        selectedFields.filter(
          (selectedField) => selectedField.key !== field.key
        )
      );
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // Seleccionar / deseleccionar todos
  const handleSelectAll = () => {
    if (selectedFields.length === providerReportFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields([...providerReportFields]);
    }
  };

  // Generar reporte
  const handleGenerateReport = async () => {
    // Validar que haya al menos un campo seleccionado
    if (selectedFields.length === 0) {
      return alert("Debes seleccionar al menos un campo para el reporte.");
    }

    // Validar tipo de documento
    if (scope === "documentType" && !documentType.trim()) {
      return alert("Por favor ingresa un tipo de documento válido.");
    }

    setLoading(true);

    try {
      await generateProviderReport({
        format,
        selectedFields,
        scope,
        documentType,
      });

      // Alerta de éxito
      await showSuccessAlert({
        title: "Reporte de proveedores generado",
        text: `El archivo en formato ${format.toUpperCase()} se generó correctamente.`,
        timer: 2000,
      });

      // Cerrar modal después de generar
      onClose();
    } catch (error) {
      console.error("Error al generar el reporte de proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar reporte
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

        {/* Título */}
        <div className="flex items-center justify-between border-b border-zinc-700/50 pb-4">
          <h2 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Generar reporte de proveedores
          </h2>
        </div>

        {/* Formato */}
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

        {/* Campos */}
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
              {selectedFields.length === providerReportFields.length
                ? "Deseleccionar todos"
                : "Marcar todos"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 max-h-40 overflow-y-auto">
            {providerReportFields.map((field) => {
              const checked = selectedFields.some(
                (selectedField) => selectedField.key === field.key
              );

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

        {/* Alcance */}
        <div>
          <Select
            label="Alcance del reporte"
            labelClassName="text-[var(--color-text-inverse)] mb-2 block"
            name="reportScope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[
              { label: "Todos los proveedores", value: "all" },
              {
                label: "Filtrar por tipo de documento",
                value: "documentType",
              },
            ]}
          />
        </div>

        {/* Filtro por documento */}
        {scope === "documentType" && (
          <div>
            <Input
              label="Tipo de documento"
              labelClassName="text-[var(--color-text-inverse)] mb-2 block"
              name="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              placeholder="Ej: Cédula de ciudadanía"
              htmlFor="report-document-type"
            />
          </div>
        )}

        {/* Botones */}
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
            {loading ? "Generando..." : "Generar reporte"}
          </Button>
        </div>
      </div>
    </div>
  );
}