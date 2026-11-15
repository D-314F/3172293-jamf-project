// Reemplaza todo: frontend/src/features/inventory/pages/ViewInventoryPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button, Input } from "@/shared";
import { getInventoryById } from "../services/inventoryServices";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "IN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ViewInventoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getInventoryById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 text-center text-[var(--color-text-inverse)]">
        <p>Cargando información del insumo...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 text-center text-[var(--color-text-inverse)]">
        <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-4">
          Insumo no encontrado
        </h1>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Volver al listado
        </Button>
      </section>
    );
  }

  const currentStatus = product.status || "Disponible";
  const badgeColor =
    currentStatus === "Disponible"
      ? "bg-green-500"
      : currentStatus === "Agotado"
      ? "bg-red-500"
      : "bg-amber-500";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
        <Button
          type="button"
          onClick={() => navigate(-1)}
          variant="secondary"
          size="sm"
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
      </div>

      <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start border border-[var(--color-brand)]/60 shadow-2xl">
        {/* Encabezado */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-1 border-b border-[var(--color-border)] pb-4">
          <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Visualizar Insumo de Inventario
          </h1>
          <p className="text-small text-[var(--color-text-muted)]">
            Ficha de control de stock, trazabilidad por proveedor y uso gastronómico
          </p>
        </div>

        {/* Columna 1 */}
        <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
          <Input
            label="Código interno"
            value={product.codigo || `INV-${product.id}`}
            readOnly
            disabled
          />

          <Input
            label="Nombre del insumo / producto"
            value={product.name || ""}
            readOnly
            disabled
          />

          <Input
            label="Proveedor que suministra"
            value={product.brand || "Sin proveedor asignado"}
            readOnly
            disabled
          />

          <Input
            label="Cuentadante (Responsable)"
            value={product.cuentadante || "Sin asignar"}
            readOnly
            disabled
          />

          <Input
            label="Código de barras"
            value={product.barcode || ""}
            readOnly
            disabled
          />
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
          <Input
            label="Cantidad existente (Stock)"
            value={`${product.quantity ?? 0} unidades`}
            readOnly
            disabled
          />

          <Input
            label="Valor unitario ($ COP)"
            value={`$${Number(product.unitPrice ?? 0).toLocaleString("es-CO")}`}
            readOnly
            disabled
          />

          <Input
            label="Lote"
            value={product.lote || ""}
            readOnly
            disabled
          />

          <Input
            label="Ubicación en bodega"
            value={product.ubicacion || "Almacén general"}
            readOnly
            disabled
          />

          <Input
            label="Fecha de vencimiento"
            value={product.fechaVencimiento || "No aplica"}
            readOnly
            disabled
          />

          <Input
            label="Uso en menú / Descripción"
            value={product.descripcion || "Sin descripción"}
            readOnly
            disabled
          />
        </div>

        {/* Columna 3 */}
        <div className="flex flex-col items-center justify-between gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60 w-full h-full">
          <div className="flex flex-col items-center gap-4 w-full">
            {product.productImageUrl ? (
              <img
                src={product.productImageUrl}
                alt={product.name}
                className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-full border-4 border-[var(--color-brand)] shadow-lg"
              />
            ) : (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[var(--color-brand)] bg-[var(--color-brand)]/15 flex flex-col items-center justify-center shadow-lg">
                <span className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-brand)]">
                  {getInitials(product.name)}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] mt-1.5">
                  {product.codigo || "Insumo POS"}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--color-background-inverse)] border border-[var(--color-border)]">
              <span className="text-sm font-[var(--font-label)] text-[var(--color-text-muted)]">
                Estado en bodega:
              </span>
              <span className={`w-3 h-3 rounded-full ${badgeColor}`} />
              <span className="text-sm font-semibold text-[var(--color-text-inverse)]">
                {currentStatus}
              </span>
            </div>

            <Input
              label="Observación adicional"
              value={product.comentarioProducto || "Sin observaciones"}
              readOnly
              disabled
            />
          </div>

          <div className="w-full pt-4 border-t border-[var(--color-border)]/30">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => navigate(`/dashboard/inventory/${product.id}/edit`)}
              className="w-full"
            >
              <Pencil className="w-4 h-4" />
              Editar este insumo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}