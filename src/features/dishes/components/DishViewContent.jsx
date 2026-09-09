import userProfile from "@/assets/images/user-profile.png";

export default function DishViewContent({ dish }) {
  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)]">
      
            {/* Título */}
        <div className="lg:col-span-3 flex items-center justify-center mb-4">
            <span className="text-[var(--text-display)] font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                Visualizar platillo
            </span>
        </div>


      {/* Imagen y estado */}
      <div className="flex flex-col items-center justify-center gap-4 lg:order-last">
        <img
          src={userProfile}   // ✅ usando la misma imagen de usuarios
          alt={dish.nombre}
          className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-4 border-[var(--color-brand-hover)]"
        />

        <div className="flex items-center gap-2">
          <span className="text-[var(--text-small)]">Estado del platillo:</span>
          <span
            className={`w-3 h-3 rounded-full ${
              dish.activo
                ? "bg-[var(--color-success)]"
                : "bg-[var(--color-error)]"
            }`}
          ></span>
        </div>
      </div>

      {/* Datos del platillo */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Nombre del platillo
          </label>
          <input
            type="text"
            value={dish.nombre}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Categoría
          </label>
          <input
            type="text"
            value={dish.categoria}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Precio
          </label>
          <input
            type="text"
            value={`$${dish.precio}`}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Descripción
          </label>
          <textarea
            value={dish.descripcion}
            readOnly
            rows={3}
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
