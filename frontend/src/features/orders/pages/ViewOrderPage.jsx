

// src/features/orders/pages/ViewOrderPage.jsx

import { useParams, useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button";
import OrderDetail from "../components/OrderDetail";
import { INITIAL_ORDERS } from "../data/ordersData";

export default function ViewOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Obtención directa de la orden por ID
  const order = INITIAL_ORDERS.find((o) => o.id === id);

  if (!order) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 text-center text-[var(--color-text-primary)]">
        <h2 className="text-xl font-bold mb-4">Orden #{id} no encontrada</h2>
        <Button variant="secondary" onClick={() => navigate("/dashboard/orderList")}>
          Volver al listado
        </Button>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
      
      {/* Header superior con botón de navegación y título */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
        >
          Atrás
        </Button>
        {/* <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] text-right">
          Detalle de la Orden #{order.id}
        </h1> */}
      </div>

      {/* Componente de Detalle */}
      <OrderDetail
        order={order}
        onBack={() => navigate("/dashboard/orderList")}
        onEdit={() => navigate(`/dashboard/orders/edit/${order.id}`)}
      />

    </section>
  );
}
