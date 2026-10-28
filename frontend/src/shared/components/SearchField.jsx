// src/shared/components/Modal.jsx
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[var(--color-background-inverse)]/70 p-4 transition-opacity duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)] p-6 sm:p-8 shadow-2xl text-[var(--color-text-inverse)] space-y-6">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-[var(--color-brand)]/30 pb-4">
          <h2 className="text-lg sm:text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            {title}
          </h2>
          <IconButton
            onClick={onClose}
            variant="primary"
            size="sm"
            ariaLabel="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Contenido dinámico que le pasemos desde cualquier formulario */}
        <div className="space-y-4">
          {children}
        </div>

      </div>
    </div>
  );
}