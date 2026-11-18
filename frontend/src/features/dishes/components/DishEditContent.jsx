import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Camera } from "lucide-react";
import { Select, Input, Button, Checkbox } from "@/shared";
import dishCategories from "../../../data/selects/dishCategories.json";
import { getInventory } from "@/features/inventory/services/inventoryServices";
import { dishSchema } from "../schemas/dishSchema";
import { resolveDishImage } from "../utils/dishImages";
import {
  showSuccessAlert,
  showCancelAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";

export default function DishEditContent({
  formData = {},
  setFormData,
  onSubmit,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    getInventory()
      .then((list) => setInventoryItems(Array.isArray(list) ? list : []))
      .catch(() => setInventoryItems([]));
  }, []);

  const inventoryOptions = inventoryItems.map((item) => {
    const qty = Number(item.quantity ?? item.cantidad ?? 0);
    const active = item.isActive !== false && item.status !== "Agotado" && qty > 0;
    return {
      value: String(item.id),
      label: `${item.name || item.nombre} (${active ? `Stock: ${qty} uds.` : "Agotado - 0 uds."})`,
    };
  });

  const previewUrl = useMemo(() => {
    if (
      Array.isArray(formData.dishImage) &&
      formData.dishImage.length > 0 &&
      formData.dishImage[0] instanceof File
    ) {
      return URL.createObjectURL(formData.dishImage[0]);
    }
    return resolveDishImage({
      id: formData.id,
      nombre: formData.dishName,
      categoria: formData.dishCategory,
      dishImageUrl: formData.dishImageUrl,
    });
  }, [
    formData.id,
    formData.dishImage,
    formData.dishName,
    formData.dishCategory,
    formData.dishImageUrl,
  ]);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, dishImage: files }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adaptedData = {
      nombre: formData.dishName,
      precio: formData.dishPrice,
      categoria: formData.dishCategory || "",
      descripcion: formData.dishDescription,
      inventoryId: String(formData.inventoryId ?? ""),
      dishStock: String(formData.dishStock ?? "0"),
    };

    const result = dishSchema.safeParse(adaptedData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName === "nombre") fieldErrors.dishName = issue.message;
        if (fieldName === "precio") fieldErrors.dishPrice = issue.message;
        if (fieldName === "categoria") fieldErrors.dishCategory = issue.message;
        if (fieldName === "descripcion")
          fieldErrors.dishDescription = issue.message;
        if (fieldName === "dishStock") fieldErrors.dishStock = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor, completa correctamente los campos del platillo.",
      });
      return;
    }

    const requestedStock = Number(result.data.dishStock || 0);
    if (result.data.inventoryId) {
      const linkedInv = inventoryItems.find(
        (item) => String(item.id) === String(result.data.inventoryId)
      );
      if (linkedInv) {
        const invQty = Number(linkedInv.quantity ?? linkedInv.cantidad ?? 0);
        const invActive =
          linkedInv.isActive !== false && linkedInv.status !== "Agotado";

        if (formData.isActive && (!invActive || invQty <= 0)) {
          setErrors({
            inventoryId: "Insumo agotado o inactivo en inventario",
          });
          await showUserErrorAlert({
            title: "Sin existencias en inventario",
            text: `No puedes habilitar "${formData.dishName}" con el insumo "${linkedInv.name || linkedInv.nombre}" agotado (Stock: ${invQty}).`,
          });
          return;
        }

        if (requestedStock > invQty) {
          setErrors({
            dishStock: `Máximo ${invQty} porciones según inventario`,
          });
          await showUserErrorAlert({
            title: "Stock insuficiente en inventario",
            text: `Asignaste ${requestedStock} porciones, pero de "${linkedInv.name || linkedInv.nombre}" solo hay ${invQty} unidad(es) en inventario.`,
          });
          return;
        }
      }
    }

    setErrors({});
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }

      await showSuccessAlert({
        title: "Platillo actualizado",
        text: "Los cambios se guardaron correctamente.",
        timer: 2000,
      });

      navigate(-1);
    } catch (error) {
      console.error(error);
      await showUserErrorAlert({
        title: "Error al actualizar",
        text: error.message || "No se pudieron guardar los cambios del platillo.",
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

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start border border-[var(--color-brand)]/60 shadow-2xl">
        {/* Encabezado */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-1 border-b border-[var(--color-border)] pb-4">
          <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Editar Platillo del Menú
          </h1>
          <p className="text-medium text-[var(--color-text-muted)]">
            Actualiza nombre, categoría gastronómica, stock vinculado a inventario y fotografía
          </p>
        </div>

        {/* Columnas 1 y 2: Datos del platillo */}
        <div className="md:col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60">
          <Input
            label="Nombre del platillo"
            type="text"
            name="dishName"
            value={formData?.dishName || ""}
            onChange={handleChange}
            placeholder="Ingresa el nombre del platillo"
            error={errors.dishName}
          />

          <Select
            label="Categoría en el menú"
            name="dishCategory"
            value={formData?.dishCategory || ""}
            options={dishCategories.map((cat) => ({
              value: cat.label,
              label: cat.label,
            }))}
            onChange={handleChange}
            error={errors.dishCategory}
          />

          <Input
            label="Precio de venta ($ COP)"
            type="text"
            name="dishPrice"
            value={formData?.dishPrice || ""}
            onChange={handleChange}
            placeholder="Ej: 38000"
            error={errors.dishPrice}
          />

          <Input
            label="Stock disponible (porciones)"
            type="number"
            min={0}
            name="dishStock"
            value={formData?.dishStock ?? "0"}
            onChange={handleChange}
            placeholder="Ej: 15"
            error={errors.dishStock}
          />

          <Select
            label="Insumo principal de Inventario (opcional)"
            name="inventoryId"
            value={formData?.inventoryId || ""}
            options={inventoryOptions}
            onChange={handleChange}
            error={errors.inventoryId}
          />

          <Input
            label="Disponibilidad en carta"
            type="text"
            value={formData?.isActive ? "Visible en Menú POS" : "Oculto en Menú POS"}
            disabled
          />

          <div className="sm:col-span-2">
            <Input
              label="Descripción gastronómica e ingredientes principales"
              type="text"
              name="dishDescription"
              value={formData?.dishDescription || ""}
              onChange={handleChange}
              placeholder="Describe los ingredientes y preparación del plato"
              error={errors.dishDescription}
            />
          </div>
        </div>

        {/* Columna 3: Foto Interactiva con Cámara + Estado y Botones */}
        <div className="flex flex-col items-center justify-between gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60 w-full h-full">
          <div className="flex flex-col items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              title="Haz clic para cambiar la fotografía del platillo"
              className="relative group cursor-pointer"
            >
              <img
                src={previewUrl}
                alt={formData?.dishName || "Platillo"}
                className="w-36 h-36 object-cover rounded-full border-4 border-[var(--color-brand)] shadow-xl group-hover:brightness-75 transition"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute bottom-1 right-1 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-brand)] text-[var(--color-text-primary)] border-2 border-[var(--color-background-inverse)] shadow-lg flex items-center justify-center hover:scale-110 transition cursor-pointer"
                aria-label="Cambiar fotografía del platillo"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <span className="text-medium text-[var(--color-text-muted)] text-center">
              Toca el ícono de cámara para cambiar foto
            </span>
          </div>

          <div className="w-full pt-1">
            <Checkbox
              id="isActive"
              name="isActive"
              label={`Estado del platillo (${
                formData?.isActive ? "Activo" : "Inactivo"
              })`}
              checked={Boolean(formData?.isActive)}
              onChange={handleChange}
            />
          </div>

          <div className="w-full flex flex-col gap-4 pt-6 border-t border-[var(--color-border)]/60">
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              disabled={loading}
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
  );
}
