// src/features/home/components/HeroSection.jsx

import { Link } from "react-router-dom";
import { homeContent } from "../data/homeContent";

export default function HeroSection() {
  const { 
    topBannerText, 
    heroTitle, 
    heroDescription, 
    menuLinkText, 
    productsLinkText, 
    heroImage 
  } = homeContent;

  return (
    <section className="w-full bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-2xl mt-6 overflow-hidden">
      {/* Franja superior con texto en negro */}
      <div className="bg-[var(--color-brand)] py-3 px-4 font-[var(--font-heading)] text-black font-semibold text-[var(--text-large)] border-b-2 border-[var(--color-brand-hover)]">
        {topBannerText || "Exquisitez en Cada Bocado."}
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-6 py-10 max-w-6xl mx-auto">
        {/* Imagen del plato */}
        <div className="flex-1 flex justify-center w-full">
          <div className="border-2 border-[var(--color-brand)]/30 rounded-xl overflow-hidden w-full max-w-md shadow-lg">
            <img
              src={heroImage}
              alt="Plato gourmet"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Texto descriptivo */}
        <div className="flex-1 bg-[var(--color-surface-dark)] p-6 rounded-2xl shadow-lg text-left w-full max-w-md border border-[var(--color-brand)]/20">
          <h2 className="text-[var(--text-title)] md:text-[var(--text-display)] font-[var(--font-heading)] mb-4 text-[var(--color-text-inverse)]">
            {heroTitle || "Menú Degustación Exclusivo"}
          </h2>

          <p className="text-[var(--color-text-muted)] leading-relaxed mb-6 text-[var(--text-small)] md:text-[var(--text-base)]">
            {heroDescription || "Descubre la fusión perfecta de sabores en nuestro menú degustación, cuidadosamente elaborado para ofrecerte una experiencia culinaria inolvidable. Cada plato es una obra maestra que combina ingredientes frescos y técnicas innovadoras, diseñada para deleitar tus sentidos y llevarte en un viaje gastronómico único."}
          </p>

          <Link
            to="/dashboard/menu"
            className="text-[var(--color-brand)] font-[var(--font-label)] hover:underline block mb-2 transition"
          >
            {menuLinkText || "Da click aquí para visualizar menú"}
          </Link>

          <Link
            to="/dashboard/inventoryList"
            className="text-[var(--color-brand)] font-[var(--font-label)] hover:underline block transition"
          >
            {productsLinkText || "También puedes ver los Productos"}
          </Link>
        </div>
      </div>
    </section>
  );
}
