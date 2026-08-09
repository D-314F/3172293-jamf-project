// Hook para manejo de estado local en componentes funcionales
import { useState } from "react";

// Configuracion de campos disponibles para el reporte
import { userReportFields } from "../config/userReportFields";

// Caso de uso que orquesta la generacion del reporte
import { generateUserReport } from "../services/generateUserReport";

// Componentes UI reutilizables (design system)
import { Button, Input, Select, Checkbox } from "@/shared";

// Componente modal para configuracion de reportes
export default function ReportConfigModal({ isOpen, onClose }) {
  // Estado del formato de salida
  const [format, setFormat] = useState("pdf");

  // Estado del alcance del reporte
  const [scope, setScope] = useState("all");

  // Estado para filtro por documento
  const [documentNumber, setDocumentNumber] = useState("");

  // Estado de campos seleccionados (inicializacion lazy)
  const [selectedFields, setSelectedFields] = useState(() =>
    userReportFields.filter((field) => field.default),
  );

  // Control de render: si el modal no esta abierto, no se monta en el DOM
  if (!isOpen) return null;

  // Handler para activar/desactivar campos del reporte
  const handleFieldToggle = (field) => {
    const exists = selectedFields.find((selectedField) => selectedField.key === field.key);

    if (exists) {
      setSelectedFields(selectedFields.filter((selectedField) => selectedField.key !== field.key));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // Handler principal para generar el reporte
  const handleGenerateReport = () => {
    generateUserReport({
      format,
      selectedFields,
      scope,
      documentNumber,
    });

    onClose();
  };

  return (
    // Overlay con fondo oscuro difuminado
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
      
      {/* Contenedor del modal unificado con variables de marca */}
      <div className="w-full max-w-lg rounded-xl bg-zinc-900 border-4 border-[var(--color-brand)] p-6 shadow-2xl text-[var(--color-text-inverse)]">
        
        {/* Título unificado */}
        <h2 className="mb-6 text-xl font-semibold text-[var(--color-text-inverse)]">
          Generar reporte de usuarios
        </h2>

        {/* Selección de formato con estilos oscuros y de marca */}
        <div className="mb-4">
          <Select
            label="Formato del reporte"
            name="reportFormat"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { label: "PDF", value: "pdf" },
              { label: "Excel", value: "excel" },
            ]}
            className="bg-zinc-800 text-white border-[var(--color-brand)] w-full"
          />
        </div>

        {/* Selección de campos */}
        <div className="mb-4">
          <p className="mb-2 font-medium text-zinc-300">Campos del reporte</p>

          {/* Grid de checkboxes */}
          <div className="grid grid-cols-2 gap-2 text-zinc-200">
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

        {/* Selección de alcance con estilos oscuros y de marca */}
        <div className="mb-4">
          <Select
            label="Alcance del reporte"
            name="reportScope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[
              { label: "Todos los usuarios", value: "all" },
              { label: "Filtrar por documento", value: "document" },
            ]}
            className="bg-zinc-800 text-white border-[var(--color-brand)] w-full"
          />
        </div>

        {/* Campo condicional para filtro por documento */}
        {scope === "document" && (
          <div className="mb-4">
            <Input
              label="Número de documento"
              name="documentNumber"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Ingrese número de documento"
              htmlFor="report-document-number"
            />
          </div>
        )}

        {/* Acciones del modal */}
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