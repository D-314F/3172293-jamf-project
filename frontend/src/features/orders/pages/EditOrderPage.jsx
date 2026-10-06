import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { INITIAL_ORDERS } from "../data/ordersData";
import { showUserErrorAlert } from "@/shared/services/alertService";
import EditOrderContent from "../components/EditOrderContent";

export default function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // "order" se calcula directamente en cada render a partir del id de la URL,
  // no necesita vivir en un useState.
  const order = INITIAL_ORDERS.find((item) => item.id === id) || null;
  const isLocked = order?.estado === "Pagada" || order?.estado === "Cancelada";

  // El useEffect solo se usa para los efectos secundarios reales:
  // mostrar una alerta y navegar.
  useEffect(() => {
    if (!order) {
      showUserErrorAlert({
        title: "Orden no encontrada",
        text: `La orden ${id} no existe en el sistema.`,
      }).then(() => navigate("/dashboard/orderList"));
      return;
    }

    if (isLocked) {
      showUserErrorAlert({
        title: "Operación no permitida",
        text: `La orden ${order.id} se encuentra en estado '${order.estado}' y no puede ser modificada.`,
      }).then(() => navigate(-1));
    }
  }, [id, order, isLocked, navigate]);

  const handleSubmit = async (data) => {
    // Aquí puedes realizar el dispatch a tu store o llamada a la API
    console.log("Orden actualizada con éxito:", data);
  };

  // Mientras se redirige (orden inexistente o bloqueada), no renderizamos nada
  if (!order || isLocked) return null;

  return (
    <EditOrderContent
      // El key={id} fuerza a React a reiniciar el estado interno del formulario
      // cada vez que cambias de orden, sin necesidad de sincronizarlo a mano.
      key={id}
      initialFormData={{
        id: order.id || "",
        tableNumber: order.mesa ?? "",
        waiterId: order.mesero || "",
        estado: order.estado || "",
        isActive: order.isActive ?? true,
        observations: order.observations || "",
      }}
      onSubmit={handleSubmit}
    />
  );
}