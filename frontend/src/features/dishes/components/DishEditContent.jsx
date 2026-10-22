// src/features/menu/components/DishEditContent.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, Input, Button, Checkbox, FileInput } from "@/shared";
import dishCategories from "../../../data/selects/dishCategories.json";
import { dishSchema } from "../schemas/dishSchema";
import { 
  showSuccessAlert, 
  showCancelAlert,
  showUserErrorAlert 
} from "@/shared/services/alertService"; 

export default function DishEditContent({
  formData = {},
  setFormData,
  dish = {},
  onSubmit,
}) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adaptedData = {
      nombre: formData.dishName,
      precio: formData.dishPrice,
      categoria: formData.dishCategory || "",
      descripcion: formData.dishDescription,
    };

    const result = dishSchema.safeParse(adaptedData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName === "nombre") fieldErrors.dishName = issue.message;
        if (fieldName === "precio") fieldErrors.dishPrice = issue.message;
        if (fieldName === "categoria") fieldErrors.dishCategory = issue.message;
        if (fieldName === "descripcion") fieldErrors.dishDescription = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor, completa correctamente los campos del platillo.",
      });
      return;
    }

    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }

      await showSuccessAlert({
        title: "Platillo actualizado",
        text: "Los cambios se guardaron correctamente.",
        timer: 2000,
      });

      navigate(-1);
    } catch (error) {
      console.error(error);
      await showUserErrorAlert({
        title: "Error al actualizar",
        text: "No se pudieron guardar los cambios del platillo.",
      });
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios realizados no se guardarán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 gap-8 border border-[var(--color-brand)] shadow-2xl">
        
        {/* Campos principales */}
        <div className="flex flex-col gap-4">
          <Input
            label="Nombre del platillo"
            type="text"
            name="dishName"
            value={formData?.dishName || ""}
            onChange={handleChange}
            placeholder="Ingresa el nombre del platillo"
            error={errors.dishName}
          />

          <Input
            label="Precio"
            type="text"
            name="dishPrice"
            value={formData?.dishPrice || ""}
            onChange={handleChange}
            placeholder="Ej. 8.5"
            error={errors.dishPrice}
          />

          <Select
            label="Categoría"
            name="dishCategory"
            value={formData?.dishCategory || ""}
            options={dishCategories.map((cat) => ({
              value: cat.label,
              label: cat.label,
            }))}
            onChange={handleChange}
            error={errors.dishCategory}
          />

          <Input
            label="Descripción"
            type="text"
            name="dishDescription"
            value={formData?.dishDescription || ""}
            onChange={handleChange}
            placeholder="Ingresa la descripción"
            error={errors.dishDescription}
          />
        </div>

        {/* Imagen y acciones */}
        <div className="flex flex-col items-center justify-between gap-6">
          <FileInput
            label="Imagen del platillo"
            value={formData.dishImage}
            onChange={(files) =>
              setFormData((prev) => ({ ...prev, dishImage: files }))
            }
            multiple={false}
            className="border-[var(--color-brand)]/30 w-full"
          />

          <div className="flex items-center gap-2 self-start">
            <Checkbox
              id="isActive"
              name="isActive"
              label="Estado del platillo (Activo)"
              checked={Boolean(formData?.isActive)}
              onChange={handleChange}
            />
          </div>

          {/* Botones de acción */}
          <div className="w-full flex flex-col gap-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              className="w-full"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Aplicar cambios
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
