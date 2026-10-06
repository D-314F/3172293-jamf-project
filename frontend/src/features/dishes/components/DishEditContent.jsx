import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, Input, Button, Checkbox, FileInput } from "@/shared";
import dishCategories from "../../../data/selects/dishCategories.json";
import { dishSchema } from "../schemas/dishSchema";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService"; 


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
      return;
    }

    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        console.log("Datos del platillo válidos:", formData);
      }

      await showSuccessAlert({
        title: "Platillo actualizado",
        text: "Los cambios se guardaron correctamente.",
        timer: 2000,
      });

      navigate(-1);
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Error al actualizar el platillo" });
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
    <section className="p-4 sm:p-8 space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-black)] rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 border border-[var(--color-brand)]">
          
          {/* Título */}
          <div className="sm:col-span-2 flex items-center justify-center mb-4">
            <span
              className="font-[var(--font-heading)] text-[var(--text-display)]"
              style={{ color: "var(--color-text-inverse)" }}
            >
              Editar platillo
            </span>
          </div>

          {/* Campos principales */}
          <div className="flex flex-col gap-4">
            <Input
              label="Nombre del platillo"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="dishName"
              value={formData?.dishName || ""}
              onChange={handleChange}
              placeholder="Nombre del platillo"
              error={errors.dishName}
            />

            <Input
              label="Precio"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="dishPrice"
              value={formData?.dishPrice || ""}
              onChange={handleChange}
              placeholder="Ej. 8.5"
              error={errors.dishPrice}
            />

            <Select
              label="Categoría"
              labelClassName="text-[var(--color-text-inverse)]"
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
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="dishDescription"
              value={formData?.dishDescription || ""}
              onChange={handleChange}
              placeholder="Descripción"
              error={errors.dishDescription}
            />
          </div>

          {/* Imagen y acciones */}
          <div className="flex flex-col items-center justify-center gap-6">
            <FileInput
              label="Imagen del platillo"
              labelClassName="text-[var(--color-text-inverse)]"
              value={formData.dishImage}
              onChange={(files) =>
                setFormData((prev) => ({ ...prev, dishImage: files }))
              }
              multiple={false}
            />

            <Checkbox
              id="isActive"
              name="isActive"
              label="Estado del platillo"
              checked={Boolean(formData?.isActive)}
              onChange={handleChange}
            />

            <div className="w-full flex flex-col gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={handleCancel}
                className="bg-[var(--color-secondary-950)] text-[var(--color-text-inverse)] font-[var(--font-heading)] px-4 py-2 rounded-md hover:bg-[var(--color-error-hover)] transition w-full"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[var(--color-brand)] text-[var(--color-text-primary)] font-[var(--font-heading)] px-4 py-2 rounded-md hover:bg-[var(--color-brand-hover)] transition w-full"
              >
                Aplicar cambios
              </Button>

              
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}