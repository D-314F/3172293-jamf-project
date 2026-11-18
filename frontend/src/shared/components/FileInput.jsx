// src/shared/components/FileInput.jsx
// Input controlado: soporta imágenes + PDF, preview condicional, reorder y
// limpieza de memoria

import { useRef, useState, useEffect, useMemo } from "react";
import { Infinity as InfinityLoader } from "ldrs/react";
import "ldrs/react/Infinity.css";

export default function FileInput({
  value = [], // estado externo (files)
  onChange, // setter externo
  multiple = false, // modo selección
  accept = "image/*,application/pdf", // tipos permitidos
}) {
  const inputRef = useRef(); // input oculto
  const [isLoading, setIsLoading] = useState(false); // loader
  const [dragIndex, setDragIndex] = useState(null); // índice drag

  const isImage = (file) => file.type.startsWith("image/"); // discriminador MIME

  // Genera previews SOLO para imágenes (evita crear URLs innecesarias)
  const previews = useMemo(
    () =>
      value.map((file) => (isImage(file) ? URL.createObjectURL(file) : null)),
    [value],
  );

  // Limpieza de ObjectURL (prevención memory leak)
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  // Normaliza FileList, simula async y limita a 12
  const handleFiles = async (files) => {
    setIsLoading(true);

    const list = Array.from(files);
    await new Promise((r) => setTimeout(r, 500));

    const data = multiple ? [...value, ...list] : [list[0]];
    onChange(data.slice(0, 12));

    setIsLoading(false);
  };

  // Eliminación inmutable
  const remove = (i) => {
    const copy = [...value];
    copy.splice(i, 1);
    onChange(copy);
  };

  // Reordenamiento por drag & drop
  const reorder = (from, to) => {
    const copy = [...value];
    const [m] = copy.splice(from, 1);
    copy.splice(to, 0, m);
    onChange(copy);
  };

  return (
    <div className="flex items-center gap-2">
      {value.map((file, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => reorder(dragIndex, i)}
          className="relative w-24 h-24 border rounded overflow-hidden group"
        >
          {/* Render condicional: imagen vs archivo genérico */}
          {isImage(file) ? (
            <img src={previews[i]} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] text-caption px-1">
              <span className="font-semibold">PDF</span>
              <span className="truncate w-full text-center">{file.name}</span>
            </div>
          )}

          {/* Acciones hover: eliminar con objetivo táctil >= 48px */}
          <div className="absolute top-1 right-1 flex flex-col gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Eliminar ${file.name}`}
              className="min-w-[48px] min-h-[48px] bg-[var(--color-background-inverse)]/90 border border-[var(--color-brand)]/40 rounded-full text-[var(--color-text-inverse)] text-medium flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {/* Trigger de input oculto + loader */}
      <div
        onClick={() => !isLoading && inputRef.current.click()}
        className="w-24 h-24 border-2 border-dashed border-[var(--color-border)] rounded flex items-center justify-center cursor-pointer"
      >
        {isLoading ? (
          <InfinityLoader
            size="55"
            stroke="4"
            strokeLength="0.15"
            bgOpacity="0.1"
            speed="1.3"
            color="currentColor"
          />
        ) : (
          <span className="text-[var(--color-brand)] text-medium font-medium">Seleccionar</span>
        )}
      </div>

      {/* Input desacoplado de UI */}
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}