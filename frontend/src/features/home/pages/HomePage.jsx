// src/features/home/pages/HomePage.jsx
import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Boxes,
  UtensilsCrossed,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { homeContent } from "../data/homeContent";

const HIGHLIGHTS = [
  {
    icon: UtensilsCrossed,
    title: "Cocina de Autor",
    description: "Platillos estandarizados con ingredientes frescos.",
  },
  {
    icon: ClipboardList,
    title: "Comandas Ágiles",
    description: "Control de mesas y estados de orden en tiempo real.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso por Roles",
    description: "Seguridad adaptada para cada perfil del restaurante.",
  },
];

export default function HomePage() {
  const {
    topBannerText,
    heroTitle,
    heroDescription,
    heroImage,
  } = homeContent;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero Principal Remasterizado */}
      <section className="w-full bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl border border-[var(--color-brand)]/40 shadow-2xl overflow-hidden">
        {/* Franja superior dorada */}
        <div className="bg-[var(--color-brand)] py-2.5 px-5 font-[var(--font-heading)] text-[var(--color-text-primary)] text-medium flex items-center justify-between border-b border-[var(--color-brand-hover)]">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {topBannerText || "Exquisitez en Cada Bocado."}
          </span>
          <span className="text-small uppercase tracking-wider opacity-80 hidden sm:inline">
            JAMF POS Gastronómico
          </span>
        </div>

        {/* Contenido Hero: Vertical en Mobile, Horizontal en Desktop */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6 sm:p-10">
          {/* Imagen del plato */}
          <div className="w-full lg:w-5/12 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-brand)]/35 shadow-xl w-full max-w-sm bg-[var(--color-surface-dark)]">
              <img
                src={heroImage}
                alt="Plato gourmet JAMF"
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Card descriptiva con botones M3 e iconografía */}
          <div className="w-full lg:w-7/12 bg-[var(--color-surface-dark)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]/60 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-[var(--font-heading)] bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/30">
              Especialidad de la Casa
            </span>

            <h1 className="text-main sm:text-display font-[var(--font-heading)] text-[var(--color-text-inverse)] leading-tight">
              {heroTitle || "Menú Degustación Exclusivo"}
            </h1>

            <p className="text-medium sm:text-body text-[var(--color-text-muted)] leading-relaxed">
              {heroDescription ||
                "Descubre nuestra fusión de sabores con ingredientes frescos y técnicas gastronómicas pensadas para ofrecer una experiencia inolvidable en mesa."}
            </p>

            {/* Acciones claras con íconos para móvil y desktop */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/dashboard/menu"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-brand)] text-[var(--color-text-primary)] font-[var(--font-heading)] text-medium hover:bg-[var(--color-brand-hover)] transition active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Menú</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard/inventoryList"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] border border-[var(--color-border)] hover:border-[var(--color-brand)] font-[var(--font-label)] text-medium transition active:scale-[0.98]"
              >
                <Boxes className="w-4 h-4 text-[var(--color-brand)]" />
                <span>Ver Inventario</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas inferiores de resumen visual (Estilo Selora POS) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-background-inverse)] border border-[var(--color-border)]/70 hover:border-[var(--color-brand)]/50 transition shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
              <Icon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                {title}
              </h3>
              <p className="text-medium text-[var(--color-text-muted)] mt-1">
                {description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}