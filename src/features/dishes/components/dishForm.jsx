import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import FileInput from "../../../shared/components/FileInput";

import { getDishCategories } from "../../../services/selectService"; 
import { dishSchema } from "../schemas/dishSchema"; 

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
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = dishSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            console.log("¡Éxito! Platillo creado:", result.data);
            alert("¡Platillo agregado correctamente!");
            setFormData({ nombre: "", precio: "", categoria: "", descripcion: "", userImage: [] });
        } catch (error) {
            console.error(error);
            setErrors({ submit: "Error interno al procesar el plato" });
        }
    };

    return (
        /* Padding fluido: pequeño en móvil (px-4, pt-20), amplio en desktop (sm:px-6 md:px-8 md:pt-28) */
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-12">
            
            {/* Header con Botón Atrás integrado alineado al título */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Atrás
                </Button>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-inverse)]">
                    Registrar platillo
                </h1>
            </div>

            {/* Tarjeta contenedora con padding adaptativo */}
            <div className="bg-[var(--color-background-inverse)] p-5 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-lg"> 

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    
                    {/* Columna 1: Campos de texto */}
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Nombre"
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            placeholder="Nombre del platillo"
                            onChange={handleChange}
                            error={errors.nombre}
                        />
                        <Input
                            label="Precio"
                            name="precio"
                            type="text"
                            value={formData.precio}
                            placeholder="Precio"
                            onChange={handleChange}
                            error={errors.precio}
                        />
                        <Select
                            label="Categoría"
                            name="categoria"
                            value={formData.categoria}
                            options={categories}
                            placeholder="Seleccione una opción"
                            onChange={handleChange}
                            error={errors.categoria}
                        />
                        <Input
                            label="Descripción"
                            name="descripcion"
                            type="text"
                            value={formData.descripcion}
                            placeholder="Descripción"
                            onChange={handleChange}
                            error={errors.descripcion}
                        />
                    </div>

                    {/* Columna 2: Carga de archivo y botón de envío */}
                    <div className="flex flex-col justify-between gap-6">
                        <div className="flex flex-col items-start md:items-center gap-3 w-full">
                            <span className="text-[var(--color-text-inverse)] text-sm font-[var(--font-label)]">
                                Imagen del platillo
                            </span>

                            <FileInput 
                                className="border-[var(--color-border)] w-full"
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

                        {/* Botón adaptativo: Ancho completo en móvil, auto en desktop */}
                        <div className="w-full flex justify-end pt-2">
                            <div className="w-full md:w-48">
                                <Button variant="primary" type="submit" size="md">
                                    Agregar
                                </Button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}