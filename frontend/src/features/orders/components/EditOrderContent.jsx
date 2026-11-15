// Reemplaza todo: frontend/src/features/orders/components/EditOrderContent.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  UtensilsCrossed,
  ClipboardList,
  Trash2,
} from "lucide-react";
import { Select, Input, Button, Checkbox, IconButton } from "@/shared";
import { ESTADOS_ORDEN } from "../data/ordersData";
import { orderSchema } from "../schemas/orderSchema";
import { getUsers } from "@/features/users/services/userServices";
import { getDishes } from "@/features/dishes/services/dishServices";
import {
  showSuccessAlert,
  showCancelAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";

export default function EditOrderContent({
  initialFormData = {},
  onSubmit,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [waiterOptions, setWaiterOptions] = useState([]);
  const [menuDishes, setMenuDishes] = useState([]);
  const [extraDishName, setExtraDishName] = useState("");
  const [extraDishQty, setExtraDishQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function loadOptions() {
      try {
        const [usersList, dishesList] = await Promise.all([
          getUsers().catch(() => []),
          getDishes().catch(() => []),
        ]);
        if (!mounted) return;

        const waiters = (Array.isArray(usersList) ? usersList : [])
          .filter(
            (u) =>
              Boolean(u.isActive ?? u.is_active ?? true) &&
              String(u.userRole || "").trim().toLowerCase() === "mesero"
          )
          .map((u) => {
            const name = String(u.userName || "").trim();
            return {
              value: name,
              label: `${name} (Mesero)`,
            };
          });

        setWaiterOptions(waiters);

        const activeDishes = (Array.isArray(dishesList) ? dishesList : [])
          .filter((d) => d.activo ?? d.isActive ?? true)
          .map((d, idx) => ({
            id: d.id ?? idx + 1,
            name: d.nombre || d.dishName || d.name || `Platillo ${idx + 1}`,
            price: Number(d.precio ?? d.dishPrice ?? d.price ?? 0),
          }));

        setMenuDishes(activeDishes);
      } catch (err) {
        console.error("Error cargando meseros y platillos:", err);
      }
    }
    loadOptions();
    return () => {
      mounted = false;
    };
  }, []);

  // Lista desglosada de platillos actuales en la comanda
  const dishItems = String(formData?.dishId || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const recalculateQuantity = (itemsArray) => {
    return itemsArray.reduce((acc, itemStr) => {
      const match = itemStr.match(/^(\d+)x\s+/i);
      return acc + (match ? Number(match[1]) : 1);
    }, 0);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAppendDish = () => {
    if (!extraDishName) return;
    const qty = Math.max(1, Number(extraDishQty) || 1);
    const newEntry = `${qty}x ${extraDishName}`;
    const updatedList = [...dishItems, newEntry];

    setFormData((prev) => ({
      ...prev,
      dishId: updatedList.join(", "),
      quantity: recalculateQuantity(updatedList),
    }));
    setExtraDishName("");
    setExtraDishQty(1);
    if (errors.dishId) {
      setErrors((prev) => ({ ...prev, dishId: "" }));
    }
  };

  const handleRemoveDishItem = (indexToRemove) => {
    const updatedList = dishItems.filter((_, idx) => idx !== indexToRemove);
    setFormData((prev) => ({
      ...prev,
      dishId: updatedList.join(", "),
      quantity: Math.max(1, recalculateQuantity(updatedList)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dishItems.length === 0) {
      setErrors((prev) => ({
        ...prev,
        dishId: "La orden debe tener al menos un platillo en la lista",
      }));
      await showUserErrorAlert({
        title: "Comanda sin platillos",
        text: "Agrega al menos un platillo a la orden antes de guardar.",
      });
      return;
    }

    const dataToValidate = {
      ...formData,
      dishId: dishItems.join(", "),
      quantity: recalculateQuantity(dishItems),
    };

    const result = orderSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (!fieldErrors[fieldName]) fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor revisa los datos de la orden antes de guardar.",
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(dataToValidate);
      }

      await showSuccessAlert({
        title: "Orden actualizada",
        text: "Los cambios de la orden se guardaron correctamente.",
        timer: 2000,
      });

      navigate("/dashboard/orderList");
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      await showUserErrorAlert({
        title: "Error al actualizar",
        text: "No se pudieron guardar los cambios en el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios realizados no se guardarán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  const ensuredWaiters =
    formData?.waiterId &&
    !waiterOptions.some((w) => w.value === formData.waiterId)
      ? [
          {
            value: formData.waiterId,
            label: `${formData.waiterId} (Asignado)`,
          },
          ...waiterOptions,
        ]
      : waiterOptions;

  const extraDishOptions = menuDishes.map((d) => ({
    value: d.name,
    label: `${d.name} ($${d.price.toLocaleString("es-CO")})`,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
      </div>

      {/* Formulario 3 Columnas usando exclusivamente componentes de @/shared */}
      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start border border-[var(--color-brand)]/60 shadow-2xl">
          {/* Encabezado */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                Editar Orden #{formData?.id}
              </h1>
              <p className="text-small text-[var(--color-text-muted)]">
                Ajusta la mesa, el mesero o modifica los platillos de la comanda abierta
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-full text-small font-[var(--font-heading)] bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/40 self-start sm:self-auto">
              Estado: {formData?.estado || "Pendiente"}
            </span>
          </div>

          {/* Columna 1: Datos de Mesa y Mesero */}
          <div className="flex flex-col gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60">
            <Input
              label="Número de mesa"
              type="text"
              name="tableNumber"
              value={formData?.tableNumber || ""}
              onChange={handleChange}
              placeholder="Ej. 5"
              error={errors.tableNumber}
            />

            <Select
              label="Mesero responsable"
              name="waiterId"
              value={formData?.waiterId || ""}
              onChange={handleChange}
              options={ensuredWaiters}
              error={errors.waiterId}
            />

            <Select
              label="Estado de la Orden"
              name="estado"
              value={formData?.estado || ""}
              onChange={handleChange}
              options={ESTADOS_ORDEN.map((estado) => ({
                value:
                  typeof estado === "object"
                    ? estado.id || estado.value
                    : estado,
                label:
                  typeof estado === "object"
                    ? estado.label || estado.nombre
                    : estado,
              }))}
              error={errors.estado}
            />
          </div>

          {/* Columna 2: Agregar Platillo Adicional + Observaciones */}
          <div className="flex flex-col gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60">
            <div className="p-4 rounded-xl bg-[var(--color-background-inverse)] border border-[var(--color-border)]/70 space-y-3">
              <p className="text-small font-semibold text-[var(--color-brand)] flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4" />
                ¿Pidieron otro platillo o bebida?
              </p>

              <Select
                label="Platillo adicional"
                name="extraDishName"
                value={extraDishName}
                onChange={(e) => setExtraDishName(e.target.value)}
                options={extraDishOptions}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <Input
                  label="Cant."
                  type="number"
                  name="extraDishQty"
                  min={1}
                  max={20}
                  value={extraDishQty}
                  onChange={(e) => setExtraDishQty(e.target.value)}
                />

                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleAppendDish}
                    disabled={!extraDishName}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4" />
                    Anexar
                  </Button>
                </div>
              </div>
            </div>

            <Input
              label="Observaciones de cocina / servicio"
              type="text"
              name="observations"
              value={formData?.observations || ""}
              onChange={handleChange}
              placeholder="Ej: Sin sal, salsa por separado..."
              error={errors.observations}
            />
          </div>

          {/* Columna 3: Lista Vertical Expansible de Platillos con Basurita + Botones */}
          <div className="flex flex-col items-center justify-between gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60 w-full h-full">
            <div className="w-full flex flex-col p-4 rounded-xl bg-[var(--color-background-inverse)] border border-[var(--color-border)]/60 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--color-border)]/50 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/40 flex items-center justify-center text-[var(--color-brand)] shrink-0">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-body font-bold leading-tight">
                      Mesa #{formData?.tableNumber || "S/N"}
                    </p>
                    <p className="text-caption text-[var(--color-text-muted)]">
                      {dishItems.length} ítem(s) en la comanda
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista vertical que crece hacia abajo con botón de eliminar por plato */}
              {dishItems.length > 0 ? (
                <div className="flex flex-col gap-2 w-full">
                  {dishItems.map((item, idx) => (
                    <div
                      key={`${item}-${idx}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/60"
                    >
                      <span className="text-small text-[var(--color-text-inverse)] break-words text-left flex-1">
                        {item}
                      </span>

                      <IconButton
                        variant="danger"
                        size="sm"
                        ariaLabel={`Quitar ${item} de la orden`}
                        onClick={() => handleRemoveDishItem(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-small text-[var(--color-brand-soft)] text-center py-3">
                  {errors.dishId || "No hay platillos en la orden. Anexa al menos uno."}
                </p>
              )}
            </div>

            <div className="w-full pt-1">
              <Checkbox
                id="isActive"
                name="isActive"
                label="Estado del registro (Activo)"
                checked={Boolean(formData?.isActive)}
                onChange={handleChange}
              />
            </div>

            <div className="w-full flex flex-col gap-3 pt-3 border-t border-[var(--color-border)]/60">
              <Button
                variant="secondary"
                type="button"
                disabled={loading}
                onClick={handleCancel}
                className="w-full"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                <Save className="w-4 h-4" />
                {loading ? "Guardando..." : "Aplicar Cambios"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}