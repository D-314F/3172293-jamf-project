// src/features/menu/components/DishViewContent.jsx

import { useState } from "react";
import { Input } from "@/shared";
import userProfile from "@/assets/images/user-profile.png";

export default function DishViewContent({ dish = {} }) {
  const isDishActive = dish.activo ?? dish.active ?? true;
  
  // Estado para la imagen con fallback seguro
  const [imgSrc, setImgSrc] = useState(() => {
    return dish.imagen || dish.image || userProfile;
  });

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)] shadow-2xl">
      
      {/* Imagen y estado */}
      <div className="flex flex-col items-center justify-center gap-4 lg:order-last">
        <img
          src={imgSrc}
          alt={dish.nombre || dish.name || "Platillo"}
          onError={() => setImgSrc(userProfile)}
          className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-4 border-[var(--color-brand-hover)] shadow-md"
        />

        <div className="flex items-center gap-2">
          <span className="text-[var(--text-small)] font-[var(--font-label)] text-[var(--color-text-inverse)]">
            Estado del platillo:
          </span>
          <span
            className={`w-3 h-3 rounded-full ${
              isDishActive
                ? "bg-[var(--color-success)]"
                : "bg-[var(--color-error)]"
            }`}
            title={isDishActive ? "Activo" : "Inactivo"}
          ></span>
        </div>
      </div>

      {/* Datos del platillo */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Nombre del platillo"
          value={dish.nombre || dish.dishName || dish.name || ""}
          disabled
        />

        <Input
          label="Categoría"
          value={dish.categoria || dish.category || ""}
          disabled
        />

        <Input
          label="Precio"
          value={`$${dish.precio || dish.price || "0"}`}
          disabled
        />

        {/* Campo de descripción ocupando el ancho completo del bloque de datos */}
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-[var(--color-text-inverse)]">
            Descripción
          </label>
          <textarea
            value={dish.descripcion || dish.description || ""}
            readOnly
            disabled
            rows={3}
            className="w-full bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] border border-[var(--color-border)] rounded-lg p-3 text-sm resize-none opacity-80 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
