import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Checkbox, Button } from "@/shared";
import { providerSchema } from "../schemas/providerSchema";


export default function ProviderCreateForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const documentTypes = [
        { value: "nit", label: "NIT" },
        { value: "cedula_ciudadania", label: "Cédula de ciudadanía" },
        { value: "cedula_extranjeria", label: "Cédula de extranjería" },
        { value: "permiso_permanencia", label: "Permiso de permanencia" },
        { value: "permiso_proteccion_temporal", label: "Permiso por protección temporal" },
];

    const providerProducts = [
        // { value: "entradas_refinadas", label: "Entradas Refinadas" },
        { value: "carpacio_pulpo", label: "Carpacio de pulpo" },
        { value: "tarta_atun_rojo", label: "Tarta de atún rojo" },
        { value: "esferas_foie_gras", label: "Esferas de foie gras" },
        { value: "cazuela_parisina", label: "Cazuela Parisina" },
        { value: "bistec_turco", label: "Bistec turco" },
        // { value: "finales_dulces", label: "Finales Dulces" },
        { value: "souffle_grand_marnier", label: "Souffle de la grand marmier" },
        { value: "sinfonia_chocolate", label: "Sinfonía de chocolate" },
];

    const [formData, setFormData] = useState({
        providerDocumentType: "",
        providerDocumentNumber: "",
        providerName: "",
        providerObservations: "",
        providerProducts: "",
        providerPhone: "",
        providerEmail: "",
        providerAddress: "",
        providerStatus: true,
});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
        
        const handleSubmit = (e) => {
    e.preventDefault();

    const result = providerSchema.safeParse(formData);

    if (!result.success) {
        const fieldErrors = {};

        result.error.issues.forEach((issue) => {
            fieldErrors[issue.path[0]] = issue.message;
        });

        setErrors(fieldErrors);
        return;
    }

    setErrors({});
    alert("Proveedor creado correctamente");
    console.log("Proveedor creado:", result.data);
};
    return (
        <section className="max-w-7xl mx-auto px-8 pt-40 pb-10">
            <div className="mb-6 justify-between items-center">
                <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Atrás
                </Button>
            </div>
            <div className="rounded-3xl border border-brand bg-black p-10">
                <h1 className="mb-8 text-2xl font-bold text-white">
                    Registrar proveedores
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-12 md:grid-cols-3"
                >
                    <div className="flex flex-col gap-4">
                        {/* columna izquierda */}
                        <Select
                            label="Tipo de documento"
                            name="providerDocumentType"
                            value={formData.providerDocumentType}
                            onChange={handleChange}
                            options={documentTypes}
                            error={errors.providerDocumentType}
                                               
                        />

                        <Input
                            label="Número documento"
                            name="providerDocumentNumber"
                            value={formData.providerDocumentNumber}
                            onChange={handleChange}
                            placeholder="Número documento"
                            error={errors.providerDocumentNumber}                         
                        />

                        <Input
                            label="Nombre completo"
                            name="providerName"
                            value={formData.providerName}
                            onChange={handleChange}
                            placeholder="Nombre completo"
                            error={errors.providerName}
                        />

                        <Input
                            label="Observaciones"
                            name="providerObservations"
                            value={formData.providerObservations}
                            onChange={handleChange}
                            placeholder="Observaciones"
                            error={errors.providerObservations}
                        />

                        <Select
                            label="Productos que suministra"
                            name="providerProducts"
                            value={formData.providerProducts}
                            onChange={handleChange}
                            options={providerProducts}
                            error={errors.providerProducts}                         
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* columna centro */}
                        <Input
                            label="Número de contacto"
                            name="providerPhone"
                            value={formData.providerPhone}
                            onChange={handleChange}
                            placeholder="Número de contacto"
                            error={errors.providerPhone}
                        />

                        <Input
                            label="Correo electrónico empresa"
                            name="providerEmail"
                            value={formData.providerEmail}
                            onChange={handleChange}
                            placeholder="Correo electrónico empresa"
                            error={errors.providerEmail}
                        />
                            
                        <Input
                            label="Dirección"
                            name="providerAddress"
                            value={formData.providerAddress}
                            onChange={handleChange}
                            placeholder="Dirección"
                            error={errors.providerAddress}
                        />
                            
                        <Checkbox
                            id="providerStatus"
                            name="providerStatus"
                            label="Estado del proveedor"
                            checked={formData.providerStatus}
                            onChange={handleChange}                                         
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* columna derecha */}
                        
                            
                        <Button type="button" variant="secondary">
                            Visualizar Lista Proveedores
                        </Button>
                            
                        <Button type="submit" variant="primary">
                            Crear proveedor
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
