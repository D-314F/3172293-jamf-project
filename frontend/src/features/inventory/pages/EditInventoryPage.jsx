import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button, Input, FileInput } from "@/shared";
import InventoryStatusSelect from "../components/InventoryStatusSelect";
import { editInventorySchema } from "../schemas/editInventorySchema";
import { getInventoryById, updateInventory } from "../services/inventoryServices";
import { 
  showSuccessAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";

export default function EditInventoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await getInventoryById(id);
        const statusNormalized = (item.status === "Disponible" || item.isActive) ? "Disponible" : "Agotado";

        setFormData({
          id: String(item.id || ""),
          name: item.name || item.nombre || "",
          barcode: String(item.barcode || item.codigoBarras || ""),
          quantity: String(item.quantity ?? item.cantidad ?? ""),
          unitPrice: String(item.unitPrice ?? item.valorUnitario ?? ""),
          brand: item.brand || item.marca || "",
          lote: String(item.lote || ""),
          status: statusNormalized,
          userImage: [],
        });
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadItem();
  }, [id]);

  if (pageLoading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 text-center text-[var(--color-text-inverse)]">
        <p>Cargando datos del producto...</p>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (files) => {
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, userImage: files }));
      if (errors.userImage) {
        setErrors((prev) => ({ ...prev, userImage: "" }));
      }
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/inventoryList");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = editInventorySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor, revisa los campos señalados en el formulario.",
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const isAvailable = result.data.status === "Disponible";
      await updateInventory(id, {
        ...result.data,
        isActive: isAvailable,
      });

      await showSuccessAlert({
        title: "Producto actualizado",
        text: "Los cambios del inventario se han guardado en la base de datos.",
        timer: 2000,
      });

      navigate("/dashboard/inventoryList");
    } catch (error) {
      console.error("Error al actualizar producto", error);
      await showUserErrorAlert({
        title: "Error al guardar",
        text: error.message || "No se pudieron actualizar los datos del producto.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          onClick={handleCancel}
          variant="secondary"
          size="sm"
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] text-right">
          Editar Inventario
        </h1>
      </div>

      <div className="bg-[var(--color-background-inverse)] rounded-3xl p-6 sm:p-10 w-full border border-[var(--color-brand)] shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <FileInput
            label="Seleccionar imagen del producto"
            value={formData.userImage || []}
            onChange={handleImageChange}
            multiple={false}
            error={errors.userImage}
            className="border-[var(--color-brand)]/30"
          />

          <span className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-brand)] text-center">
            {formData.name}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="ID (Código único)" 
            name="id" 
            value={formData.id ?? ""} 
            onChange={handleChange} 
            disabled 
            error={errors.id}
          />

          <Input 
            label="Nombre completo" 
            name="name" 
            value={formData.name || ""} 
            onChange={handleChange} 
            error={errors.name}
          />

          <Input 
            label="Código de barras" 
            name="barcode" 
            value={formData.barcode || ""} 
            onChange={handleChange} 
            error={errors.barcode}
          />

          <Input 
            label="Cantidad existente" 
            name="quantity" 
            value={formData.quantity ?? ""} 
            onChange={handleChange} 
            error={errors.quantity}
          />

          <Input 
            label="Precio unitario" 
            name="unitPrice" 
            value={formData.unitPrice ?? ""} 
            onChange={handleChange} 
            error={errors.unitPrice}
          />

          <Input 
            label="Marca" 
            name="brand" 
            value={formData.brand || ""} 
            onChange={handleChange} 
            error={errors.brand}
          />

          <Input 
            label="Lote" 
            name="lote" 
            value={formData.lote || ""} 
            onChange={handleChange} 
            error={errors.lote}
          />

          <InventoryStatusSelect
            initialStatus={formData.status}
            onStatusChange={(newStatus) => {
              setFormData((prev) => ({ ...prev, status: newStatus }));
              if (errors.status) setErrors((prev) => ({ ...prev, status: "" }));
            }}
          />

          {errors.submit && (
            <div className="col-span-1 md:col-span-2 text-[var(--color-error)] text-sm font-medium">
              {errors.submit}
            </div>
          )}

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-6 border-t border-[var(--color-brand)]/30">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Guardando..." : "Actualizar"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}