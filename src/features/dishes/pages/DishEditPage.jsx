import { useState } from "react";
import DishEditContent from "../components/DishEditContent";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import { ArrowLeft } from "lucide-react";

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

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    alert("¡Cambios aplicados con éxito!");
    navigate(-1);
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

      {/* Formulario */}
      <DishEditContent
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
