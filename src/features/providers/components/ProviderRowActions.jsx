import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProviderRowActions({ provider }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/providerView/${provider.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/providerEdit/${provider.id}`);
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que deseas eliminar al proveedor 
      ${provider.fullName || ""}?`)) {
      alert("Proveedor eliminado con éxito");
    }
  };

  return (
    <div className="flex gap-2">
      {/* Botón ver */}
      <button
        onClick={handleView}
        className="p-1 rounded hover:bg-[var(--color-brand-soft)] transition-colors duration-200"
        title="Ver proveedor"
      >
        <Eye size={16} color="var(--color-text-primary)" />
      </button>

      {/* Botón editar */}
      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors duration-200"
        title="Editar proveedor"
      >
        <Pencil size={16} color="var(--color-text-primary)" />
      </button>

      {/* Botón eliminar (Corrección de color) */}
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-[var(--color-error-soft)] transition-colors duration-200"
        title="Eliminar proveedor"
      >
        {/* Cambia var(--color-error) por 'red' o '#ef4444' (rojo de Tailwind */}
        <Trash2 size={16} color="#ef4444" />
      </button>
    </div>
  );
}