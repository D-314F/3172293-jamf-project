// src/shared/components/Card.jsx
export default function Card({ product, className = "" }) {
  if (!product) return null;
  const { title, image, imageUrl, price, description } = product;
  const cardImage = imageUrl || image;

  return (
    <div className={`
      w-full h-full
      bg-[var(--color-background-inverse)]
      border border-[var(--color-border)]
      hover:border-[var(--color-brand)]
      text-[var(--color-text-inverse)]
      shadow-xl hover:shadow-2xl hover:shadow-[var(--color-brand)]/20
      rounded-2xl overflow-hidden
      transition-all duration-300 hover:-translate-y-1.5
      flex flex-col ${className}
    `}>
      {/* Imagen */}
      <div className="relative w-full h-48 bg-[var(--color-surface-muted)]/20 overflow-hidden flex-shrink-0">
        <img
          src={cardImage}
          alt={title || "Elemento del menú"}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-2">
          <h2 className="text-subtitle font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] truncate">
            {title || "Sin título"}
          </h2>
          <p className="text-body font-[var(--font-body)] text-[var(--color-text-muted)] line-clamp-2">
            {description || "Sin descripción"}
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between mt-auto">
          <span className="text-small font-[var(--font-label)] text-[var(--color-text-muted)] uppercase tracking-wider">
            Precio
          </span>
          <p className="text-subtitle font-extrabold font-[var(--font-heading)] text-[var(--color-brand)]">
            ${Number(price || 0).toLocaleString("es-CO")}
          </p>
        </div>
      </div>
    </div>
  );
}