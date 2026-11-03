import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, Input } from "@/shared";
import productImage from "@/assets/images/products.png";
import { getInventoryById } from "../services/inventoryServices";

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
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 text-center text-[var(--color-text-inverse)]">
        <p>Cargando información del producto...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 text-center text-[var(--color-text-inverse)]">
        <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-4">
          Producto no encontrado
        </h1>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Volver al listado
        </Button>
      </section>
    );
  }

  const currentStatus = product.status || "Disponible";
  const badgeColor = currentStatus === "Disponible" 
    ? "bg-green-500" 
    : currentStatus === "Agotado" 
    ? "bg-red-500" 
    : "bg-amber-500";

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
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

        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] text-right">
          Ver Inventario
        </h1>
      </div>

      <div className="bg-[var(--color-background-inverse)] rounded-3xl p-6 sm:p-10 w-full border border-[var(--color-brand)] shadow-2xl flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-52 h-52 rounded-2xl overflow-hidden border-2 border-[var(--color-brand)] bg-[var(--color-background-primary)] shadow-md">
              <img
                src={product.productImageUrl || productImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-[var(--color-brand)] text-center font-[var(--font-heading)]">
              {product.name}
            </span>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <Input
              label="ID / Código"
              value={product.codigo || product.id}
              readOnly
              disabled
            />

            <Input
              label="Nombre completo"
              value={product.name || ""}
              readOnly
              disabled
            />

            <Input
              label="Código de barras"
              value={product.barcode || ""}
              readOnly
              disabled
            />

            <Input
              label="Cantidad existente"
              value={product.quantity ?? ""}
              readOnly
              disabled
            />

            <Input
              label="Precio unitario"
              value={`$${product.unitPrice ?? 0}`}
              readOnly
              disabled
            />

            <Input
              label="Marca"
              value={product.brand || ""}
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
              label="Ubicación"
              value={product.ubicacion || ""}
              readOnly
              disabled
            />

            <div className="sm:col-span-2 flex flex-col gap-2">
              <span className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-wider font-[var(--font-heading)]">
                Estado del producto
              </span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-[var(--color-brand)]/30 bg-[var(--color-background-primary)]/40 text-[var(--color-text-inverse)]">
                  <span className={`w-2.5 h-2.5 rounded-full ${badgeColor} animate-pulse`} />
                  {currentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-[var(--color-brand)]/30">
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard/inventoryList")}
            className="w-full sm:w-auto"
          >
            Volver al listado
          </Button>
        </div>
      </div>
    </section>
  );
}