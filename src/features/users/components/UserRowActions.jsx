// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";

import { IconButton } from "@/shared";

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
  if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.userName}?`)) {
    alert("Usuario eliminado con éxito");
  }
};

  // Acción para ver el usuario
  const handleView = () => {
    navigate(`/dashboard/userview/${user.id}`);
  };

  return (
     <div className="flex gap-2">
       {/* Botón ver */}
       <IconButton
         onClick={handleView}
         className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition"
       >
         <Eye size={16} />
       </IconButton>
 
       {/* Botón editar */}
       <IconButton
         onClick={handleEdit}
         className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition"
       >
         <Pencil size={16} />
       </IconButton>
 
       {/* Botón eliminar */}
       <IconButton
         onClick={handleDelete}
         className="bg-[var(--color-error)] text-[var(--color-text-inverse)] hover:bg-[var(--color-error-hover)] transition"
       >
         <Trash2 size={16} />
       </IconButton>
     </div>
   );
}