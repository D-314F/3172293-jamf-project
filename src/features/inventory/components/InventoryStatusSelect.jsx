import { useState } from "react";
import Select from "@/shared/components/Select";

export default function InventoryStatusSelect({
  initialStatus = "activo",
  onStatusChange,
}) {
  const [status, setStatus] = useState(initialStatus);

  const options = [
    { value: "activo", label: "Activo" },
    { value: "vencido", label: "Vencido" },
    { value: "averia", label: "Avería" },
    { value: "agotado", label: "Agotado" },
  ];

  const handleChange = (e) => {
    const newStatus = e.target.value;

    setStatus(newStatus);

    if (onStatusChange) {
      onStatusChange(newStatus);
    }

    alert(`Estado cambiado a: ${newStatus}`);
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
    </div>
  );
}