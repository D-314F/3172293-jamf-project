// src/features/inventory/pages/EditInventoryPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import FileInput from "@/shared/components/FileInput";
import Modal from "@/shared/components/Modal";
import InventoryStatusSelect from "../components/InventoryStatusSelect";
import { inventory } from "../data/inventory";


export default function EditInventoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const producto = inventory.find((item) => item.id.toString() === id);
  const [formData, setFormData] = useState(producto || {});
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!producto) {
    return (
      <section className="p-10 text-center text-red-500">
        <h1>Producto no encontrado</h1>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (files) => {
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, userImage: files }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const confirmUpdate = () => {
    setIsModalOpen(false);
    alert("¡Producto actualizado correctamente!");
    navigate("/dashboard/inventoryList");
  };

  return (
    <section className="p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          Atrás
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Editar Inventario
        </h1>
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="ID (Código único)" name="id" value={formData.id} onChange={handleChange} disabled />
          <Input label="Nombre completo" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Código de barras" name="barcode" value={formData.barcode} onChange={handleChange} />
          <Input label="Cantidad existente" name="quantity" value={formData.quantity} onChange={handleChange} />
          <Input label="Precio unitario" name="unitPrice" value={formData.unitPrice} onChange={handleChange} />
          <Input label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
          <Input label="Lote" name="lote" value={formData.lote || ""} onChange={handleChange} disabled />

          <InventoryStatusSelect
            initialStatus={formData.status}
            onStatusChange={(newStatus) => setFormData((prev) => ({ ...prev, status: newStatus }))}
          />

          <div className="col-span-2 flex justify-end pt-6 border-t border-[var(--color-border)]/20">
            <Button type="submit" variant="primary">
              Actualizar
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de confirmación */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Confirmar actualización</h2>
            <p>¿Deseas guardar los cambios del producto?</p>
            <div className="flex justify-end gap-3 mt-6">
      <button
        className=" px-4 py-2 rounded hover:bg-[var(--color-secondary-950)] transition"
        onClick={() => setIsModalOpen(false)}
      >
        Cancelar
      </button>
  <button
    className="bg-[var(--color-brand)] text-[var(--color-text-inverse)] px-4 py-2 rounded hover:bg-[var(--color-brand-hover)] transition"
    onClick={confirmUpdate}
  >
    Confirmar
  </button>
</div>

          </div>
        </Modal>
      )}
    </section>
  );
}
