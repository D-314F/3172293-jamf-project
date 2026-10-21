import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { INITIAL_ORDERS } from "../data/ordersData";
import { showUserErrorAlert } from "@/shared/services/alertService";
import EditOrderContent from "../components/EditOrderContent";

export default function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = INITIAL_ORDERS.find((item) => item.id === id) || null;
  const isLocked = order?.estado === "Pagada" || order?.estado === "Cancelada";

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
    console.log("Orden actualizada con éxito:", data);
  };

  if (!order || isLocked) return null;

  return (
    <section className="w-full">
      <EditOrderContent
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
    </section>
  );
}