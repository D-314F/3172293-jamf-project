// Componente Card (Presentacional, limpio, moderno y reutilizable)
// src/shared/components/Card.jsx

const Card = ({ product }) => {
  const { title, image, price, description } = product;

  return (
    <div
      className="
        w-80
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
      "
    >
      {/* Contenedor de la imagen con un fondo sutil para evitar contrastes cortantes */}
      <div className="relative w-full h-48 bg-zinc-950/50 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full"
        />
      </div>

      {/* Contenido de la card */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>

          <p className="text-sm text-zinc-400">
            {description}
          </p>
        </div>

        {/* Precio destacado con el color de marca */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs uppercase text-zinc-500 font-semibold">Precio</span>
          <p className="text-lg font-extrabold text-[var(--color-brand)]">
            ${price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;