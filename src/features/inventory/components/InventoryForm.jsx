import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import { inventorySchema } from "../schemas/inventorySchema";

export default function InventoryForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        marca: "",
        cantidad: "",
        codigo: "",
        cantidadTotal: "",
        nombre: "",
        cantidadMinima: "",
        codigoBarras: "",
        valorUnitario: "",
        cuentadante: "",
        valorTotal: "",
    });

    const [errors, setErrors] = useState({});

    const marcas = [
        { value: "alain Miliat", label: "Jugos" },
        { value: "neuhaus", label: "Chocolate" },
        { value: "tartuflanghe", label: "Trufas" },
        { value: "caviaroli", label: "Caviar" },
        { value: "jean Leon", label: "Vino" },
    ];

    const cuentadantes = [
        { value: "julian ramiros", label: "Julian Ramiros" },
        { value: "karen cardona vicente", label: "Karen Cardona Vicente" },
        { value: "paola garcia", label: "Paola García" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = inventorySchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};

            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        console.log("Inventario creado:", result.data);
        alert("Inventario registrado correctamente");
    };

    return (
        <div className="max-w-6xl mx-auto px-8 pt-28 pb-12">
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

            {/* Tarjeta */}
            <div className="bg-black rounded-3xl border border-brand  shadow-2xl pl-10">
                <h1 className="text-title font-heading mb-8 text-2xl font-bold text-amber-50 pt-8">
                    Crear Inventario
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between gap-10">
                        {/* Formulario */}
                        <div className="grid grid-cols-2 gap-6 pt-10">
                            <Select
                                label="Marca"
                                name="marca"
                                value={formData.marca}
                                options={marcas}
                                onChange={handleChange}
                                error={errors.marca}
                            />

                            <Input
                                label="Cantidad"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                error={errors.cantidad}
                            />

                            <Input
                                label="ID (Código único)"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                error={errors.codigo}
                            />

                            <Input
                                label="Cantidad total"
                                name="cantidadTotal"
                                value={formData.cantidadTotal}
                                onChange={handleChange}
                                error={errors.cantidadTotal}
                            />

                            <Input
                                label="Nombre completo"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                error={errors.nombre}
                            />

                            <Input
                                label="Cantidad mínima"
                                name="cantidadMinima"
                                value={formData.cantidadMinima}
                                onChange={handleChange}
                                error={errors.cantidadMinima}
                            />

                            <Input
                                label="Código de barras"
                                name="codigoBarras"
                                value={formData.codigoBarras}
                                onChange={handleChange}
                                error={errors.codigoBarras}
                            />

                            <Input
                                label="Valor unitario"
                                name="valorUnitario"
                                value={formData.valorUnitario}
                                onChange={handleChange}
                                error={errors.valorUnitario}
                            />

                            <Select
                                label="Cuentadante"
                                name="cuentadante"
                                value={formData.cuentadante}
                                options={cuentadantes}
                                onChange={handleChange}
                                error={errors.cuentadante}
                            />

                            <Input
                                label="Valor total"
                                name="valorTotal"
                                value={formData.valorTotal}
                                onChange={handleChange}
                                error={errors.valorTotal}
                            />
                        </div>
                    </div>

                    {/* Botón */}
                    <div className="flex justify-end mt-8 p-6">
                        <Button
                            variant="primary"
                            type="submit"
                        >
                            Siguiente
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}