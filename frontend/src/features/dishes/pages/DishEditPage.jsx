// src/features/menu/pages/DishEditPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import DishEditContent from "../components/DishEditContent";

export default function DishEditPage({ dish = {} }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dishName: dish.name || "Soufflé Grand Marnier",
    dishPrice: dish.price || "8.5",
    dishCategory: dish.category || "Postres",
    dishDescription: dish.description || "Postre ligero con notas cítricas y licor Grand Marnier.",
    dishImage: dish.image || [],
    isActive: dish.active ?? true,
  });

  const handleSubmit = async (data) => {
    console.log("Guardando cambios en el servidor/estado:", data);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-6">
      {/* Header superior totalmente alineado con la tarjeta */}
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
          Editar Platillo
        </h1>
      </div>

      {/* Formulario */}
      <DishEditContent
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
