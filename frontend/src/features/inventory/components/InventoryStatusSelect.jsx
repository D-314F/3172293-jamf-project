// src/features/inventory/components/InventoryStatusSelect.jsx

import { useState, useEffect } from "react";
import Select from "@/shared/components/Select";
import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import { showSuccessAlert } from "@/shared/services/alertService";
import { INVENTORY_STATUS_OPTIONS } from "../data/inventory";

export default function InventoryStatusSelect({
  initialStatus = "Disponible",
  onStatusChange,
}) {
  const [status, setStatus] = useState(initialStatus || "Disponible");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setPendingStatus(newStatus);
    setIsModalOpen(true);
  };

  const confirmChange = async () => {
    setStatus(pendingStatus);
    setIsModalOpen(false);

    if (onStatusChange) {
      onStatusChange(pendingStatus);
    }

    await showSuccessAlert({
      title: "Estado actualizado",
      text: `El estado del producto ha cambiado a "${pendingStatus}".`,
      timer: 1800,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Select
        label="Estado del producto"
        name="status"
        value={status}
        options={INVENTORY_STATUS_OPTIONS}
        onChange={handleChange}
        hidePlaceholder={true}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6 text-[var(--color-text-inverse)]">
            <h2 className="text-lg font-bold font-[var(--font-heading)] mb-4 text-[var(--color-brand)]">
              Confirmar cambio de estado
            </h2>
            <p className="text-sm text-[var(--color-text-inverse)]">
              ¿Seguro que deseas cambiar el estado del producto a{" "}
              <span className="font-semibold text-[var(--color-brand)]">
                {pendingStatus}
              </span>?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                variant="primary" 
                size="sm" 
                onClick={confirmChange}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}