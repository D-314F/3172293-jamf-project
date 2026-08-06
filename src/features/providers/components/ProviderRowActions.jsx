import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProviderRowActions({ provider }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/providerView/${provider.id}`);
  };

  const handleEdit = () => {
    console.log("Editar proveedor", provider.id);
  };

  const handleDelete = () => {
    console.log("Eliminar proveedor", provider.id);
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleView} className="p-1 rounded hover:bg-yellow-100 transition">
        <Eye size={16} />
      </button>
      <button onClick={handleEdit} className="p-1 rounded hover:bg-gray-100">
        <Pencil size={16} />
      </button>
      <button onClick={handleDelete} className="p-1 rounded hover:bg-gray-100">
        <Trash2 size={16} />
      </button>
    </div>
  );
}