import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  Pencil,
  Utensils,
  UserCheck,
  ChefHat,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/shared";
import { PLATILLOS, TIPOS_SERVICIO } from "../data/ordersData";
import {
  showSuccessAlert,
  showUserErrorAlert,
  showCancelAlert,
} from "@/shared/services/alertService";
import { createOrder } from "../services/orderServices";
import { getUsers } from "@/features/users/services/userServices";
import { getDishes } from "@/features/dishes/services/dishServices";
import {
  resolveDishImage,
  normalizeCategoryLabel,
} from "@/features/dishes/utils/dishImages";

const CATEGORIES = [
  "Todo el Menú",
  "Entradas",
  "Platos Fuertes",
  "Ensaladas",
  "Postres",
  "Bebidas",
];

const TABLES = Array.from({ length: 12 }, (_, idx) => idx + 1);

const FALLBACK_WAITERS = [
  { value: "James Machado Hernández", label: "James Machado Hernández (Mesero)" },
  { value: "María Rodríguez López", label: "María Rodríguez López (Mesero)" },
];

export default function OrderForm() {
  const navigate = useNavigate();

  const [waiterOptions, setWaiterOptions] = useState(FALLBACK_WAITERS);
  const [catalogDishes, setCatalogDishes] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estado del Terminal POS del Mesero
  const [selectedTable, setSelectedTable] = useState(1);
  const [showTablePicker, setShowTablePicker] = useState(true);
  const [serviceType, setServiceType] = useState("En Sala");
  const [waiterId, setWaiterId] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  // Filtros del catálogo visual
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todo el Menú");

  // Carrito de comanda multi-platillo
  const [cart, setCart] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getUsers().catch(() => []),
      getDishes().catch(() => []),
    ])
      .then(([usersList, dishesList]) => {
        if (!mounted) return;

        if (Array.isArray(usersList) && usersList.length > 0) {
          // Filtra EXCLUSIVAMENTE usuarios activos con rol "Mesero"
          const onlyWaiters = usersList.filter(
            (u) =>
              Boolean(u.isActive ?? u.is_active ?? true) &&
              String(u.userRole || "").trim().toLowerCase() === "mesero"
          );

          const finalWaiters =
            onlyWaiters.length > 0
              ? onlyWaiters.map((u) => ({
                  value: u.userName.trim(),
                  label: `${u.userName.trim()} (Mesero)`,
                }))
              : FALLBACK_WAITERS;

          setWaiterOptions(finalWaiters);
          setWaiterId(finalWaiters[0]?.value || "");
        } else {
          setWaiterId(FALLBACK_WAITERS[0].value);
        }

        if (Array.isArray(dishesList) && dishesList.length > 0) {
          const activeDishes = dishesList
            .filter((d) => d.activo ?? d.isActive ?? true)
            .map((d, idx) => {
              const name = d.nombre || d.dishName || `Platillo ${idx + 1}`;
              const category = normalizeCategoryLabel(
                d.categoria || d.dishCategory || "Platos Fuertes"
              );
              const price = Number(d.precio ?? d.dishPrice ?? 0);
              return {
                id: d.id ?? idx + 1,
                name,
                category,
                price,
                description: d.descripcion || d.dishDescription || "",
                image: resolveDishImage({
                  id: d.id,
                  nombre: name,
                  categoria: category,
                  dishImageUrl: d.dishImageUrl || d.imagen,
                }),
              };
            });
          setCatalogDishes(activeDishes);
        } else {
          setCatalogDishes(
            PLATILLOS.map((p) => ({
              id: p.id,
              name: p.label,
              category: p.category,
              price: p.price,
              description: "",
              image: resolveDishImage({
                id: p.id,
                nombre: p.label,
                categoria: p.category,
              }),
            }))
          );
        }
      })
      .finally(() => {
        if (mounted) setLoadingCatalog(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Filtrado en vivo por búsqueda y por categoría
  const filteredDishes = useMemo(() => {
    return catalogDishes.filter((dish) => {
      const matchesCat =
        selectedCategory === "Todo el Menú" ||
        dish.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [catalogDishes, selectedCategory, searchQuery]);

  // Funciones del carrito POS
  const handleAddDish = (dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === dish.name);
      if (existing) {
        return prev.map((item) =>
          item.name === dish.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image: dish.image,
          quantity: 1,
          note: "",
        },
      ];
    });
  };

  const handleUpdateQty = (dishName, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === dishName
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (dishName) => {
    setCart((prev) => prev.filter((item) => item.name !== dishName));
  };

  const handleItemNoteChange = (dishName, note) => {
    setCart((prev) =>
      prev.map((item) =>
        item.name === dishName ? { ...item, note } : item
      )
    );
  };

  const getCartQty = (dishName) => {
    const found = cart.find((item) => item.name === dishName);
    return found ? found.quantity : 0;
  };

  // Totales de la comanda para información del mesero y cocina
  const totalUnits = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const subtotalAmount = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const taxIncluded = useMemo(
    () => Math.round(subtotalAmount * 0.08),
    [subtotalAmount]
  );

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!waiterId) {
      await showUserErrorAlert({
        title: "Selecciona el mesero",
        text: "Por favor indica el mesero responsable de atender la mesa.",
      });
      return;
    }

    if (cart.length === 0) {
      await showUserErrorAlert({
        title: "Comanda vacía",
        text: "Toca al menos un platillo del catálogo para enviarlo a cocina.",
      });
      return;
    }

    const formattedDishes = cart
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");

    const itemNotes = cart
      .filter((item) => item.note && item.note.trim() !== "")
      .map((item) => `${item.name}: ${item.note.trim()}`)
      .join(" | ");

    const metadataPrefix = `[${serviceType} | Total: $${subtotalAmount.toLocaleString(
      "es-CO"
    )}]`;

    const combinedObservations = [
      metadataPrefix,
      itemNotes,
      generalNotes.trim(),
    ]
      .filter(Boolean)
      .join(" — ");

    setSubmitting(true);

    try {
      // Toda orden tomada por el mesero nace en estado "En preparación" para cocina
      await createOrder({
        tableNumber: Number(selectedTable),
        waiterId,
        dishId: formattedDishes,
        quantity: totalUnits,
        estado: "En preparación",
        observations: combinedObservations,
        isActive: true,
      });

      await showSuccessAlert({
        title: "¡Comanda en preparación!",
        text: `Mesa #${selectedTable} enviada a cocina (${totalUnits} platillos). El cajero podrá cobrarla al finalizar el servicio.`,
        timer: 2200,
      });

      navigate("/dashboard/orderList");
    } catch (error) {
      console.error("Error al registrar orden:", error);
      await showUserErrorAlert({
        title: "Error al crear la orden",
        text: error.message || "No se pudo registrar la comanda.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar la comanda?",
      text: "Los platillos seleccionados en esta orden no se guardarán.",
    });

    if (result.isConfirmed) {
      navigate("/dashboard/orderList");
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-6 pb-12 space-y-5">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={handleCancel}
            className="!w-auto flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Terminal POS — Toma de Pedido (Mesero)
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
              Selecciona la mesa, agrega los platillos solicitados y envía la comanda a cocina
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTablePicker((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)] text-[var(--color-brand)] font-semibold text-sm shadow-lg hover:bg-[var(--color-brand)] hover:text-[var(--color-background-inverse)] transition cursor-pointer"
        >
          <LayoutGrid className="w-4 h-4" />
          Mesa actual: #{selectedTable} (
          {showTablePicker ? "Ocultar mesas" : "Cambiar mesa"})
        </button>
      </div>

      {/* Selector Visual de Mesas */}
      {showTablePicker && (
        <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/60 p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--color-brand)] font-[var(--font-heading)]">
              1. Selecciona la Mesa del Cliente
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Toca el número de mesa para asignarla a la comanda
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2.5">
            {TABLES.map((num) => {
              const isSelected = selectedTable === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedTable(num)}
                  className={`h-12 rounded-2xl font-bold text-sm flex flex-col items-center justify-center border transition cursor-pointer ${
                    isSelected
                      ? "bg-[var(--color-brand)] text-[var(--color-background-inverse)] border-[var(--color-brand)] shadow-lg scale-105"
                      : "bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] border-[var(--color-border)] hover:border-[var(--color-brand)]/60"
                  }`}
                >
                  <span className="text-[10px] opacity-75 leading-none">
                    Mesa
                  </span>
                  <span className="text-base leading-tight">{num}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Principal POS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================== IZQUIERDA: CATÁLOGO DE PLATILLOS ==================== */}
        <div className="lg:col-span-8 bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/50 p-4 sm:p-6 shadow-2xl space-y-5">
          <div className="space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[var(--color-brand)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar platillo, entrada, bebida o postre..."
                className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] placeholder:text-[var(--color-text-muted)] rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border transition cursor-pointer ${
                      active
                        ? "bg-[var(--color-brand)] text-[var(--color-background-inverse)] border-[var(--color-brand)] shadow-md"
                        : "bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] border-[var(--color-border)] hover:border-[var(--color-brand)]/50"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {loadingCatalog ? (
            <div className="py-12 text-center text-[var(--color-text-muted)]">
              Cargando menú gastronómico en vivo...
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="py-12 text-center text-[var(--color-text-muted)]">
              No se encontraron platillos con ese filtro.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[680px] overflow-y-auto pr-1">
              {filteredDishes.map((dish) => {
                const qtyInCart = getCartQty(dish.name);

                return (
                  <div
                    key={dish.id}
                    className={`group relative rounded-2xl bg-[var(--color-surface-dark)] border p-3.5 flex flex-col justify-between gap-3 transition ${
                      qtyInCart > 0
                        ? "border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/50 shadow-lg"
                        : "border-[var(--color-border)]/70 hover:border-[var(--color-brand)]/50"
                    }`}
                  >
                    <div>
                      <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/40 mb-3">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/75 text-[var(--color-brand)] backdrop-blur-sm border border-[var(--color-brand)]/30">
                          {dish.category}
                        </span>
                        {qtyInCart > 0 && (
                          <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-brand)] text-[var(--color-background-inverse)] shadow">
                            {qtyInCart}x en orden
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] line-clamp-1">
                        {dish.name}
                      </h3>
                      <p className="text-base font-extrabold text-[var(--color-brand)] mt-0.5">
                        ${dish.price.toLocaleString("es-CO")}
                      </p>
                    </div>

                    {qtyInCart === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleAddDish(dish)}
                        className="w-full h-11 rounded-xl bg-[var(--color-brand)]/15 hover:bg-[var(--color-brand)] text-[var(--color-brand)] hover:text-[var(--color-background-inverse)] border border-[var(--color-brand)]/40 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar a la orden
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-2 bg-[var(--color-background-inverse)] rounded-xl p-1 border border-[var(--color-brand)]/50">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(dish.name, -1)}
                          className="w-10 h-9 rounded-lg bg-[var(--color-surface-dark)] hover:bg-red-500/20 text-[var(--color-text-inverse)] flex items-center justify-center transition cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm text-[var(--color-brand)]">
                          {qtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(dish.name, 1)}
                          className="w-10 h-9 rounded-lg bg-[var(--color-brand)] text-[var(--color-background-inverse)] flex items-center justify-center transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================== DERECHA: COMANDA ACTUAL (MESERO ➔ COCINA) ==================== */}
        <form
          onSubmit={handleConfirmOrder}
          className="lg:col-span-4 bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)] p-5 sm:p-6 shadow-2xl flex flex-col gap-4 lg:sticky lg:top-6"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div>
              <h2 className="text-lg font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                Comanda Actual
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Estado inicial: <strong className="text-[var(--color-brand)]">En preparación</strong>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/40">
              Mesa #{selectedTable}
            </span>
          </div>

          {/* Tipo de servicio */}
          <div className="grid grid-cols-3 gap-2 bg-[var(--color-surface-dark)] p-1.5 rounded-2xl border border-[var(--color-border)]">
            {TIPOS_SERVICIO.map((tipo) => {
              const active = serviceType === tipo.value;
              return (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => setServiceType(tipo.value)}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    active
                      ? "bg-[var(--color-brand)] text-[var(--color-background-inverse)] shadow"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)]"
                  }`}
                >
                  {tipo.label}
                </button>
              );
            })}
          </div>

          {/* Mesero Responsable (SOLO ROL MESERO) */}
          <div className="bg-[var(--color-surface-dark)] rounded-2xl p-3.5 border border-[var(--color-border)]/70 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-text-muted)] flex items-center gap-1.5 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                Mesero responsable:
              </span>
              <button
                type="button"
                onClick={() => setShowTablePicker(true)}
                className="text-[var(--color-brand)] hover:underline font-semibold cursor-pointer"
              >
                Mesa #{selectedTable} (Cambiar →)
              </button>
            </div>

            <select
              value={waiterId}
              onChange={(e) => setWaiterId(e.target.value)}
              className="w-full bg-[var(--color-background-inverse)] border border-[var(--color-border)] text-[var(--color-text-inverse)] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            >
              <option value="">Selecciona el mesero...</option>
              {waiterOptions.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de Platillos en el Carrito */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-dark)]/40 space-y-2">
                <Utensils className="w-8 h-8 text-[var(--color-brand)]/60 mx-auto" />
                <p className="text-sm font-medium text-[var(--color-text-inverse)]">
                  Aún no hay platillos en la comanda
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Toca cualquier platillo del catálogo izquierdo para agregarlo a la Mesa #{selectedTable}.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/80 p-3 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[var(--color-brand)]/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-inverse)] truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          ${item.price.toLocaleString("es-CO")} c/u
                        </p>
                        {item.note && (
                          <p className="text-[11px] text-[var(--color-brand)] italic mt-0.5">
                            Nota: {item.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-[var(--color-brand)] shrink-0">
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2 bg-[var(--color-background-inverse)] rounded-xl px-2 py-1 border border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.name, -1)}
                        className="w-8 h-8 rounded-lg bg-[var(--color-surface-dark)] hover:bg-white/10 text-[var(--color-text-inverse)] flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-[var(--color-text-inverse)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.name, 1)}
                        className="w-8 h-8 rounded-lg bg-[var(--color-brand)] text-[var(--color-background-inverse)] flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingNoteId(
                            editingNoteId === item.name ? null : item.name
                          )
                        }
                        title="Agregar nota para cocina en este plato"
                        className="w-9 h-9 rounded-xl bg-[var(--color-background-inverse)] border border-[var(--color-border)] hover:border-[var(--color-brand)] text-[var(--color-brand)] flex items-center justify-center cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.name)}
                        title="Eliminar platillo de la comanda"
                        className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {editingNoteId === item.name && (
                    <input
                      type="text"
                      value={item.note}
                      onChange={(e) =>
                        handleItemNoteChange(item.name, e.target.value)
                      }
                      placeholder="Ej: Sin cebolla, término 3/4, salsa aparte..."
                      className="w-full bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/50 rounded-xl px-3 py-2 text-xs text-[var(--color-text-inverse)] focus:outline-none"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Observaciones generales para Cocina */}
          <div>
            <input
              type="text"
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Observación general para cocina (ej: Alergia a maní, servir entradas primero...)"
              className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] placeholder:text-[var(--color-text-muted)] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
          </div>

          {/* Resumen de Cuenta para cuando pase a Caja */}
          <div className="bg-[var(--color-surface-dark)] rounded-2xl p-4 border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <span>Subtotal ({totalUnits} platillos)</span>
              <span>
                ${(subtotalAmount - taxIncluded).toLocaleString("es-CO")}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <span>Impoconsumo (8% incl.)</span>
              <span>${taxIncluded.toLocaleString("es-CO")}</span>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] flex items-baseline justify-between">
              <span className="text-sm font-bold text-[var(--color-text-inverse)]">
                Total Cuenta Mesa #{selectedTable}
              </span>
              <span className="text-2xl font-extrabold font-[var(--font-heading)] text-[var(--color-brand)]">
                ${subtotalAmount.toLocaleString("es-CO")}
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col gap-2.5 pt-1">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              className="w-full !py-3.5 text-base font-bold shadow-xl"
            >
              <ChefHat className="w-5 h-5" />
              {submitting
                ? "Enviando a cocina..."
                : `Enviar a Cocina — $${subtotalAmount.toLocaleString("es-CO")}`}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              disabled={submitting}
              className="w-full"
            >
              Cancelar comanda
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}