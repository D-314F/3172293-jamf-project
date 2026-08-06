// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";

// Hook de React Router para navegar programáticamente entre rutas
import { useNavigate } from "react-router-dom";

// Componente que renderiza las acciones de cada fila de usuario
// Recibe como prop el objeto user
export default function UserRowActions({ user }) {
  const navigate = useNavigate();

  // Acción para editar el usuario
  const handleEdit = () => {
    navigate(`/dashboard/userEdit/${user.id}`);
  };

  // Acción para eliminar el usuario
  const handleDelete = () => {
    console.log("Eliminar usuario", user.id);
  };

  // Acción para ver el usuario
  const handleView = () => {
    navigate(`/dashboard/userview/${user.id}`);
  };

  return (
    // Contenedor de los botones de acciones
    <div className="flex gap-2">
      {/* Botón ver */}
      <button
        onClick={handleView}
        className="p-1 rounded hover:bg-[var(--color-brand-soft)] transition-colors duration-200"
        title="Ver usuario"
      >
        <Eye size={16} color="var(--color-text-primary)" />
      </button>

      {/* Botón editar */}
      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors duration-200"
        title="Editar usuario"
      >
        <Pencil size={16} color="var(--color-text-primary)" />
      </button>

      {/* Botón eliminar */}
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-[var(--color-error)] transition-colors duration-200"
        title="Eliminar usuario"
      >
        <Trash2 size={16} color="var(--color-text-primary)" />
      </button>
    </div>
  );
}
