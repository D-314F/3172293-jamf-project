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
        userImage: [], // 👈 Se agrega el estado inicial para la imagen
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
        <div className="max-w-4xl mx-auto px-8 pt-28 pb-12">
            
            {/* Botón Atrás */}
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

            {/* Tarjeta contenedora */}
            <div className="bg-black p-10 rounded-3xl border border-brand"> 

                <h1 className="text-title font-heading text-white mb-8 text-2xl font-bold">
                    Agregar Platillo
                </h1>

                {/* Formulario reorganizado en 2 columnas */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Campos del formulario */}
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

                    {/*+ FileInput arriba y Botón abajo */}
                    <div className="flex flex-col items-center justify-between h-full pt-2">
                        
                        {/* Carga de Imagen */}
                        <div className="flex flex-col items-center gap-3 w-full">
                            <span className="text-amber-50 text-sm font-medium self-start md:self-center">
                                Imagen del platillo
                            </span>

                            <FileInput 
                                className="border-white"
                                value={formData.userImage}
                                onChange={(files) => 
                                    setFormData((prev) => ({ ...prev, userImage: files }))
                                }
                                multiple={true}
                            />

                            {errors.userImage && (
                                <span className="text-red-500 text-sm">{errors.userImage}</span>
                            )}
                        </div>

                        {/* Botón "Agregar" en la esquina inferior derecha */}
                        <div className="w-full flex justify-end mt-8">
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