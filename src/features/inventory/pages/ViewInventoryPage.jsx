// src/features/inventory/pages/ViewInventoryPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Select } from "@/shared";
import { inventory } from "../data/inventory";
import productImage from "@/assets/images/products.png"; // Usa cualquiera de tus imágenes

export default function ViewInventoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Buscar el producto por ID
  const product = inventory.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <section className="p-8 text-center text-[var(--color-text-inverse)]">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </section>
    );
  }

  return (
    <section className="p-8 flex flex-col items-center">
      {/* Botón Volver */}
      <div className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <Button
  type="button"
  onClick={() => navigate(-1)}
  variant="secondary"
  className="bg-[var(--color-error)] text-[var(--color-text-inverse)] hover:bg-[var(--color-error-hover)] transition"
>
  Atrás

  </Button>
  <h1 className="text-xl sm:text-2xl font-bold text-white">
          Ver Inventario
        </h1>


      </div>

      {/* Tarjeta principal */}
      <div className="bg-[var(--color-background-inverse)] rounded-3xl p-10 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10 border border-[var(--color-brand)] shadow-2xl">
        {/* Imagen del producto */}
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src={productImage}
            alt={product.name}
            className="w-56 h-56 object-cover rounded-xl border-4 border-[var(--color-brand)] shadow-lg"
          />
          <span className="text-xl font-bold text-[var(--color-text-inverse)]">
            {product.name}
          </span>
        </div>

        {/* Detalles del producto */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="ID (Código Único)"
            value={product.id}
            readOnly
            disabled
          />
          <Input
            label="Nombre completo"
            value={product.name}
            readOnly
            disabled
          />
          <Input
            label="Código de barras"
            value={product.barcode}
            readOnly
            disabled
          />
          <Input
            label="Cantidad existente"
            value={product.quantity}
            readOnly
            disabled
          />
          <Input
            label="Precio unitario"
            value={`$${product.unitPrice}`}
            readOnly
            disabled
          />
          <Input label="Marca" value={product.brand} readOnly disabled />
          <Select
            label="Estado del producto"
            value={product.status}
            disabled
            options={[
              { value: "Activo", label: "Activo" },
              { value: "Vencido", label: "Vencido" },
              { value: "Avería", label: "Avería" },
              { value: "Agotado", label: "Agotado" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
