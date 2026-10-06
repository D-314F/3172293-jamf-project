import Swal from "sweetalert2";
import {
showConfirmDeleteAlert,
showSuccessAlert,
showCancelAlert,
showUserErrorAlert,
} from "@/shared/services/alertService";

export const handleCancelOrderProcess = async (order, onOrderCancelled) => {
// Error si está Pagada o ya Cancelada
if (order.estado === "Pagada" || order.estado === "Cancelada") {
await showUserErrorAlert({
    title: "No se puede anular la orden",
    text: `La orden ${order.id} se encuentra en estado '${order.estado}' y no puede ser modificada.`,
});
return;
}

// Criterio 2: Confirmación explícita para anular orden activa
const result = await showConfirmDeleteAlert({
title: `¿Anular orden ${order.id}?`,
text: "Esta acción cambiará el estado de la orden a Cancelada permanentemente.",
confirmButtonText: "Sí, anular",
cancelButtonText: "No, regresar",
});

if (result.isConfirmed) {
if (onOrderCancelled) {
    onOrderCancelled(order.id);
}

// Alerta de éxito al anular
await showSuccessAlert({
    title: "Orden Anulada",
    text: `La orden ${order.id} ha sido anulada exitosamente.`,
    timer: 2000,
});
} else if (result.dismiss === Swal.DismissReason.cancel) {
// Alerta al cancelar la acción (idéntica a la experiencia de Usuarios)
showCancelAlert({
    title: "Acción Cancelada",
    text: `La orden ${order.id} no sufrió ningún cambio.`,
});
}
};