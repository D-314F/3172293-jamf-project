import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import Select from "@/shared/components/Select";
import Checkbox from "@/shared/components/Checkbox";
import {
  showSuccessAlert,
  showCancelAlert,
  showUserErrorAlert,
  showConfirmDeleteAlert,
} from "@/shared/services/alertService";
import {
  getAllPermissions,
  getMyEffectivePermissions,
  getGroups,
  getGroupPermissions,
  updateGroupPermissions,
  getUserPermissions,
  updateUserPermissions,
} from "../services/permissionServices";
import { getUsers } from "@/features/users/services/userServices";

export default function PermissionForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userGroup: "",
    individualUser: "",
  });

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [actorPermissionIds, setActorPermissionIds] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Cargar grupos, usuarios, catálogo de permisos y permisos propios del administrador actual
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [permsData, groupsData, usersData, myPermsData] =
          await Promise.all([
            getAllPermissions(),
            getGroups(),
            getUsers(),
            getMyEffectivePermissions(),
          ]);

        const catalog = Array.isArray(permsData) ? permsData : [];
        setAllPermissions(catalog);
        setGroups(Array.isArray(groupsData) ? groupsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);

        // Regla 1.16: Permisos que posee actualmente el usuario que administra
        if (Array.isArray(myPermsData) && myPermsData.length > 0) {
          setActorPermissionIds(
            new Set(myPermsData.map((p) => Number(p.permission_id)))
          );
        } else {
          setActorPermissionIds(
            new Set(catalog.map((p) => Number(p.permission_id)))
          );
        }

        // Seleccionar el primer grupo por defecto (ej. Administrador)
        if (Array.isArray(groupsData) && groupsData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            userGroup: String(groupsData[0].group_id),
          }));
        }
      } catch (error) {
        console.error("Error al cargar datos de permisos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Cargar permisos asignados cuando cambia el grupo o el usuario seleccionado
  useEffect(() => {
    const fetchAssignedPermissions = async () => {
      try {
        if (formData.userGroup) {
          const groupPerms = await getGroupPermissions(formData.userGroup);
          setSelectedIds(new Set(groupPerms.map((p) => Number(p.permission_id))));
        } else if (formData.individualUser) {
          const userPerms = await getUserPermissions(formData.individualUser);
          setSelectedIds(new Set(userPerms.map((p) => Number(p.permission_id))));
        } else {
          setSelectedIds(new Set());
        }
      } catch (error) {
        console.error("Error al obtener permisos asignados:", error);
      }
    };

    fetchAssignedPermissions();
  }, [formData.userGroup, formData.individualUser]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    if (name === "userGroup") {
      setFormData({
        userGroup: value,
        individualUser: "", // Limpiar usuario individual al elegir un grupo
      });
      return;
    }

    if (name === "individualUser") {
      setFormData({
        userGroup: "", // Limpiar grupo al elegir un usuario individual
        individualUser: value,
      });
      return;
    }
  };

  const handleCheckboxChange = (permissionId) => {
    const numericId = Number(permissionId);
    // Regla 1.16: No permitir asignar o modificar permisos que el administrador actual no posee
    if (!actorPermissionIds.has(numericId)) {
      return;
    }

    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(numericId)) {
        updated.delete(numericId);
      } else {
        updated.add(numericId);
      }
      return updated;
    });
  };

  // Agrupar permisos dinámicamente por módulo (display_name de content_type)
  const groupedPermissions = Object.entries(
    allPermissions.reduce((acc, perm) => {
      const moduleTitle = perm.display_name || `${perm.app_label}`;
      if (!acc[moduleTitle]) acc[moduleTitle] = [];
      acc[moduleTitle].push(perm);
      return acc;
    }, {})
  ).map(([title, permissions]) => ({
    title,
    permissions,
  }));

  const assignablePermissions = allPermissions.filter((p) =>
    actorPermissionIds.has(Number(p.permission_id))
  );

  const allSelected =
    assignablePermissions.length > 0 &&
    assignablePermissions.every((p) =>
      selectedIds.has(Number(p.permission_id))
    );

  const handleToggleAllPermissions = async () => {
    const result = await showConfirmDeleteAlert({
      title: allSelected
        ? "¿Desmarcar todos los permisos?"
        : "¿Activar todos los permisos disponibles?",
      text: "Recuerda que para aplicar estos cambios debes darle al botón 'Guardar permisos'.",
      confirmButtonText: allSelected ? "Sí, desmarcar" : "Sí, activar todos",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      if (allSelected) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          assignablePermissions.forEach((p) =>
            next.delete(Number(p.permission_id))
          );
          return next;
        });
      } else {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          assignablePermissions.forEach((p) =>
            next.add(Number(p.permission_id))
          );
          return next;
        });
      }
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los permisos seleccionados no se guardarán.",
    });

    if (result.isConfirmed) {
      navigate("/dashboard/home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userGroup && !formData.individualUser) {
      await showUserErrorAlert({
        title: "Selección requerida",
        text: "Debes seleccionar al menos un grupo de usuarios o un usuario individual.",
      });
      return;
    }

    const targetLabel = formData.userGroup
      ? `el grupo "${groups.find((g) => String(g.group_id) === String(formData.userGroup))?.group_name || "seleccionado"}"`
      : `el usuario "${users.find((u) => String(u.id) === String(formData.individualUser))?.userName || "seleccionado"}"`;

    // Confirmación obligatoria antes de guardar cambios de permisos (Obs 1.11 y 2.5)
    const confirmSave = await showConfirmDeleteAlert({
      title: "¿Guardar cambios de permisos?",
      text: `Se actualizarán los permisos asignados para ${targetLabel}.`,
      confirmButtonText: "Sí, guardar permisos",
      cancelButtonText: "No, revisar",
    });

    if (!confirmSave.isConfirmed) {
      return;
    }

    try {
      setSaving(true);
      const permissionIds = Array.from(selectedIds);

      if (formData.userGroup) {
        await updateGroupPermissions(formData.userGroup, permissionIds);
      } else if (formData.individualUser) {
        await updateUserPermissions(formData.individualUser, permissionIds);
      }

      await showSuccessAlert({
        title: "Permisos actualizados",
        text: "La configuración de permisos se ha guardado correctamente.",
      });

      navigate("/dashboard/home");
    } catch (error) {
      console.error("Error guardando permisos:", error);
      await showUserErrorAlert({
        title: "Error al guardar",
        text:
          error.message ||
          "No se pudieron guardar los permisos. Intenta nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row items-start gap-8 w-full"
    >
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
              disabled={loading}
              options={groups.map((g) => ({
                value: String(g.group_id),
                label: g.group_name,
              }))}
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
              disabled={loading}
              options={users.map((u) => ({
                value: String(u.id),
                label: `${u.userName || u.user_name || u.userEmail} (${u.userRole || u.user_type || "Usuario"})`,
              }))}
            />
          </div>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex-1 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl p-6 sm:p-8 shadow-lg space-y-8 text-[var(--color-text-inverse)] w-full">
        {loading ? (
          <p className="text-center py-8 opacity-80">
            Cargando catálogo de permisos...
          </p>
        ) : (
          groupedPermissions.map((group, index) => (
            <div key={group.title} className="space-y-6">
              <PermissionGroup
                title={group.title}
                permissions={group.permissions}
                selectedIds={selectedIds}
                actorPermissionIds={actorPermissionIds}
                onToggle={handleCheckboxChange}
              />
              {index < groupedPermissions.length - 1 && (
                <div className="border-t border-[var(--color-brand)]/40 my-6" />
              )}
            </div>
          ))
        )}

        {/* Botones de Acción */}
        <div className="pt-6 border-t border-[var(--color-brand)]/40 flex flex-col-reverse sm:flex-row justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={loading || saving}
            onClick={handleToggleAllPermissions}
            className="w-full sm:w-44"
          >
            {allSelected ? "Desmarcar todos" : "Activar todos"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleCancel}
            className="w-full sm:w-40"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={saving || loading}
            className="w-full sm:w-48"
          >
            {saving ? "Guardando..." : "Guardar permisos"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function PermissionGroup({
  title,
  permissions,
  selectedIds,
  actorPermissionIds,
  onToggle,
}) {
  return (
    <div>
      <h3 className="text-[var(--color-brand)] text-lg font-semibold font-[var(--font-heading)] mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {permissions.map((perm) => {
          const permId = Number(perm.permission_id);
          const canAssign = actorPermissionIds.has(permId);
          return (
            <Checkbox
              key={perm.permission_id}
              id={perm.permission_codename}
              name={perm.permission_codename}
              label={
                canAssign
                  ? perm.permission_name
                  : `${perm.permission_name} (No disponible en tu rol)`
              }
              checked={selectedIds.has(permId)}
              disabled={!canAssign}
              onChange={() => onToggle(permId)}
            />
          );
        })}
      </div>
    </div>
  );
}
