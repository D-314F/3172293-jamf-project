// src/features/dishes/components/dishForm.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button, Input, Select, FileInput } from "@/shared";
import { getDishCategories } from "../../../services/selectService";
import { getInventory } from "@/features/inventory/services/inventoryServices";
import { dishSchema } from "../schemas/dishSchema";
import { createDish } from "../services/dishServices";

import {
  showSuccessAlert,
  showCancelAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";

export default function DishForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    descripcion: "",
    inventoryId: "",
    dishStock: "15",
    userImage: [],
  });

  useEffect(() => {
    Promise.all([
      getDishCategories().catch(() => []),
      getInventory().catch(() => []),
    ]).then(([catList, invList]) => {
      setCategories(
        (catList || []).map((cat) => ({
          value: cat.label,
          label: cat.label,
        }))
      );
      setInventoryItems(Array.isArray(invList) ? invList : []);
    });
  }, []);

  const inventoryOptions = inventoryItems.map((item) => {
    const qty = Number(item.quantity ?? item.cantidad ?? 0);
    const active = item.isActive !== false && item.status !== "Agotado" && qty > 0;
    return {
      value: String(item.id),
      label: `${item.name || item.nombre} (${active ? `Stock: ${qty} uds.` : "Agotado - 0 uds."})`,
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = dishSchema.safeParse({
      ...formData,
      dishStock: String(formData.dishStock ?? "15"),
      inventoryId: String(formData.inventoryId ?? ""),
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Error al registrar platillo",
        text: "Por favor, completa correctamente todos los campos obligatorios.",
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

        if (!invActive || invQty <= 0) {
          setErrors({
            inventoryId: "Insumo agotado o inactivo en inventario",
          });
          await showUserErrorAlert({
            title: "Sin existencias en inventario",
            text: `No puedes preparar "${result.data.nombre}" porque "${linkedInv.name || linkedInv.nombre}" está agotado o inactivo (Stock: ${invQty}).`,
          });
          return;
        }

        if (requestedStock > invQty) {
          setErrors({
            dishStock: `Máximo ${invQty} porciones según inventario`,
          });
          await showUserErrorAlert({
            title: "Stock insuficiente en inventario",
            text: `Asignaste ${requestedStock} porciones, pero de "${linkedInv.name || linkedInv.nombre}" solo hay ${invQty} unidad(es) disponibles.`,
          });
          return;
        }
      }
    }

    setErrors({});

    try {
      await createDish({
        ...result.data,
        inventoryId: result.data.inventoryId ? Number(result.data.inventoryId) : null,
        dishStock: requestedStock,
        userImage: formData.userImage,
      });

      await showSuccessAlert({
        title: "Platillo agregado",
        text: "El platillo se ha registrado correctamente en el menú.",
        timer: 2000,
      });

      navigate(-1);
    } catch (error) {
      console.error(error);
      setErrors({ submit: error.message || "Error interno al procesar el plato" });

      await showUserErrorAlert({
        title: "No se pudo registrar el platillo",
        text: error.message || "No se pudo registrar el platillo en el servidor.",
      });
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los datos ingresados no se guardarán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-12 pb-10 flex flex-col gap-6">
      {/* Header superior */}
      <div className="flex items-center justify-between gap-4">
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
        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] text-right">
          Registrar platillo
        </h1>
      </div>

      {/* Tarjeta contenedora */}
      <div className="bg-[var(--color-background-inverse)] p-6 sm:p-10 rounded-3xl border border-[var(--color-brand)]/35 shadow-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Columna 1: Datos e Inventario */}
          <div className="flex flex-col gap-4">
            <Input
              label="Nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              placeholder="Ej. Risotto de hongos"
              onChange={handleChange}
              error={errors.nombre}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Precio (COP)"
                name="precio"
                type="text"
                value={formData.precio}
                placeholder="Ej. 45000"
                onChange={handleChange}
                error={errors.precio}
              />
              <Input
                label="Stock disponible (porciones)"
                name="dishStock"
                type="number"
                min={0}
                value={formData.dishStock}
                placeholder="Ej. 15"
                onChange={handleChange}
                error={errors.dishStock}
              />
            </div>
            <Select
              label="Categoría"
              name="categoria"
              value={formData.categoria}
              options={categories}
              onChange={handleChange}
              error={errors.categoria}
            />
            <Select
              label="Insumo principal de Inventario (opcional)"
              name="inventoryId"
              value={formData.inventoryId}
              options={inventoryOptions}
              onChange={handleChange}
              error={errors.inventoryId}
            />
            <Input
              label="Descripción"
              name="descripcion"
              type="text"
              value={formData.descripcion}
              placeholder="Ingresa una breve descripción gastronómica"
              onChange={handleChange}
              error={errors.descripcion}
            />
          </div>

          {/* Columna 2: Carga de archivo y botones */}
          <div className="flex flex-col justify-between gap-6">
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-[var(--color-text-inverse)] text-medium font-medium font-[var(--font-heading)]">
                Imagen del platillo
              </span>

              <FileInput
                className="border-[var(--color-brand)]/30 w-full"
                value={formData.userImage}
                onChange={(files) =>
                  setFormData((prev) => ({ ...prev, userImage: files }))
                }
                multiple={false}
              />

              {errors.userImage && (
                <span className="text-[var(--color-error)] text-medium">
                  {errors.userImage}
                </span>
              )}
            </div>

            {/* Botones de acción (espaciado mínimo 24px desde contenido y 16px entre botones) */}
            <div className="flex flex-col gap-4 w-full pt-6">
              <Button
                variant="secondary"
                type="button"
                size="md"
                onClick={handleCancel}
                className="w-full"
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                type="submit"
                size="md"
                className="w-full"
              >
                Agregar platillo
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
