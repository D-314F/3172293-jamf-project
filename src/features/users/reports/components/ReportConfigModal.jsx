// Hook para manejo de estado local en componentes funcionales
import { useState } from "react";

// Configuración de campos disponibles para el reporte
import { userReportFields } from "../config/userReportFields";

// Caso de uso que orquesta la generación del reporte
import { generateUserReport } from "../services/generateUserReport";

// Componentes UI reutilizables (design system)
import { Button, Input, Select, Checkbox } from "@/shared";

// Helpers de alertas personalizadas
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService"; 

// Componente modal para configuración de reportes
export default function ReportConfigModal({ isOpen, onClose }) {
  // Estado del formato de salida
  const [format, setFormat] = useState("pdf");

  // Estado del alcance del reporte
  const [scope, setScope] = useState("all");

  // Estado para filtro por documento
  const [documentNumber, setDocumentNumber] = useState("");

  // Estado de carga asíncrona
  const [loading, setLoading] = useState(false);

  // Estado de campos seleccionados (inicialización lazy)
  const [selectedFields, setSelectedFields] = useState(() =>
    userReportFields.filter((field) => field.default)
  );

  // Control de render: si el modal no está abierto, no se monta en el DOM
  if (!isOpen) return null;

  // Handler para activar/desactivar campos del reporte
  const handleFieldToggle = (field) => {
    const exists = selectedFields.find(
      (selectedField) => selectedField.key === field.key
    );

    if (exists) {
      setSelectedFields(
        selectedFields.filter((selectedField) => selectedField.key !== field.key)
      );
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // Seleccionar / Deseleccionar todos los campos
  const handleSelectAll = () => {
    if (selectedFields.length === userReportFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields([...userReportFields]);
    }
  };

  // Handler principal para generar el reporte
  const handleGenerateReport = async () => {
    if (selectedFields.length === 0) {
      return alert("Debes seleccionar al menos un campo para el reporte.");
    }

    if (scope === "document" && !documentNumber.trim()) {
      return alert("Por favor ingresa un número de documento válido.");
    }

    setLoading(true);

    try {
      await generateUserReport({
        format,
        selectedFields,
        scope,
        documentNumber,
      });

      await showSuccessAlert({
        title: "Reporte de usuarios generado",
        text: `El archivo en formato ${format.toUpperCase()} se generó correctamente.`,
        timer: 2000,
      });

      onClose();
    } catch (error) {
      console.error("Error al generar el reporte de usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler para cancelar y confirmar descartar cambios
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
    // Overlay con fondo oscuro difuminado
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4">
      
      {/* Contenedor del modal unificado con variables de marca */}
      <div className="w-full max-w-lg rounded-3xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)] p-6 sm:p-8 shadow-2xl text-[var(--color-black)] space-y-6">
        
        {/* Título unificado */}
        <div className="flex items-center justify-between border-b border-zinc-700/50 pb-4">
          <h2 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Generar reporte de usuarios
          </h2>
        </div>

        {/* Selección de formato */}
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
              { label: "CSV (.csv)", value: "csv" },
            ]}
          />
        </div>

        {/* Selección de campos */}
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
              {selectedFields.length === userReportFields.length
                ? "Deseleccionar todos"
                : "Marcar todos"}
            </button>
          </div>

          {/* Grid de checkboxes con scroll nativo si la lista crece */}
          <div className="grid grid-cols-2 gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 max-h-40 overflow-y-auto">
            {userReportFields.map((field) => {
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

        {/* Selección de alcance */}
        <div>
          <Select
            label="Alcance del reporte"
            labelClassName="text-[var(--color-text-inverse)] mb-2 block"
            name="reportScope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[
              { label: "Todos los usuarios", value: "all" },
              { label: "Solo usuarios activos", value: "active" },
              { label: "Filtrar por documento", value: "document" },
            ]}
          />
        </div>

        {/* Campo condicional para filtro por documento */}
        {scope === "document" && (
          <div>
            <Input
              label="Número de documento"
              labelClassName="text-[var(--color-text-inverse)] mb-2 block"
              name="documentNumber"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Ingrese número de documento"
              htmlFor="report-document-number"
            />
          </div>
        )}

        {/* Acciones del modal */}
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