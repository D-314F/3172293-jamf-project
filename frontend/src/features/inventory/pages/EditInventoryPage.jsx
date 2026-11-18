import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Camera } from "lucide-react";

import { Button, Input, Select, resolveMediaUrl } from "@/shared";
import InventoryStatusSelect from "../components/InventoryStatusSelect";
import { editInventorySchema } from "../schemas/editInventorySchema";
import {
  getInventoryById,
  updateInventory,
} from "../services/inventoryServices";
import { getProviders } from "@/features/providers/services/providerServices";
import { getUsers } from "@/features/users/services/userServices";
import { MARCAS_OPTIONS, CUENTADANTES_OPTIONS } from "../data/inventory";
import {
  showSuccessAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "IN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function EditInventoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [providerOptions, setProviderOptions] = useState(MARCAS_OPTIONS);
  const [cuentadanteOptions, setCuentadanteOptions] =
    useState(CUENTADANTES_OPTIONS);

  useEffect(() => {
    const loadItemAndOptions = async () => {
      try {
        const [item, providersList, usersList] = await Promise.all([
          getInventoryById(id),
          getProviders().catch(() => []),
          getUsers().catch(() => []),
        ]);

        if (Array.isArray(providersList) && providersList.length > 0) {
          setProviderOptions(
            providersList.map((p) => ({
              value: p.fullName || p.providerName,
              label: p.fullName || p.providerName,
            }))
          );
        }

        if (Array.isArray(usersList) && usersList.length > 0) {
          setCuentadanteOptions(
            usersList.map((u) => ({
              value: u.userName,
              label: `${u.userName} (${u.userRole || "Personal"})`,
            }))
          );
        }

        setFormData({
          id: String(item.id || ""),
          codigo: item.codigo || `INV-${item.id}`,
          name: item.name || item.nombre || "",
          barcode: String(item.barcode || item.codigoBarras || ""),
          quantity: String(item.quantity ?? item.cantidad ?? ""),
          cantidadMinima: String(item.cantidadMinima ?? 10),
          unitPrice: String(item.unitPrice ?? item.valorUnitario ?? ""),
          brand: item.brand || item.marca || "",
          cuentadante: item.cuentadante || "",
          lote: String(item.lote || "").replace(/-/g, ""),
          ubicacion: item.ubicacion || "",
          fechaVencimiento: item.fechaVencimiento || "",
          descripcion: item.descripcion || "",
          status: item.status || "Disponible",
          productImageUrl: item.productImageUrl || null,
          userImage: [],
        });
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadItemAndOptions();
  }, [id]);

  const previewUrl = useMemo(() => {
    if (
      Array.isArray(formData.userImage) &&
      formData.userImage.length > 0 &&
      formData.userImage[0] instanceof File
    ) {
      return URL.createObjectURL(formData.userImage[0]);
    }
    return resolveMediaUrl(formData.productImageUrl);
  }, [formData.userImage, formData.productImageUrl]);

  if (pageLoading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 text-center text-[var(--color-text-inverse)]">
        <p>Cargando datos del insumo...</p>
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, userImage: files }));
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/inventoryList");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      lote: String(formData.lote || "").replace(/[^a-zA-Z0-9]/g, ""),
      barcode: String(formData.barcode || "").replace(/[^a-zA-Z0-9]/g, ""),
    };

    const result = editInventorySchema.safeParse(cleanedData);

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
      await updateInventory(id, {
        ...result.data,
        cuentadante: formData.cuentadante,
        ubicacion: formData.ubicacion,
        fechaVencimiento: formData.fechaVencimiento,
        descripcion: formData.descripcion,
        userImage: formData.userImage,
        productImageUrl: formData.productImageUrl,
      });

      await showSuccessAlert({
        title: "Insumo actualizado",
        text: "Los cambios del inventario se han guardado en la base de datos.",
        timer: 2000,
      });

      navigate("/dashboard/inventoryList");
    } catch (error) {
      console.error("Error al actualizar producto", error);
      await showUserErrorAlert({
        title: "Error al guardar",
        text:
          error.message || "No se pudieron actualizar los datos del insumo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
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
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start border border-[var(--color-brand)]/60 shadow-2xl">
          {/* Encabezado */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-1 border-b border-[var(--color-border)] pb-4">
            <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Editar Insumo de Inventario
            </h1>
            <p className="text-small text-[var(--color-text-muted)]">
              Actualiza existencias, proveedor asociado, lote y estado de bodega
            </p>
          </div>

          {/* Columna 1: Identificación y Proveedor */}
          <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
            <Input
              label="Código interno"
              name="codigo"
              value={formData.codigo ?? ""}
              disabled
            />

            <Input
              label="Nombre del insumo / producto"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              error={errors.name}
            />

            <Select
              label="Proveedor que suministra"
              name="brand"
              value={formData.brand || ""}
              options={providerOptions}
              onChange={handleChange}
              error={errors.brand}
            />

            <Select
              label="Cuentadante (Responsable)"
              name="cuentadante"
              value={formData.cuentadante || ""}
              options={cuentadanteOptions}
              onChange={handleChange}
            />

            <Input
              label="Código de barras"
              name="barcode"
              value={formData.barcode || ""}
              onChange={handleChange}
              error={errors.barcode}
            />
          </div>

          {/* Columna 2: Cantidades, Costos y Bodega */}
          <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
            <Input
              label="Cantidad existente (Stock)"
              name="quantity"
              value={formData.quantity ?? ""}
              onChange={handleChange}
              error={errors.quantity}
            />

            <Input
              label="Valor unitario ($ COP)"
              name="unitPrice"
              value={formData.unitPrice ?? ""}
              onChange={handleChange}
              error={errors.unitPrice}
            />

            <Input
              label="Lote (Alfanumérico)"
              name="lote"
              value={formData.lote || ""}
              onChange={handleChange}
              error={errors.lote}
            />

            <Input
              label="Ubicación en bodega"
              name="ubicacion"
              value={formData.ubicacion || ""}
              onChange={handleChange}
              placeholder="Ej: Cuarto Frío - Estante A1"
            />

            <Input
              label="Uso en menú / Descripción"
              name="descripcion"
              value={formData.descripcion || ""}
              onChange={handleChange}
              placeholder="Platillos donde se utiliza este insumo"
            />
          </div>

          {/* Columna 3: Avatar con Cámara + Estado y Botones */}
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
                title="Haz clic para cambiar la imagen del insumo"
                className="relative group cursor-pointer"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={formData.name || "Insumo"}
                    className="w-36 h-36 object-cover rounded-full border-4 border-[var(--color-brand)] shadow-xl group-hover:brightness-75 transition"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-[var(--color-brand)] bg-[var(--color-brand)]/15 flex flex-col items-center justify-center shadow-xl group-hover:bg-[var(--color-brand)]/25 transition">
                    <span className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-brand)]">
                      {getInitials(formData.name)}
                    </span>
                    <span className="text-caption text-[var(--color-text-muted)] mt-1">
                      {formData.codigo || "Insumo POS"}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-1 right-1 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-brand)] text-[var(--color-text-primary)] border-2 border-[var(--color-background-inverse)] shadow-lg flex items-center justify-center hover:scale-110 transition cursor-pointer"
                  aria-label="Cambiar imagen del insumo"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <span className="text-medium text-[var(--color-text-muted)] text-center">
                Toca el ícono de cámara para subir foto
              </span>
            </div>

            <div className="w-full">
              <InventoryStatusSelect
                initialStatus={formData.status}
                onStatusChange={(newStatus) => {
                  setFormData((prev) => ({ ...prev, status: newStatus }));
                  if (errors.status)
                    setErrors((prev) => ({ ...prev, status: "" }));
                }}
              />
            </div>

            <div className="flex flex-col gap-4 w-full pt-6 border-t border-[var(--color-border)]/60">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleCancel}
                disabled={loading}
                className="w-full"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
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