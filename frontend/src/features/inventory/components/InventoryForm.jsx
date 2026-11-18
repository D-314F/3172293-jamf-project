import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import { inventorySchema } from "../schemas/inventorySchema";
import {
  showCancelAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";
import { MARCAS_OPTIONS, CUENTADANTES_OPTIONS } from "../data/inventory";
import { getProviders } from "@/features/providers/services/providerServices";
import { getUsers } from "@/features/users/services/userServices";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "IN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function InventoryForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [providerOptions, setProviderOptions] = useState(MARCAS_OPTIONS);
  const [cuentadanteOptions, setCuentadanteOptions] =
    useState(CUENTADANTES_OPTIONS);

  const [formData, setFormData] = useState(
    location.state?.formData || {
      marca: "",
      cantidad: "",
      codigo: "",
      cantidadTotal: "",
      nombre: "",
      cantidadMinima: "",
      codigoBarras: "",
      valorUnitario: "",
      cuentadante: "",
      valorTotal: "",
      userImage: [],
    }
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([
      getProviders().catch(() => []),
      getUsers().catch(() => []),
    ]).then(([providersList, usersList]) => {
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
    });
  }, []);

  const previewUrl = useMemo(() => {
    if (
      Array.isArray(formData.userImage) &&
      formData.userImage.length > 0 &&
      formData.userImage[0] instanceof File
    ) {
      return URL.createObjectURL(formData.userImage[0]);
    }
    return null;
  }, [formData.userImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "cantidad" || name === "valorUnitario") {
        const qty = Number(name === "cantidad" ? value : prev.cantidad);
        const unit = Number(
          name === "valorUnitario" ? value : prev.valorUnitario
        );
        if (!isNaN(qty) && !isNaN(unit) && qty > 0 && unit > 0) {
          next.valorTotal = String(qty * unit);
        }
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, userImage: files }));
      if (errors.userImage) {
        setErrors((prev) => ({ ...prev, userImage: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = inventorySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Error al registrar insumo",
        text: "Por favor, completa correctamente todos los campos requeridos.",
      });
      return;
    }

    setErrors({});

    navigate("/dashboard/inventoryDetails", {
      state: {
        formData: {
          ...result.data,
          userImage: formData.userImage,
        },
      },
    });
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios no se han guardado.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate("/dashboard/inventoryList");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
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
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start border border-[var(--color-brand)]/60 shadow-2xl">
          {/* Encabezado */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-1 border-b border-[var(--color-border)] pb-4">
            <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Registrar Producto en Inventario (Paso 1 de 2)
            </h1>
            <p className="text-small text-[var(--color-text-muted)]">
              Selecciona el proveedor que suministra el insumo, el responsable de bodega y las cantidades
            </p>
          </div>

          {/* Columna 1 */}
          <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
            <Select
              label="Proveedor que suministra"
              name="marca"
              value={formData.marca}
              options={providerOptions}
              onChange={handleChange}
              error={errors.marca}
            />

            <Input
              label="ID (Código único interno)"
              name="codigo"
              value={formData.codigo}
              placeholder="Ej: INS010"
              onChange={handleChange}
              error={errors.codigo}
            />

            <Input
              label="Nombre del insumo / producto"
              name="nombre"
              value={formData.nombre}
              placeholder="Ej: Lomo de Res Madurado"
              onChange={handleChange}
              error={errors.nombre}
            />

            <Input
              label="Código de barras"
              name="codigoBarras"
              value={formData.codigoBarras}
              placeholder="Ej: 7702001054321"
              onChange={handleChange}
              error={errors.codigoBarras}
            />

            <Select
              label="Cuentadante (Responsable en bodega)"
              name="cuentadante"
              value={formData.cuentadante}
              options={cuentadanteOptions}
              onChange={handleChange}
              error={errors.cuentadante}
            />
          </div>

          {/* Columna 2 */}
          <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
            <Input
              label="Cantidad que ingresa (Lote actual)"
              name="cantidad"
              value={formData.cantidad}
              placeholder="Ej: 20"
              onChange={handleChange}
              error={errors.cantidad}
            />

            <Input
              label="Cantidad total en bodega"
              name="cantidadTotal"
              value={formData.cantidadTotal}
              placeholder="Ej: 50"
              onChange={handleChange}
              error={errors.cantidadTotal}
            />

            <Input
              label="Cantidad mínima (Alerta de agotado)"
              name="cantidadMinima"
              value={formData.cantidadMinima}
              placeholder="Ej: 10"
              onChange={handleChange}
              error={errors.cantidadMinima}
            />

            <Input
              label="Valor unitario ($ COP)"
              name="valorUnitario"
              value={formData.valorUnitario}
              placeholder="Ej: 25000"
              onChange={handleChange}
              error={errors.valorUnitario}
            />

            <Input
              label="Valor total del lote ($ COP)"
              name="valorTotal"
              value={formData.valorTotal}
              placeholder="Calculado automáticamente"
              onChange={handleChange}
              error={errors.valorTotal}
            />
          </div>

          {/* Columna 3: Avatar Circular con Cámara + Botones */}
          <div className="flex flex-col items-center justify-between gap-6 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60 w-full h-full">
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
                title="Haz clic para subir imagen del insumo"
                className="relative group cursor-pointer"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Vista previa insumo"
                    className="w-36 h-36 object-cover rounded-full border-4 border-[var(--color-brand)] shadow-xl group-hover:brightness-75 transition"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-[var(--color-brand)] bg-[var(--color-brand)]/15 flex flex-col items-center justify-center shadow-xl group-hover:bg-[var(--color-brand)]/25 transition">
                    <span className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-brand)]">
                      {getInitials(formData.nombre)}
                    </span>
                    <span className="text-caption text-[var(--color-text-muted)] mt-1">
                      Insumo POS
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
                  aria-label="Subir foto del insumo"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <span className="text-medium text-[var(--color-text-muted)] text-center">
                Toca el ícono de cámara para subir foto
              </span>
              {errors.userImage && (
                <span className="text-[var(--color-error)] text-medium">{errors.userImage}</span>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full pt-6 border-t border-[var(--color-border)]/60">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="w-full"
                onClick={handleCancel}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
              >
                Siguiente (Paso 2)
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}