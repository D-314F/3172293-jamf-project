import { homeContent } from "../data/homeContent";

export default function HeroSection() {
  return (
    <section className="mt-16 ml-40 w-300 bg-black text-white rounded-2xl">
      {/* Franja superior */}
      <div className="   bg-amber-600 py-3 pl-4 font-bold text-black text-xl border-b-2">
        Exquisitez en Cada Bocado.
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 px-10 py-16 max-w-6xl mx-auto">
        {/* Imagen del plato */}
        <div className="flex-1 flex justify-center">
          <div className="p-2 border-4 border-black">
            <img
              src={homeContent.heroImage}
              alt="Plato gourmet"
              className="w-95 h-auto object-cover"
            />
          </div>
        </div>

        {/* Texto descriptivo */}
        <div className="flex-1 bg-zinc-900/90 p-8 rounded-2xl shadow-lg text-left max-w-xl">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Menú Degustación Exclusivo
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Cada platillo es una manifestación de arte y pasión. Nuestro Chef,
            maestro en la fusión de la tradición y la vanguardia, selecciona
            meticulosamente ingredientes de temporada para orquestar una
            experiencia sensorial inigualable. Le invitamos a descubrir un viaje
            de sabores y texturas que elevan la gastronomía a su máxima
            expresión.
          </p>
          <p className="text-amber-500 font-semibold mb-2">
            Da click aquí para visualizar menú
          </p>
          <p className="text-red-500 font-semibold ">
            Tambien Puedes ver los Productos
          </p>
        </div>
      </div>
    </section>
  );
}
