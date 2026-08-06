import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import FileInput from "../../../shared/components/FileInput";
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
    userImage: [],
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
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-12">
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

      {/* Tarjeta con padding simétrico */}
      <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)] shadow-2xl p-8">
        <h1 className="text-[var(--text-title)] font-[var(--font-heading)] mb-8 text-[var(--color-text-inverse)]">
          Crear Inventario
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid de 3 Columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* 📍 Columna 1 */}
            <div className="flex flex-col gap-4">
              <Select
                label="Marca"
                name="marca"
                value={formData.marca}
                options={marcas}
                onChange={handleChange}
                error={errors.marca}
              />

              <Input
                label="ID (Código único)"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                error={errors.codigo}
              />

              <Input
                label="Nombre completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />

              <Input
                label="Código de barras"
                name="codigoBarras"
                value={formData.codigoBarras}
                onChange={handleChange}
                error={errors.codigoBarras}
              />

              <Select
                label="Cuentadante"
                name="cuentadante"
                value={formData.cuentadante}
                options={cuentadantes}
                onChange={handleChange}
                error={errors.cuentadante}
              />
            </div>

            {/* 📍 Columna 2 */}
            <div className="flex flex-col gap-4">
              <Input
                label="Cantidad"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                error={errors.cantidad}
              />

              <Input
                label="Cantidad total"
                name="cantidadTotal"
                value={formData.cantidadTotal}
                onChange={handleChange}
                error={errors.cantidadTotal}
              />

              <Input
                label="Cantidad mínima"
                name="cantidadMinima"
                value={formData.cantidadMinima}
                onChange={handleChange}
                error={errors.cantidadMinima}
              />

              <Input
                label="Valor unitario"
                name="valorUnitario"
                value={formData.valorUnitario}
                onChange={handleChange}
                error={errors.valorUnitario}
              />

              <Input
                label="Valor total"
                name="valorTotal"
                value={formData.valorTotal}
                onChange={handleChange}
                error={errors.valorTotal}
              />
            </div>

            {/* 📍 Columna 3: FileInput centrado */}
            <div className="flex flex-col items-center justify-center gap-3 pt-6">
              <span className="text-[var(--color-text-inverse)] text-[var(--text-small)] font-[var(--font-label)] self-start md:self-center">
                Imagen del producto
              </span>

              <FileInput
                className="border-[var(--color-border)]"
                value={formData.userImage}
                onChange={(files) =>
                  setFormData((prev) => ({ ...prev, userImage: files }))
                }
                multiple={true}
              />

              {errors.userImage && (
                <span className="text-[var(--color-error)] text-[var(--text-small)]">
                  {errors.userImage}
                </span>
              )}
            </div>
          </div>

          {/* Botón Submit al final de la tarjeta */}
          <div className="flex justify-end pt-4">
            <Button variant="primary" type="submit">
              Siguiente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
