// src/shared/components/Modal.jsx
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

export default function Modal({ isOpen = true, onClose, title, children }) {
  // Si isOpen es false, no muestra nada en pantalla
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[var(--color-background-inverse)]/70 p-4 duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)] p-6 sm:p-8 shadow-2xl text-[var(--color-text-inverse)] space-y-6">
        
        {/* Cabecera del Modal (se muestra si enviamos title o onClose) */}
        {(title || onClose) && (
          <div className="flex items-center justify-between border-[var(--color-brand)]/30">
            <h2 className="text-lg sm:text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              {title}
            </h2>
            {onClose && (
              <IconButton
                onClick={onClose}
                variant="primary"
                size="sm"
                ariaLabel="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </IconButton>
            )}
          </div>
        )}

        {/* Contenido dinámico */}
        <div className="space-y-4">
          {children}
        </div>

      </div>
    </div>
  );
}