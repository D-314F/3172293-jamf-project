// src/features/menu/pages/DishViewPage.jsx

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import DishViewContent from "../components/DishViewContent";

export default function DishViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock temporal de datos del platillo (en el futuro vendrá de API o estado global)
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
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-6">
      {/* Header superior alineado con la tarjeta */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] text-right">
          Visualizar Platillo
        </h1>
      </div>

      {/* Contenido del Platillo */}
      <DishViewContent dish={dish} />
    </section>
  );
}
