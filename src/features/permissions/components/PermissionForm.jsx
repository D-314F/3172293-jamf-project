import { useState } from "react";
import Select from "@/shared/components/Select";
import Checkbox from "@/shared/components/Checkbox";

export default function PermissionForm() {
  const [formData, setFormData] = useState({
    permissions: {},
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked,
      },
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-10">
      {/* Columna izquierda */}
      <div className="flex flex-col gap-6 w-full lg:w-[35%] lg:ml-2">
        <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl p-6">
          <h2 className="text-[var(--color-text-inverse)] font-[var(--font-heading)] mb-4">
            Grupo usuarios
          </h2>
          <Select
            label="Grupo usuario"
            options={[{ value: "admin", label: "Administradores" }]}
          />
        </div>

        <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl p-6">
          <h2 className="text-[var(--color-text-inverse)] font-[var(--font-heading)] mb-4">
            Usuario individual
          </h2>
          <Select
            label="Usuario individual"
            options={[{ value: "may", label: "May" }]}
          />
        </div>
      </div>

      {/* Columna derecha (contenedor de permisos) */}
      <div className="flex-1 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl p-8 shadow-lg space-y-8 text-white">
        <PermissionGroup
          title="Gestión de usuarios"
          permissions={[
            "Crear usuarios",
            "Visualizar usuarios",
            "Listar usuarios",
            "Actualizar usuarios",
            "Activar/Desactivar usuarios",
            "Generar reportes de usuarios",
          ]}
          formData={formData}
          handleChange={handleChange}
        />
        <div className="border-t border-[var(--color-brand)]"></div>

        <PermissionGroup
          title="Gestión de platillos"
          permissions={[
            "Crear platillos",
            "Visualizar platillos",
            "Listar platillos",
            "Actualizar platillos",
            "Activar/Desactivar platillos",
            "Generar reportes de material de consumo",
          ]}
          formData={formData}
          handleChange={handleChange}
        />
        <div className="border-t border-[var(--color-brand)]"></div>

        <PermissionGroup
          title="Gestión de inventario"
          permissions={[
            "Crear inventario",
            "Visualizar inventario",
            "Listar inventario",
            "Actualizar inventario",
            "Activar/Desactivar inventario",
            "Generar reportes de inventario",
          ]}
          formData={formData}
          handleChange={handleChange}
        />
        <div className="border-t border-[var(--color-brand)]"></div>

        <PermissionGroup
          title="Gestión de orden"
          permissions={[
            "Crear orden",
            "Visualizar orden",
            "Listar orden",
            "Actualizar orden",
            "Generar reportes de orden",
          ]}
          formData={formData}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}

function PermissionGroup({ title, permissions, formData, handleChange }) {
  return (
    <div>
      <h3 className="text-[var(--color-brand)] font-[var(--font-heading)] mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {permissions.map((perm, index) => (
          <Checkbox
            key={perm}
            id={`${title}-${index}`}
            name={perm}
            label={perm}
            checked={Boolean(formData.permissions[perm])}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}
