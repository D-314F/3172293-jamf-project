// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";

import { IconButton } from "@/shared";

// Hook de React Router para navegar programáticamente entre rutas
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import {
  showConfirmDeleteAlert,
  showSuccessAlert,
  showCancelAlert,
} from "@/shared/services/alertService";

// Componente que renderiza las acciones de cada fila de usuario
// Recibe como prop el objeto user
export default function UserRowActions({ user }) {
  const navigate = useNavigate();

  // Acción para editar el usuario
  const handleEdit = () => {
    navigate(`/dashboard/userEdit/${user.id}`);
  };

  // Acción para eliminar el usuario
const handleDelete = async () => {
  const result = await showConfirmDeleteAlert({
    title: "¿Estás seguro?",
    text: `¿Deseas eliminar al usuario ${user.userName}?. 
    No podrás revertir esto.`,
  });

  if (result.isConfirmed) {

    // Alerta de éxito al eliminar
    await showSuccessAlert({
      title: "¡Eliminado!",
      text: `El usuario ${user.userName} fue eliminado con éxito.`,
    });
  } else if (result.dismiss === Swal.DismissReason.cancel) {

    // Alerta al cancelar la eliminación
    showCancelAlert({
      title: "Cancelado",
      text: `El usuario ${user.userName} no sufrió ningún cambio.`,
    });
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