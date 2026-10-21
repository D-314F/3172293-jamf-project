import { useState } from "react";
import Select from "@/shared/components/Select";
import Checkbox from "@/shared/components/Checkbox";

const PERMISSION_GROUPS = [
  {
    id: "users",
    title: "Gestión de usuarios",
    permissions: [
      { id: "create_users", label: "Crear usuarios" },
      { id: "view_users", label: "Visualizar usuarios" },
      { id: "list_users", label: "Listar usuarios" },
      { id: "update_users", label: "Actualizar usuarios" },
      { id: "toggle_users", label: "Activar/Desactivar usuarios" },
      { id: "report_users", label: "Generar reportes de usuarios" },
    ],
  },
  {
    id: "dishes",
    title: "Gestión de platillos",
    permissions: [
      { id: "create_dishes", label: "Crear platillos" },
      { id: "view_dishes", label: "Visualizar platillos" },
      { id: "list_dishes", label: "Listar platillos" },
      { id: "update_dishes", label: "Actualizar platillos" },
      { id: "toggle_dishes", label: "Activar/Desactivar platillos" },
      { id: "report_dishes", label: "Generar reportes de material de consumo" },
    ],
  },
  {
    id: "inventory",
    title: "Gestión de inventario",
    permissions: [
      { id: "create_inventory", label: "Crear inventario" },
      { id: "view_inventory", label: "Visualizar inventario" },
      { id: "list_inventory", label: "Listar inventario" },
      { id: "update_inventory", label: "Actualizar inventario" },
      { id: "toggle_inventory", label: "Activar/Desactivar inventario" },
      { id: "report_inventory", label: "Generar reportes de inventario" },
    ],
  },
  {
    id: "orders",
    title: "Gestión de orden",
    permissions: [
      { id: "create_orders", label: "Crear orden" },
      { id: "view_orders", label: "Visualizar orden" },
      { id: "list_orders", label: "Listar orden" },
      { id: "update_orders", label: "Actualizar orden" },
      { id: "report_orders", label: "Generar reportes de orden" },
    ],
  },
];

export default function PermissionForm() {
  const [formData, setFormData] = useState({
    userGroup: "",
    individualUser: "",
    permissions: {},
  });

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
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
    <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
      {/* Columna izquierda */}
      <div className="flex flex-col gap-6 w-full lg:w-[35%]">
        <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl p-6 flex flex-col gap-6 shadow-md">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-inverse)] font-[var(--font-heading)] mb-3">
              Grupo de usuarios
            </h2>
            <Select
              label="Grupo usuario"
              name="userGroup"
              value={formData.userGroup}
              onChange={handleSelectChange}
              options={[{ value: "admin", label: "Administradores" }]}
            />
          </div>

          <div className="border-t border-[var(--color-brand)]/30 pt-4">
            <h2 className="text-lg font-bold text-[var(--color-text-inverse)] font-[var(--font-heading)] mb-3">
              Usuario individual
            </h2>
            <Select
              label="Usuario individual"
              name="individualUser"
              value={formData.individualUser}
              onChange={handleSelectChange}
              options={[{ value: "may", label: "May" }]}
            />
          </div>
        </div>
      </div>

      {/* Columna derecha*/}
      <div className="flex-1 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl p-6 sm:p-8 shadow-lg space-y-8 text-[var(--color-text-inverse)] w-full">
        {PERMISSION_GROUPS.map((group, index) => (
          <div key={group.id} className="space-y-6">
            <PermissionGroup
              title={group.title}
              permissions={group.permissions}
              formData={formData}
              handleChange={handleCheckboxChange}
            />
            {index < PERMISSION_GROUPS.length - 1 && (
              <div className="border-t border-[var(--color-brand)]/40 my-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PermissionGroup({ title, permissions, formData, handleChange }) {
  return (
    <div>
      <h3 className="text-[var(--color-brand)] text-lg font-semibold font-[var(--font-heading)] mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {permissions.map((perm) => (
          <Checkbox
            key={perm.id}
            id={perm.id}
            name={perm.id}
            label={perm.label}
            checked={Boolean(formData.permissions[perm.id])}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}