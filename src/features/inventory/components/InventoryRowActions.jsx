// src/features/inventory/components/InventoryRowActions.jsx

// Iconos usados en los botones de acciones
import { Pencil, Trash2 } from "lucide-react";

// Hook de React Router para navegar programáticamente entre rutas
import { useNavigate } from "react-router-dom";

// Componente que renderiza las acciones de cada fila de inventario
// Recibe como prop el objeto item (producto del inventario)
export default function InventoryRowActions({ item }) {

  // Hook que permite redirigir a otra ruta desde código
  const navigate = useNavigate();

  // Acción para editar el producto del inventario
  // Redirige a la página de edición usando el id del producto
  const handleEdit = () => {
    navigate(`/inventory/${item.id}/edit`);
  };

  // Acción para eliminar el producto del inventario
  // Actualmente solo imprime en consola el id
  // En una aplicación real aquí se llamaría a la API
  const handleDelete = () => {
    console.log("Eliminar producto del inventario", item.id);
  };

  return (
    // Contenedor de los botones de acciones
    <div className="flex gap-2">

      {/* Botón editar */}
      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Pencil size={16} /> {/* Icono de editar */}
      </button>

      {/* Botón eliminar */}
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Trash2 size={16} /> {/* Icono de eliminar */}
      </button>

    </div>
  );
}
