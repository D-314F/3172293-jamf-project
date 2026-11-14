import { Input } from "@/shared";
import {
  resolveDishImage,
  normalizeCategoryLabel,
  formatCopPrice,
} from "../utils/dishImages";

export default function DishViewContent({ dish = {} }) {
  const isDishActive = Boolean(dish.isActive ?? dish.activo ?? dish.active ?? true);
  const imgSrc = resolveDishImage(dish);

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)]/35 shadow-2xl">
      {/* Imagen e Indicador de Estado */}
      <div className="flex flex-col items-center justify-center gap-4 lg:order-last">
        <img
          src={imgSrc}
          alt={dish.nombre || dish.dishName || "Platillo"}
          className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-2xl border-2 border-[var(--color-brand)] shadow-lg"
        />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-dark)] border border-[var(--color-border)]/20">
          <span className="text-xs text-[var(--color-text-muted)] font-[var(--font-label)]">
            Estado:
          </span>
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isDishActive ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]"
            }`}
          />
          <span className="text-xs font-semibold text-[var(--color-text-inverse)]">
            {isDishActive ? "Habilitado" : "Deshabilitado"}
          </span>
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
          value={normalizeCategoryLabel(dish.categoria || dish.category || "")}
          disabled
        />

        <Input
          label="Precio"
          value={formatCopPrice(dish.precio || dish.price || 0)}
          disabled
        />

        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs sm:text-sm font-medium text-[var(--color-text-inverse)]">
            Descripción
          </label>
          <textarea
            value={dish.descripcion || dish.description || ""}
            disabled
            rows={3}
            className="w-full rounded-xl bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] p-3.5 text-sm border border-[var(--color-border)]/20 opacity-90 resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}