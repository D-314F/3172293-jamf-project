import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import FileInput from "@/shared/components/FileInput";
import InventoryStatusSelect from "../components/InventoryStatusSelect";

import { inventory } from "../data/inventory";
import {
  showSuccessAlert,
  showCancelAlert,
} from "@/shared/services/alertService";
import { inventorySchema } from "../schemas/inventorySchema";

export default function EditInventoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const producto = inventory.find((item) => item.id.toString() === id);

  const [formData, setFormData] = useState(producto || {});
  const [loading, setLoading] = useState(false);

  if (!producto) {
    return (
      <section className="p-10 text-center text-red-500">
        <h1>Producto no encontrado</h1>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (files) => {
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        userImage: files,
      }));
    }
  };

  // Confirmación de actualización
  const confirmUpdate = async () => {
    try {
      setLoading(true);

      console.log("Inventario actualizado:", formData);

      await showSuccessAlert({
        title: "Inventario actualizado",
        text: "El inventario se ha actualizado correctamente.",
        timer: 2000,
      });

      navigate("/dashboard/inventoryList");
    } catch (error) {
      console.error("Error al editar el inventario:", error);

      setErrors({
        submit: "Error al actualizar el inventario",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = inventorySchema.safeParse(formData);

    if (!result.success) {
      console.log("Errores de Zod:", result.error.issues);

      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // Se mantiene confirmUpdate
    await confirmUpdate();
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "Cancelado",
      text: "Los cambios no guardados se perderán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <section className="p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl">
        {/* Botón Volver */}
        <div className="p-8">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex items-start gap-2 bg-[var(--color-secondary-950)] text-[var(--color-text-white)] px-4 py-2 rounded-md mb-6 hover:bg-[var(--color-secondary-950)] transition"
          >
            <ArrowLeft size={16} /> Atrás
          </Button>

          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Editar Inventario
          </h1>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-[var(--color-background-inverse)] rounded-3xl p-10 max-w-6xl w-full border border-[var(--color-brand)] shadow-2xl">
        
        {/* Selector e imagen */}
        <div className="flex flex-col items-center justify-center gap-4 mb-10">
          <FileInput
            label="Seleccionar imagen del producto"
            value={formData.userImage || []}
            onChange={handleImageChange}
            multiple={false}
          />

          <span className="text-xl font-bold text-[var(--color-text-inverse)]">
            {formData.name}
          </span>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            label="ID (Código único)"
            name="id"
            value={formData.id}
            onChange={handleChange}
            disabled
          />

          <Input
            label="Nombre completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Código de barras"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
          />

          <Input
            label="Cantidad existente"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />

          <Input
            label="Precio unitario"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
          />

          <Input
            label="Marca"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />

          <Input
            label="Lote"
            name="lote"
            value={formData.lote || ""}
            onChange={handleChange}
            disabled
          />

          <InventoryStatusSelect
            initialStatus={formData.status}
            onStatusChange={(newStatus) =>
              setFormData((prev) => ({
                ...prev,
                status: newStatus,
              }))
            }
          />

          {errors.submit && (
            <div className="col-span-2 text-red-500">
              {errors.submit}
            </div>
          )}

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-3 pt-6 border-t border-[var(--color-border)]/20">
          
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>

            <button
              className="bg-[var(--color-brand)] text-[var(--color-text-inverse)] px-4 py-2 rounded hover:bg-[var(--color-brand-hover)] transition" 
              onClick={confirmUpdate} 
            >
              Confirmar 
            </button>

              {loading ? "Actualizando..." : "Actualizar Inventario"}
          </div>
        </form>
      </div>
    </section>
  );
}