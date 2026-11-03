import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import OrderDetail from "../components/OrderDetail";
import { getOrderById } from "../services/orderServices";

export default function ViewOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Error al obtener la orden:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-10 text-center text-[var(--color-text-inverse)]">
        Cargando información de la orden...
      </section>
    );
  }

  if (!order) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-10 text-center text-[var(--color-text-inverse)]">
        <h2 className="text-xl font-bold mb-4 font-[var(--font-heading)]">
          Orden #{id} no encontrada
        </h2>
        <Button variant="secondary" onClick={() => navigate("/dashboard/orderList")}>
          Volver al listado
        </Button>
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
      </div>

      <OrderDetail
        order={order}
        onBack={() => navigate("/dashboard/orderList")}
        onEdit={() => navigate(`/dashboard/orders/edit/${order.id}`)}
      />
    </section>
  );
}