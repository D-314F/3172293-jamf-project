import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import { ArrowLeft } from "lucide-react";
import DishViewContent from "../components/DishViewContent";

export default function DishViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔥 Simulación de datos (luego lo conectas a tu API)
  const dish = {
    id,
    nombre: "Soufflé Grand Marnier",
    categoria: "Postres",
    precio: "8.5",
    descripcion: "Postre ligero con notas cítricas y licor Grand Marnier.",
    activo: true,
    imagen: "/ruta/imagen.png",
  };

  return (
    <section className="p-4 sm:p-8 space-y-6">
      {/* Botón Volver */}
      <div className="w-fit mb-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Atrás
        </Button>
      </div>

      <DishViewContent dish={dish} />
    </section>
  );
}
