import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UtensilsCrossed, Sparkles, Search } from "lucide-react";
import { Button } from "@/shared";
import { getDishes } from "@/features/dishes/services/dishServices";
import {
  resolveDishImage,
  normalizeCategoryLabel,
  formatCopPrice,
} from "@/features/dishes/utils/dishImages";

const CATEGORIES = [
  "Todas",
  "Entradas",
  "Platos Fuertes",
  "Ensaladas",
  "Postres",
  "Bebidas",
];

export default function ViewMenuPage() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDishes = async () => {
      try {
        const data = await getDishes();
        if (isMounted) {
          const activeDishes = (Array.isArray(data) ? data : []).filter(
            (d) => d.isActive !== false && d.status !== "Deshabilitado"
          );
          setDishes(activeDishes);
        }
      } catch (err) {
        console.error("Error al cargar el menú:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDishes();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return dishes.filter((item) => {
      const categoryLabel = normalizeCategoryLabel(item.category || item.dishCategory);
      const matchesCategory =
        activeCategory === "Todas" || categoryLabel === activeCategory;

      const name = (item.dishName || item.nombre || "").toLowerCase();
      const desc = (item.description || item.descripcion || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || name.includes(q) || desc.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [dishes, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        {/* Cabecera compacta y simétrica sin espacio vacío */}
        <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
          {/* Fila 1: Botón Volver + Título a la izquierda y Badge a la derecha */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--color-border)]/15">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => navigate(-1)}
                className="!w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-inverse)] font-[var(--font-heading)] leading-tight">
                  Menú del Restaurante
                </h1>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                  Platillos activos sincronizados en tiempo real con cocina
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-dark)] border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dishes.length} platillos disponibles</span>
            </div>
          </div>

          {/* Fila 2: Píldoras de Categorías a la izquierda + Buscador a la derecha */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                const count =
                  category === "Todas"
                    ? dishes.length
                    : dishes.filter(
                        (d) =>
                          normalizeCategoryLabel(d.category || d.dishCategory) ===
                          category
                      ).length;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] shadow-md"
                        : "bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)] border border-[var(--color-border)]/15"
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                        isActive
                          ? "bg-black/15 text-[var(--color-text-primary)]"
                          : "bg-white/5 text-[var(--color-text-muted)]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Buscador rápido en la misma barra */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-[var(--color-brand)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar platillo..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] placeholder:text-[var(--color-text-muted)] text-sm border border-[var(--color-brand)]/30 focus:outline-none focus:border-[var(--color-brand)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Grid de platillos */}
        {loading ? (
          <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/20 rounded-3xl p-12 text-center text-[var(--color-text-muted)]">
            Cargando carta gastronómica...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/20 rounded-3xl p-12 text-center text-[var(--color-text-muted)]">
            No se encontraron platillos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const categoryLabel = normalizeCategoryLabel(
                item.category || item.dishCategory
              );
              return (
                <article
                  key={item.id}
                  className="group bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/25 hover:border-[var(--color-brand)] rounded-2xl overflow-hidden shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-[var(--color-surface-dark)]">
                      <img
                        src={resolveDishImage(item)}
                        alt={item.dishName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-background-inverse)]/90 text-[var(--color-brand)] border border-[var(--color-brand)]/30 backdrop-blur-sm">
                        {categoryLabel}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col gap-1.5">
                      <h2 className="text-base font-bold text-[var(--color-text-inverse)] font-[var(--font-heading)]">
                        {item.dishName}
                      </h2>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-[var(--color-border)]/10 mt-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-[var(--color-text-muted)]">
                        Precio
                      </span>
                      <span className="text-base font-bold text-[var(--color-brand)]">
                        {formatCopPrice(item.price)}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 flex items-center justify-center text-[var(--color-brand)]">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}