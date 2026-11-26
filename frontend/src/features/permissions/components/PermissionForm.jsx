import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, UserCheck, Save, CheckSquare } from "lucide-react";
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

        if (Array.isArray(myPermsData) && myPermsData.length > 0) {
          setActorPermissionIds(
            new Set(myPermsData.map((p) => Number(p.permission_id)))
          );
        } else {
          setActorPermissionIds(
            new Set(catalog.map((p) => Number(p.permission_id)))
          );
        }

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
        individualUser: "",
      });
      return;
    }

    if (name === "individualUser") {
      setFormData({
        userGroup: "",
        individualUser: value,
      });
      return;
    }
  };

  const getListPermissionId = (codename) => {
    const parts = codename.split("_");
    if (parts.length < 2) return null;

    const action = parts[0];
    const module = parts.slice(1).join("_");

    if (action === "list") return null;

    const listPerm = allPermissions.find(
      (p) => p.permission_codename === `list_${module}`
    );
    return listPerm ? Number(listPerm.permission_id) : null;
  };

  const handleCheckboxChange = (permissionId) => {
    const numericId = Number(permissionId);
    if (!actorPermissionIds.has(numericId)) {
      return;
    }

    setSelectedIds((prev) => {
      const updated = new Set(prev);

      if (updated.has(numericId)) {
        updated.delete(numericId);
      } else {
        updated.add(numericId);

        const perm = allPermissions.find((p) => Number(p.permission_id) === numericId);
        if (perm) {
          const listId = getListPermissionId(perm.permission_codename);
          if (listId && actorPermissionIds.has(listId)) {
            updated.add(listId);
          }
        }
      }

      return updated;
    });
  };

  const groupedPermissions = useMemo(() => {
    return Object.entries(
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
  }, [allPermissions]);

  const assignablePermissions = useMemo(() => {
    return allPermissions.filter((p) =>
      actorPermissionIds.has(Number(p.permission_id))
    );
  }, [allPermissions, actorPermissionIds]);

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

  const selectedGroupObj = groups.find(
    (g) => String(g.group_id) === String(formData.userGroup)
  );
  const selectedUserObj = users.find(
    (u) => String(u.id) === String(formData.individualUser)
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full"
    >
      {/* Columna izquierda */}
      <div className="flex flex-col gap-6 w-full lg:w-[35%]">
        <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/50 rounded-3xl p-6 sm:p-7 flex flex-col gap-6 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--color-border)]/50 pb-3">
              <Shield className="w-5 h-5 text-[var(--color-brand)] shrink-0" />
              <h2 className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                Grupo de usuarios
              </h2>
            </div>
            <Select
              label="Grupo usuario"
              htmlFor="perm-userGroup"
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

          <div className="border-t border-[var(--color-border)]/50 pt-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--color-border)]/50 pb-3">
              <UserCheck className="w-5 h-5 text-[var(--color-brand)] shrink-0" />
              <h2 className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                Usuario individual
              </h2>
            </div>
            <Select
              label="Usuario individual"
              htmlFor="perm-individualUser"
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

          {!loading && (selectedGroupObj || selectedUserObj) && (
            <div className="rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-brand)]/30 p-4 space-y-1">
              <p className="text-caption uppercase tracking-wider font-[var(--font-heading)] text-[var(--color-brand)]">
                Objetivo en edición
              </p>
              <p className="text-medium font-semibold text-[var(--color-text-inverse)]">
                {selectedGroupObj
                  ? `Rol / Grupo: ${selectedGroupObj.group_name}`
                  : `Usuario: ${selectedUserObj.userName || selectedUserObj.userEmail}`}
              </p>
              <p className="text-caption text-[var(--color-text-muted)]">
                {selectedIds.size} de {allPermissions.length} permisos marcados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex-1 bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 text-[var(--color-text-inverse)] w-full">
        {loading ? (
          <p className="text-center text-body text-[var(--color-text-muted)] py-8">
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
                <div className="border-t border-[var(--color-border)]/50 my-6" />
              )}
            </div>
          ))
        )}

        {/* Botones de Acción MD3 */}
        <div className="pt-6 border-t border-[var(--color-border)]/50 flex flex-col-reverse sm:flex-row justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={loading || saving}
            onClick={handleToggleAllPermissions}
            className="w-full sm:w-auto sm:min-w-[168px]"
          >
            <CheckSquare className="w-4 h-4" />
            {allSelected ? "Desmarcar todos" : "Activar todos"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleCancel}
            className="w-full sm:w-auto sm:min-w-[140px]"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={saving || loading}
            className="w-full sm:w-auto sm:min-w-[180px]"
          >
            <Save className="w-4 h-4" />
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
      <h3 className="text-[var(--color-brand)] text-subtitle font-[var(--font-heading)] mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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