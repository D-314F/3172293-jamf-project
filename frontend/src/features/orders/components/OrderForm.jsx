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
  ShoppingBag,
  Bike,
  UserCheck,
  ChefHat,
  LayoutGrid,
} from "lucide-react";
import { Button, Card } from "@/shared";
import { PLATILLOS, TIPOS_SERVICIO } from "../data/ordersData";
import {
  showSuccessAlert,
  showUserErrorAlert,
  showCancelAlert,
  showConfirmDeleteAlert,
} from "@/shared/services/alertService";
import { createOrder, getOrders } from "../services/orderServices";
import { getUsers } from "@/features/users/services/userServices";
import { getProfile } from "@/features/auth/services/authService";
import { getDishes } from "@/features/dishes/services/dishServices";
import { getDishCategories } from "@/services/selectService";
import {
  resolveDishImage,
  normalizeCategoryLabel,
} from "@/features/dishes/utils/dishImages";

const TABLES = Array.from({ length: 12 }, (_, idx) => idx + 1);

export default function OrderForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState(["Todo el Menú"]);
  const [waiterOptions, setWaiterOptions] = useState([]);
  const [catalogDishes, setCatalogDishes] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Lista de mesas que tienen comanda activa no pagada
  const [occupiedTables, setOccupiedTables] = useState([]);

  // Estado del Terminal POS del Mesero
  const [selectedTable, setSelectedTable] = useState(1);
  const [showTablePicker, setShowTablePicker] = useState(true);
  const [serviceType, setServiceType] = useState("En Sala");
  const [waiterId, setWaiterId] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  // Filtros del catálogo visual y densidad de tarjetas en Tablet (3 o 4 por fila)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todo el Menú");
  const [tabletCols, setTabletCols] = useState(3);

  // Carrito de comanda multi-platillo
  const [cart, setCart] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getUsers().catch(() => []),
      getDishes().catch(() => []),
      getOrders().catch(() => []),
      getProfile().catch(() => null),
      getDishCategories().catch(() => []),
    ])
      .then(([usersList, dishesList, ordersList, profileData, dishCategoriesList]) => {
        if (!mounted) return;

        // 0. Cargar categorías desde el catálogo JSON centralizado
        if (Array.isArray(dishCategoriesList) && dishCategoriesList.length > 0) {
          setCategories([
            "Todo el Menú",
            ...dishCategoriesList.map((c) => c.label),
          ]);
        }

        // 1. Filtrar mesas ocupadas (activas y que no estén Pagadas ni Canceladas)
        if (Array.isArray(ordersList)) {
          const occupied = ordersList
            .filter((ord) => {
              const status = String(ord.estado || ord.orderStatus || "").trim().toLowerCase();
              const isActive = ord.isActive ?? ord.is_active ?? true;
              return isActive && status !== "pagada" && status !== "cancelado" && status !== "cancelada";
            })
            .map((ord) => Number(ord.mesa ?? ord.tableNumber))
            .filter(Boolean);

          setOccupiedTables(occupied);

          // Si la mesa actual (1) está ocupada, preseleccionar la primera mesa libre
          const firstFree = TABLES.find((t) => !occupied.includes(t));
          if (firstFree) {
            setSelectedTable(firstFree);
          }
        }

        // 2. Cargar meseros desde la base de datos y autoseleccionar al usuario que inició sesión (Obs 1.8 / 2.4)
        const loggedUserName = String(profileData?.userName || "").trim();
        const loggedUserRole = String(
          profileData?.userType || profileData?.userRole || "Sesión actual"
        ).trim();

        let finalWaiters = [];

        if (Array.isArray(usersList) && usersList.length > 0) {
          const onlyWaiters = usersList.filter(
            (u) =>
              Boolean(u.isActive ?? u.is_active ?? true) &&
              ["mesero", "administrador", "cajero"].includes(
                String(u.userRole || u.userType || "").trim().toLowerCase()
              )
          );

          if (onlyWaiters.length > 0) {
            finalWaiters = onlyWaiters.map((u) => ({
              value: u.userName.trim(),
              label: `${u.userName.trim()} (${u.userRole || u.userType || "Mesero"})`,
            }));
          }
        }

        if (
          loggedUserName &&
          !finalWaiters.some((w) => w.value === loggedUserName)
        ) {
          finalWaiters = [
            {
              value: loggedUserName,
              label: `${loggedUserName} (${loggedUserRole})`,
            },
            ...finalWaiters,
          ];
        }

        setWaiterOptions(finalWaiters);
        if (loggedUserName) {
          setWaiterId(loggedUserName);
        } else {
          setWaiterId(finalWaiters[0]?.value || "");
        }

        // 3. Cargar platillos
        if (Array.isArray(dishesList) && dishesList.length > 0) {
          const activeDishes = dishesList
            .filter((d) => d.activo ?? d.isActive ?? true)
            .map((d, idx) => {
              const name = d.nombre || d.dishName || `Platillo ${idx + 1}`;
              const category = normalizeCategoryLabel(
                d.categoria || d.dishCategory || "Platos Fuertes"
              );
              const price = Number(d.precio ?? d.dishPrice ?? 0);
              const stock = Number(d.effectiveStock ?? d.stock ?? d.dishStock ?? 0);
              return {
                id: d.id ?? idx + 1,
                name,
                category,
                price,
                stock,
                inventoryName: d.inventoryName || null,
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

  // Funciones del carrito POS con validación estricta de stock
  const handleAddDish = (dish) => {
    const availableStock = Number(dish.stock ?? 0);
    if (availableStock <= 0) {
      showUserErrorAlert({
        title: "Platillo agotado",
        text: `No hay stock disponible de "${dish.name}" en cocina o inventario.`,
      });
      return;
    }

    const currentQty = getCartQty(dish.name);
    if (currentQty + 1 > availableStock) {
      showUserErrorAlert({
        title: "Stock insuficiente",
        text: `Solo quedan ${availableStock} unidad(es) disponibles de "${dish.name}".`,
      });
      return;
    }

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
          stock: availableStock,
          image: dish.image,
          quantity: 1,
          note: "",
        },
      ];
    });
  };

  const handleRemoveItem = async (dishName) => {
    const result = await showConfirmDeleteAlert({
      title: "¿Quitar platillo de la comanda?",
      text: `¿Estás seguro de eliminar "${dishName}" de la orden actual?`,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "No, conservar",
    });

    if (!result.isConfirmed) return;
    setCart((prev) => prev.filter((item) => item.name !== dishName));
  };

  const handleUpdateQty = async (dishName, delta) => {
    const currentQty = getCartQty(dishName);

    if (delta < 0 && currentQty + delta <= 0) {
      await handleRemoveItem(dishName);
      return;
    }

    if (delta > 0) {
      const catalogItem = catalogDishes.find((d) => d.name === dishName);
      const maxStock = Number(catalogItem?.stock ?? 0);
      if (catalogItem && currentQty + delta > maxStock) {
        showUserErrorAlert({
          title: "Stock insuficiente",
          text: `Solo hay ${maxStock} unidad(es) disponibles de "${dishName}". No puedes agregar más de lo que existe en stock.`,
        });
        return;
      }
    }

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

    // 🔒 Doble verificación de mesa ocupada antes de guardar
    if (occupiedTables.includes(Number(selectedTable))) {
      await showUserErrorAlert({
        title: "Mesa Ocupada",
        text: `La Mesa #${selectedTable} ya tiene una comanda activa y no puede recibir una nueva orden hasta que esté Pagada.`,
      });
      return;
    }

    setSubmitting(true);

    try {
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
            <p className="text-medium text-[var(--color-text-muted)]">
              Selecciona la mesa, agrega los platillos solicitados y envía la comanda a cocina
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTablePicker((prev) => !prev)}
          className="inline-flex items-center gap-2 min-h-[48px] px-4 py-2.5 rounded-2xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)] text-[var(--color-brand)] font-semibold text-medium shadow-lg hover:bg-[var(--color-brand)] hover:text-[var(--color-background-inverse)] transition cursor-pointer"
        >
          <LayoutGrid className="w-4 h-4" />
          Mesa actual: #{selectedTable} (
          {showTablePicker ? "Ocultar mesas" : "Cambiar mesa"})
        </button>
      </div>

      {/* Selector Visual de Mesas */}
      {showTablePicker && (
        <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/60 p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-caption uppercase tracking-wider font-bold text-[var(--color-brand)] font-[var(--font-heading)]">
              1. Selecciona la Mesa del Cliente
            </span>
            <span className="text-medium text-[var(--color-text-muted)]">
              Toca el número de mesa para asignarla a la comanda
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {TABLES.map((num) => {
              const isSelected = selectedTable === num;
              const isOccupied = occupiedTables.includes(num);

              return (
                <button
                  key={num}
                  type="button"
                  disabled={isOccupied}
                  onClick={() => {
                    if (isOccupied) return;
                    setSelectedTable(num);
                  }}
                  title={isOccupied ? `Mesa #${num} ocupada hasta ser Pagada` : `Mesa #${num} disponible`}
                  className={`min-h-[48px] h-12 rounded-2xl font-bold text-medium flex flex-col items-center justify-center border transition ${
                    isOccupied
                      ? "opacity-35 cursor-not-allowed bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] border-[var(--color-border)]"
                      : isSelected
                      ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] border-[var(--color-brand)] shadow-lg scale-105 cursor-pointer"
                      : "bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] border-[var(--color-border)] hover:border-[var(--color-brand)]/60 cursor-pointer"
                  }`}
                >
                  <span className="text-caption opacity-75 leading-none">
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
        <div className="lg:col-span-8 bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/50 p-3.5 sm:p-5 shadow-2xl space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <div className="relative flex-1 min-w-[200px] min-h-[48px] flex items-center">
                <Search className="w-5 h-5 text-[var(--color-brand)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar platillo, entrada, bebida o postre..."
                  className="w-full h-12 bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] placeholder:text-[var(--color-text-muted)] rounded-2xl pl-11 pr-4 text-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
                />
              </div>

              {/* Selector de densidad de Cards en Tablet (3 o 4 por fila) */}
              <div
                className="inline-flex items-center bg-[var(--color-surface-dark)] p-1 rounded-2xl border border-[var(--color-border)] shrink-0"
                title="Elegir cantidad de tarjetas por fila en tablet"
              >
                <span className="px-2.5 text-caption text-[var(--color-text-muted)] hidden sm:inline-flex items-center gap-1">
                  <LayoutGrid className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                  Vista:
                </span>
                {[3, 4].map((cols) => {
                  const active = tabletCols === cols;
                  return (
                    <button
                      key={cols}
                      type="button"
                      onClick={() => setTabletCols(cols)}
                      className={`min-h-[40px] px-3 py-1.5 rounded-xl text-caption font-bold transition cursor-pointer ${
                        active
                          ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] shadow"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)]"
                      }`}
                    >
                      {cols} cards
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {categories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-small sm:text-medium font-semibold whitespace-nowrap border transition cursor-pointer ${
                      active
                        ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] border-[var(--color-brand)] shadow-md"
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
            <div
              className={`grid grid-cols-2 ${
                tabletCols === 4
                  ? "sm:grid-cols-3 md:grid-cols-4"
                  : "sm:grid-cols-3 md:grid-cols-3"
              } gap-2.5 max-h-[680px] overflow-y-auto pr-1`}
            >
              {filteredDishes.map((dish) => {
                const qtyInCart = getCartQty(dish.name);
                const statusBadge =
                  dish.stock <= 0
                    ? { label: "Agotado (0)", tone: "error" }
                    : qtyInCart > 0
                    ? { label: `${qtyInCart}x`, tone: "brand" }
                    : { label: `Stock: ${dish.stock}`, tone: "neutral" };

                return (
                  <Card
                    key={dish.id}
                    surface="dark"
                    compact={true}
                    imageHeightClass={
                      tabletCols === 4 ? "h-20 sm:h-24" : "h-24 sm:h-28"
                    }
                    highlighted={qtyInCart > 0}
                    title={dish.name}
                    imageUrl={dish.image}
                    price={dish.price}
                    categoryBadge={dish.category}
                    statusBadge={statusBadge}
                    metaRight={`Disp: ${dish.stock}`}
                  >
                    {qtyInCart === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleAddDish(dish)}
                        className={`w-full min-h-[44px] px-2 rounded-xl border font-bold text-caption sm:text-small flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          dish.stock <= 0
                            ? "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/40 hover:bg-[var(--color-error)]/20"
                            : "bg-[var(--color-brand)]/15 hover:bg-[var(--color-brand)] text-[var(--color-brand)] hover:text-[var(--color-text-primary)] border-[var(--color-brand)]/40"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {dish.stock <= 0 ? "Agotado" : "Agregar"}
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-1 bg-[var(--color-background-inverse)] rounded-xl p-1 border border-[var(--color-brand)]/50">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(dish.name, -1)}
                          className="min-w-[40px] min-h-[40px] rounded-lg bg-[var(--color-surface-dark)] hover:bg-[var(--color-error)]/20 text-[var(--color-text-inverse)] flex items-center justify-center transition cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-medium text-[var(--color-brand)]">
                          {qtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(dish.name, 1)}
                          className="min-w-[40px] min-h-[40px] rounded-lg bg-[var(--color-brand)] text-[var(--color-text-primary)] flex items-center justify-center transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================== DERECHA: COMANDA ACTUAL (MESERO ➔ COCINA) ==================== */}
        <form
          onSubmit={handleConfirmOrder}
          className="lg:col-span-4 bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)] p-4 sm:p-5 shadow-2xl flex flex-col gap-3 lg:sticky lg:top-6"
        >
          {/* Cabecera compacta unificada: Título + Iconos de Servicio en la mitad + Mesa # */}
          <div className="bg-[var(--color-surface-dark)] rounded-2xl p-3 border border-[var(--color-border)]/80 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] leading-tight">
                  Comanda Actual
                </h2>
                <p className="text-caption text-[var(--color-text-muted)]">
                  Estado: <strong className="text-[var(--color-brand)]">En preparación</strong>
                </p>
              </div>

              {/* Iconos de modalidad (En Sala / Para Llevar / Domicilio) en la mitad */}
              <div className="inline-flex items-center gap-1 bg-[var(--color-background-inverse)] p-1 rounded-xl border border-[var(--color-border)]">
                {TIPOS_SERVICIO.map((tipo) => {
                  const active = serviceType === tipo.value;
                  const ServiceIcon =
                    tipo.value === "Para Llevar"
                      ? ShoppingBag
                      : tipo.value === "Domicilio"
                      ? Bike
                      : Utensils;
                  const shortLabel =
                    tipo.value === "En Sala"
                      ? "Sala"
                      : tipo.value === "Para Llevar"
                      ? "Llevar"
                      : "Domic.";
                  return (
                    <button
                      key={tipo.value}
                      type="button"
                      onClick={() => setServiceType(tipo.value)}
                      title={tipo.label}
                      className={`min-h-[38px] px-2.5 py-1 rounded-lg text-caption font-bold inline-flex items-center gap-1 transition cursor-pointer ${
                        active
                          ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] shadow"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)]"
                      }`}
                    >
                      <ServiceIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowTablePicker((prev) => !prev)}
                className="px-2.5 py-1 rounded-full text-caption font-bold bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/40 hover:bg-[var(--color-brand)]/25 transition cursor-pointer shrink-0"
              >
                Mesa #{selectedTable}
              </button>
            </div>

            {/* Mesero encargado unificado en una sola fila compacta */}
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]/50">
              <span className="text-caption text-[var(--color-text-muted)] inline-flex items-center gap-1 font-medium shrink-0">
                <UserCheck className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                Mesero:
              </span>

              <div className="relative flex-1 flex items-center min-w-0">
                <select
                  value={waiterId}
                  onChange={(e) => setWaiterId(e.target.value)}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                  className="w-full min-h-[40px] bg-[var(--color-background-inverse)] border border-[var(--color-border)] text-[var(--color-text-inverse)] rounded-xl pl-3 pr-8 py-1.5 text-small font-medium appearance-none whitespace-nowrap truncate cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                >
                  <option value="">Selecciona el mesero...</option>
                  {waiterOptions.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 flex items-center justify-center text-[var(--color-brand)]">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Platillos en el Carrito */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-dark)]/40 space-y-2">
                <Utensils className="w-8 h-8 text-[var(--color-brand)]/60 mx-auto" />
                <p className="text-medium font-medium text-[var(--color-text-inverse)]">
                  Aún no hay platillos en la comanda
                </p>
                <p className="text-medium text-[var(--color-text-muted)]">
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
                        <h4 className="text-medium font-bold text-[var(--color-text-inverse)] truncate">
                          {item.name}
                        </h4>
                        <p className="text-medium text-[var(--color-text-muted)]">
                          ${item.price.toLocaleString("es-CO")} c/u
                        </p>
                        {item.note && (
                          <p className="text-caption text-[var(--color-brand)] italic mt-0.5">
                            Nota: {item.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-medium font-bold text-[var(--color-brand)] shrink-0">
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-4 bg-[var(--color-background-inverse)] rounded-xl p-1 border border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.name, -1)}
                        className="min-w-[48px] min-h-[48px] rounded-lg bg-[var(--color-surface-dark)] hover:bg-white/10 text-[var(--color-text-inverse)] flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-medium text-[var(--color-text-inverse)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.name, 1)}
                        className="min-w-[48px] min-h-[48px] rounded-lg bg-[var(--color-brand)] text-[var(--color-text-primary)] flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingNoteId(
                            editingNoteId === item.name ? null : item.name
                          )
                        }
                        title="Agregar nota para cocina en este plato"
                        className="min-w-[48px] min-h-[48px] rounded-xl bg-[var(--color-background-inverse)] border border-[var(--color-border)] hover:border-[var(--color-brand)] text-[var(--color-brand)] flex items-center justify-center cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.name)}
                        title="Eliminar platillo de la comanda"
                        className="min-w-[48px] min-h-[48px] rounded-xl bg-[var(--color-error)]/15 border border-[var(--color-error)]/30 hover:bg-[var(--color-error)]/25 text-[var(--color-error)] flex items-center justify-center cursor-pointer"
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
                      className="w-full min-h-[48px] bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/50 rounded-xl px-3 py-2 text-medium text-[var(--color-text-inverse)] focus:outline-none"
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
              className="w-full min-h-[48px] bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] placeholder:text-[var(--color-text-muted)] rounded-xl px-3.5 py-2.5 text-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
          </div>

          {/* Resumen de Cuenta para cuando pase a Caja */}
          <div className="bg-[var(--color-surface-dark)] rounded-2xl p-4 border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-medium text-[var(--color-text-muted)]">
              <span>{`Subtotal (${totalUnits} platillos)`}</span>
              <span>
                {`$${(subtotalAmount - taxIncluded).toLocaleString("es-CO")}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-medium text-[var(--color-text-muted)]">
              <span>Impoconsumo (8% incl.)</span>
              <span>{`$${taxIncluded.toLocaleString("es-CO")}`}</span>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] flex items-baseline justify-between">
              <span className="text-sm font-bold text-[var(--color-text-inverse)]">
                {`Total Cuenta Mesa #${selectedTable}`}
              </span>
              <span className="text-2xl font-extrabold font-[var(--font-heading)] text-[var(--color-brand)]">
                {`$${subtotalAmount.toLocaleString("es-CO")}`}
              </span>
            </div>
          </div>
          
          {/* Botones de Acción (gap-4 = 16px entre botones, pt-6 = 24px desde el resumen) */}
          <div className="flex flex-col gap-4 pt-6">
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