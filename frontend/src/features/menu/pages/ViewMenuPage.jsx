import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UtensilsCrossed, Sparkles, Search } from "lucide-react";
import { Button, Card } from "@/shared";
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
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Cabecera compacta y simétrica */}
        <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
          {/* Fila 1: Botón Volver + Título a la izquierda y Badge a la derecha */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]/15">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => navigate(-1)}
                className="!w-auto flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-inverse)] font-[var(--font-heading)] leading-tight">
                  Menú del Restaurante
                </h1>
                <p className="text-medium text-[var(--color-text-muted)]">
                  Platillos activos sincronizados en tiempo real con cocina
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-dark)] border border-[var(--color-brand)]/30 text-[var(--color-brand)] text-medium font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{`${dishes.length} platillos disponibles`}</span>
            </div>
          </div>

          {/* Fila 2: Píldoras de Categorías (>= 48px táctil, gap-4 = 16px) + Buscador (60px área invisible) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-1 lg:pb-0">
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
                    className={`min-h-[48px] px-4 py-2 rounded-xl text-medium font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] shadow-md"
                        : "bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)] border border-[var(--color-border)]/15"
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-small ${
                        isActive
                          ? "bg-black/15 text-[var(--color-text-primary)]"
                          : "bg-[var(--color-background-inverse)] text-[var(--color-text-muted)]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Buscador rápido con área invisible recomendada de 60px */}
            <div className="relative w-full lg:w-72 shrink-0 min-h-[60px] flex items-center">
              <Search className="w-5 h-5 text-[var(--color-brand)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar platillo..."
                className="w-full h-12 min-h-[48px] pl-11 pr-4 rounded-xl bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] placeholder:text-[var(--color-text-muted)] text-medium border border-[var(--color-brand)]/30 focus:outline-none focus:border-[var(--color-brand)] transition-colors"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {filteredItems.map((item) => {
              const categoryLabel = normalizeCategoryLabel(
                item.category || item.dishCategory
              );
              const stock = Number(
                item.effectiveStock ?? item.stock ?? item.dishStock ?? 0
              );
              return (
                <Card
                  key={item.id}
                  title={item.dishName}
                  description={item.description}
                  imageUrl={resolveDishImage(item)}
                  formattedPrice={formatCopPrice(item.price)}
                  categoryBadge={categoryLabel}
                  statusBadge={{
                    label: stock <= 0 ? "Agotado" : `${stock} disp.`,
                    tone: stock <= 0 ? "error" : "neutral",
                  }}
                  footerIcon={<UtensilsCrossed className="w-4 h-4" />}
                  className="hover:-translate-y-1"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}