import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showUserErrorAlert } from "@/shared/services/alertService";
import EditOrderContent from "../components/EditOrderContent";
import { getOrderById, updateOrder } from "../services/orderServices";

export default function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const alertShownRef = useRef(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);

        if (data.estado === "Pagada" || data.estado === "Cancelada") {
          if (!alertShownRef.current) {
            alertShownRef.current = true;
            await showUserErrorAlert({
              title: "Operación no permitida",
              text: `La orden #${data.id} se encuentra en estado '${data.estado}' y no puede ser modificada.`,
            });
            navigate("/dashboard/orderList", { replace: true });
          }
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error("Error al cargar la orden:", error);
        if (!alertShownRef.current) {
          alertShownRef.current = true;
          await showUserErrorAlert({
            title: "Orden no encontrada",
            text: `La orden #${id} no existe en el sistema.`,
          });
          navigate("/dashboard/orderList", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    await updateOrder(id, data);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--color-text-inverse)]">
        Cargando datos de la orden...
      </div>
    );
  }

  if (!order) return null;

  return (
    <section className="w-full">
      <EditOrderContent
        key={order.id}
        initialFormData={{
          id: order.id || "",
          tableNumber: String(order.mesa ?? ""),
          waiterId: order.mesero || "",
          estado: order.estado || "Pendiente",
          isActive: order.isActive ?? true,
          observations: order.observations || "",
        }}
        onSubmit={handleSubmit}
      />
    </section>
  );
}