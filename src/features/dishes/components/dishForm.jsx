import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";

import { getDishCategories } from "../../../services/selectService"; 
import { dishSchema } from "../../users/schemas/dishSchema"; 

export default function DishForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        categoria: "",
        descripcion: "",
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
            setFormData({ nombre: "", precio: "", categoria: "", descripcion: "" });
        } catch (error) {
            console.error(error);
            setErrors({ submit: "Error interno al procesar el plato" });
        }
    };

    return (
        /* Ajuste Clave: Quitamos el mt-12 que solo afectaba a la tarjeta y usamos "pt-16". 
          Esto empuja TODO el conjunto (Botón de atrás y tarjeta) hacia abajo en bloque, 
          respetando la franja invisible del menú superior de tu LT.
        */
        <div className="max-w-3xl mx-auto px-8 pt-28 pb-12">
            
            {/* Botón Atrás - Ahora bajará junto con todo el bloque */}
            <div className="flex justify-start mb-6">
                <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                  Atrás
                </Button>
            </div>

            {/* Tarjeta contenedora con degradado */}
           <div className="bg-linear-to-r from-brand to-surface p-10 rounded-3xl border border-border shadow-2xl">                
                <h1 className="text-title font-heading text-text-primary mb-8 text-2xl font-bold">
                    Agregar Platillo
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campos de texto apilados verticalmente */}
                    <div className="max-w-md flex flex-col gap-4">
                        <Input
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            placeholder="Nombre del platillo"
                            onChange={handleChange}
                            error={errors.nombre}
                        />
                        <Input
                            name="precio"
                            type="text"
                            value={formData.precio}
                            placeholder="Precio"
                            onChange={handleChange}
                            error={errors.precio}
                        />
                        <Select
                            name="categoria"
                            value={formData.categoria}
                            options={categories}
                            placeholder="Seleccione una opción"
                            onChange={handleChange}
                            error={errors.categoria}
                        />
                        <Input
                            name="descripcion"
                            type="text"
                            value={formData.descripcion}
                            placeholder="Descripción"
                            onChange={handleChange}
                            error={errors.descripcion}
                        />
                    </div>

                    {/* Botón "Agregar" en la esquina inferior derecha */}
                    <div className="flex justify-end mt-8">
                        <div className="w-full md:w-48">
                            <Button variant="primary" type="submit" size="md">
                                Agregar
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}