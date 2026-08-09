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
        return { ...datosAnteriores, ...result.data };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataFinal = validateForm();
        if (!dataFinal) return;

        try {
        setLoading(true);
        console.log("Inventario listo para guardar:", dataFinal);
        
        alert("¡Producto Creado Correctamente!");
        navigate("/dashboard/inventoryList");
        } catch (error) {
        console.error(error);
        alert("Error al registrar el producto");
        } finally {
        setLoading(false);
        }
    };

    const handleVolverAtras = () => {
        navigate("/dashboard/createInventory", {
        state: { formData: { ...datosAnteriores, ...formData } },
        });
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
        
        {/* Header en Blanco */}
        <div className="flex items-center justify-between gap-4 mb-6">
            <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={handleVolverAtras}
            >
            Atrás
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-white text-right">
            Crear Inventario - Últimos Pasos
            </h1>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-5 sm:p-8 md:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <Input
                label="Lote"
                name="lote"
                value={formData.lote}
                onChange={handleChange}
                error={errors.lote}
                />

                <Input
                label="Ubicación"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                error={errors.ubicacion}
                />

                {/* Input de fecha simple tipo texto con placeholder */}
                <Input
                label="Fecha de vencimiento"
                name="fechaVencimiento"
                placeholder="Ej: DD/MM/AAAA"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                error={errors.fechaVencimiento}
                />
                {/* Input nativo de fecha */}
                {/* <Input
                label="Fecha de vencimiento"
                type="date"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                error={errors.fechaVencimiento}
                /> */}

                <Input
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                error={errors.descripcion}
                />

                <div className="md:col-span-2">
                <Input
                    label="Comentario del producto"
                    name="comentarioProducto"
                    value={formData.comentarioProducto}
                    onChange={handleChange}
                    error={errors.comentarioProducto}
                />
                </div>
            </div>

            <div className="w-full flex justify-end gap-3 pt-6 border-t border-[var(--color-border)]/20">
                <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Creando..." : "Crear Inventario"}
                </Button>
            </div>

            </form>
        </div>
        </section>
    );
    }