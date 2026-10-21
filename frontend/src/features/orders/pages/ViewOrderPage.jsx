// src/features/orders/pages/ViewOrderPage.jsx

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import OrderDetail from "../components/OrderDetail";
import { INITIAL_ORDERS } from "../data/ordersData";

export default function ViewOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = INITIAL_ORDERS.find((o) => o.id === id);

  if (!order) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 text-center text-[var(--color-text-inverse)]">
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
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-4">
     
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

      {/* Detalle de la orden */}
      <OrderDetail
        order={order}
        onBack={() => navigate("/dashboard/orderList")}
        onEdit={() => navigate(`/dashboard/orders/edit/${order.id}`)}
      />
    </section>
  );
}