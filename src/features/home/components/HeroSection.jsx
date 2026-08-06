import { homeContent } from "../data/homeContent";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="w-full bg-black text-white rounded-2xl mt-6">
      {/* Franja superior */}
      <div className="bg-amber-600 py-3 px-4 font-bold text-black text-xl border-b-2">
        Exquisitez en Cada Bocado.
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-6 py-10 max-w-screen-lg mx-auto">
        {/* Imagen del plato */}
        <div className="flex-1 flex justify-center">
          <div className="border-4 border-black rounded-xl overflow-hidden w-full max-w-md">
            <img
              src={homeContent.heroImage}
              alt="Plato gourmet"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Texto descriptivo */}
        <div className="flex-1 bg-zinc-900/90 p-6 rounded-2xl shadow-lg text-left w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Menú Degustación Exclusivo
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
            Cada platillo es una manifestación de arte y pasión. Nuestro Chef,
            maestro en la fusión de la tradición y la vanguardia, selecciona
            meticulosamente ingredientes de temporada para orquestar una
            experiencia sensorial inigualable. Le invitamos a descubrir un viaje
            de sabores y texturas que elevan la gastronomía a su máxima
            expresión.
          </p>
          <Link
            to="/dashboard/menu"
            className="text-amber-500 font-semibold hover:underline block mb-2"
          >
            Da click aquí para visualizar menú
          </Link>
          <p className="text-red-500 font-semibold">
            También puedes ver los Productos
          </p>
        </div>
      </div>
    </section>
  );
}
