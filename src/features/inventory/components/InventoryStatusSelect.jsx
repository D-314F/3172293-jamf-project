import { useState } from "react";
import Select from "@/shared/components/Select";
import Modal from "@/shared/components/Modal";

export default function InventoryStatusSelect({ initialStatus = "activo", onStatusChange }) {
  const [status, setStatus] = useState(initialStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const options = [
    { value: "activo", label: "Activo" },
    { value: "vencido", label: "Vencido" },
    { value: "averia", label: "Avería" },
    { value: "agotado", label: "Agotado" },
  ];

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setPendingStatus(newStatus);
    setIsModalOpen(true);
  };

  const confirmChange = () => {
    setStatus(pendingStatus);
    setIsModalOpen(false);
    if (onStatusChange) onStatusChange(pendingStatus);
    alert(`Estado cambiado a: ${pendingStatus}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <Select
        label="Estado del producto"
        name="status"
        value={status}
        options={options}
        onChange={handleChange}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Confirmar cambio</h2>
            <p>
              ¿Seguro que deseas cambiar el estado del producto a{" "}
              <span className="font-semibold">{pendingStatus}</span>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[var(--color-brand)] text-white px-4 py-2 rounded"
                onClick={confirmChange}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
