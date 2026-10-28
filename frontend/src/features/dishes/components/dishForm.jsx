// src/features/menu/components/DishForm.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button, Input, Select, FileInput } from "@/shared";
import { getDishCategories } from "../../../services/selectService"; 
import { dishSchema } from "../schemas/dishSchema"; 
import { createDish } from "../services/dishServices";

import { 
  showSuccessAlert, 
  showCancelAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";

export default function DishForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        categoria: "",
        descripcion: "",
        userImage: [],
    });

    useEffect(() => {
        getDishCategories().then(setCategories);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = dishSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);

            await showUserErrorAlert({
                title: "Error al registrar platillo",
                text: "Por favor, completa correctamente todos los campos obligatorios.",
            });

            return;
        }

        setErrors({});

        try {
            const response = await createDish(result.data);
            console.log("¡Éxito! Platillo creado:", response);

            await showSuccessAlert({
                title: "Platillo agregado",
                text: "El platillo se ha registrado correctamente.",
                timer: 2000,
            });

            navigate(-1);
        } catch (error) {
            console.error(error);
            setErrors({ submit: "Error interno al procesar el plato" });

            await showUserErrorAlert({
                title: "Error interno",
                text: "No se pudo registrar el platillo en el servidor.",
            });
        }
    };

    const handleCancel = async () => {
        const result = await showCancelAlert({
            title: "¿Deseas cancelar?",
            text: "Los datos ingresados no se guardarán.",
            timer: 3000,
        });

        if (result.isConfirmed) {
            navigate(-1);
        }
    };

    return (
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-6">
            
            {/* Header superior */}
            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={handleCancel}
                    className="!w-auto flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                </Button>
                <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] text-right">
                    Registrar platillo
                </h1>
            </div>

            {/* Tarjeta contenedora */}
            <div className="bg-[var(--color-background-inverse)] p-6 sm:p-10 rounded-3xl border border-[var(--color-brand)] shadow-2xl"> 

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    
                    {/* Columna 1: Campos de texto */}
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Nombre"
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            placeholder="Ingresa el nombre del platillo"
                            onChange={handleChange}
                            error={errors.nombre}
                        />
                        <Input
                            label="Precio"
                            name="precio"
                            type="text"
                            value={formData.precio}
                            placeholder="Ej. 8.5"
                            onChange={handleChange}
                            error={errors.precio}
                        />
                        <Select
                            label="Categoría"
                            name="categoria"
                            value={formData.categoria}
                            options={categories}
                            placeholder="Selecciona una categoría"
                            onChange={handleChange}
                            error={errors.categoria}
                        />
                        <Input
                            label="Descripción"
                            name="descripcion"
                            type="text"
                            value={formData.descripcion}
                            placeholder="Ingresa una breve descripción"
                            onChange={handleChange}
                            error={errors.descripcion}
                        />
                    </div>

                    {/* Columna 2: Carga de archivo y botones */}
                    <div className="flex flex-col justify-between gap-6">
                        <div className="flex flex-col items-start gap-2 w-full">
                            <span className="text-[var(--color-text-inverse)] text-sm font-medium font-[var(--font-heading)]">
                                Imagen del platillo
                            </span>

                            <FileInput 
                                className="border-[var(--color-brand)]/30 w-full"
                                value={formData.userImage}
                                onChange={(files) => 
                                    setFormData((prev) => ({ ...prev, userImage: files }))
                                }
                                multiple={true}
                            />

                            {errors.userImage && (
                                <span className="text-[var(--color-error)] text-xs">
                                    {errors.userImage}
                                </span>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col gap-3 w-full pt-4">
                            <Button 
                                variant="secondary" 
                                type="button" 
                                size="md"
                                onClick={handleCancel}
                                className="w-full"
                            >
                                Cancelar
                            </Button>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                size="md"
                                className="w-full"
                            >
                                Agregar
                            </Button>
                        </div>

                    </div>
                </form>
            </div>
        </section>
    );
}
