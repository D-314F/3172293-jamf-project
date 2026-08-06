import { homeContent } from "../data/homeContent";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="w-full bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-2xl mt-6">
      {/* Franja superior */}
     <div className="bg-[var(--color-brand)] py-3 px-4 font-[var(--font-heading)] text-[var(--color-text-primary)] text-[var(--text-large)] border-b-2 border-[var(--color-brand-hover)]">
  Exquisitez en Cada Bocado.
</div>



      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-6 py-10 max-w-screen-lg mx-auto">
        {/* Imagen del plato */}
        <div className="flex-1 flex justify-center">
          <div className="border-4 border-[var(--color-background-inverse)] rounded-xl overflow-hidden w-full max-w-md">
            <img
              src={homeContent.heroImage}
              alt="Plato gourmet"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Texto descriptivo */}
        <div className="flex-1 bg-[var(--color-surface-dark)] p-6 rounded-2xl shadow-lg text-left w-full max-w-md">
          <h2 className="text-[var(--text-title)] md:text-[var(--text-display)] font-[var(--font-heading)] mb-4 text-[var(--color-text-inverse)]">
            Menú Degustación Exclusivo
          </h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-6 text-[var(--text-small)] md:text-[var(--text-base)]">
            Cada platillo es una manifestación de arte y pasión. Nuestro Chef,
            maestro en la fusión de la tradición y la vanguardia, selecciona
            meticulosamente ingredientes de temporada para orquestar una
            experiencia sensorial inigualable. Le invitamos a descubrir un viaje
            de sabores y texturas que elevan la gastronomía a su máxima
            expresión.
          </p>
          <Link
            to="/dashboard/menu"
            className="text-[var(--color-brand)] font-[var(--font-label)] hover:underline block mb-2"
          >
            Da click aquí para visualizar menú
          </Link>
          <p className="text-[var(--color-error)] font-[var(--font-label)]">
            También puedes ver los Productos
          </p>
        </div>
      </div>
    </section>
  );
}
