// Componente Card (Presentacional, limpio, moderno y reutilizable)
// src/shared/components/Card.jsx

const Card = ({ product, className = "" }) => {
  // Blindaje por si el producto llega vacío
  if (!product) return null;

  const { title, image, price, description } = product;

  return (
    <div
      className={`
        w-full
        h-full
        bg-zinc-900
        border-2 border-zinc-800
        hover:border-[var(--color-brand)]
        text-zinc-100
        shadow-xl
        hover:shadow-2xl
        hover:shadow-[var(--color-brand)]
        rounded-2xl
        overflow-hidden
        transition-all
        hover:-translate-y-1.5
        flex
        flex-col
        ${className}
      `}
    >

      <div className="relative w-full h-48 bg-zinc-950/50 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title || "Platillo"}
          className="w-full h-full object-cover"
        />
      </div>

      
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white truncate">
            {title || "Sin título"}
          </h2>

        
          <p className="text-sm text-zinc-400 line-clamp-2">
            {description || "Sin descripción"}
          </p>
        </div>

        
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between mt-auto">
          <span className="text-xs uppercase text-zinc-500 font-semibold">Precio</span>
          <p className="text-lg font-extrabold text-[var(--color-brand)]">
            ${price?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;