import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { inventoryUltimosSchema } from "../schemas/inventoryUltimosSchema";

export default function InventoryUltimosPasos() {
    const navigate = useNavigate();
    const location = useLocation();

    const datosAnteriores = location.state?.formData || {};

    const [formData, setFormData] = useState({
        lote: "",
        descripcion: "",
        fechaVencimiento: "",
        ubicacion: "",
        comentarioProducto: "",
        ...datosAnteriores,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const result = inventoryUltimosSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return null;
        }

        setErrors({});
        return result.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = validateForm();
        if (!data) return;

        try {
            setLoading(true);
            console.log("Inventario final:", data);
            alert("Inventario registrado correctamente");
            navigate("/inventario");
        } catch (error) {
            console.error(error);
            alert("Error al crear inventario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('/tu-fondo.jpg')] bg-cover bg-center">
            <div className="max-w-6xl mx-auto px-8 pt-28 pb-12">

                {/* BOTÓN SALIR */}
                <div className="flex justify-start mb-4">
                    <Button
                        type="button"
                        className="border bg-[var(--color-error)] text-[var(--color-text-primary)] px-8 py-2 rounded font-[var(--font-heading)] border-[var(--color-error)] ml-6"
                    >
                        Salir
                    </Button>
                </div>

                {/* CAJA PRINCIPAL */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-[var(--color-background-inverse)]/90 backdrop-blur-md p-8 rounded-xl m-4 border border-[var(--color-brand)]"
                >
                    {/* TÍTULO */}
                    <h1 className="text-[var(--text-title)] font-[var(--font-heading)] text-[var(--color-text-inverse)] mb-6">
                        Crear Inventario
                    </h1>

                    {/* INPUTS MÁS JUNTOS */}
                    <div className="grid grid-cols-2 gap-1 mb-12 max-w-3x1 pl-3">
                        <Input
                            label="Lote"
                            name="lote"
                            value={formData.lote}
                            onChange={handleChange}
                            error={errors.lote}
                            className="bg-[var(--color-surface-light)] border border-[var(--color-brand)] rounded text-[var(--text-base)]"
                        />

                        <Input
                            label="Descripción"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            error={errors.descripcion}
                            className="bg-[var(--color-surface-light)] border border-[var(--color-brand)] rounded text-[var(--text-base)]"
                        />

                        <Input
                            label="Ubicación"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            error={errors.ubicacion}
                            className="bg-[var(--color-surface-light)] border border-[var(--color-brand)] rounded text-[var(--text-base)]"
                        />

                        <div className="col-span-2">
                            <Input
                                label="Comentario del producto"
                                name="comentarioProducto"
                                value={formData.comentarioProducto}
                                onChange={handleChange}
                                error={errors.comentarioProducto}
                                className="bg-[var(--color-surface-light)] border border-[var(--color-brand)] rounded text-[var(--text-base)]"
                            />
                        </div>
                    </div>

                    {/* BOTÓN SIGUIENTE */}
                    <div className="flex justify-end mt-8">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="border bg-[var(--color-brand)] text-[var(--color-text-primary)] px-8 py-2 rounded font-[var(--font-heading)]"
                        >
                            {loading ? "Creando..." : "Siguiente"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
