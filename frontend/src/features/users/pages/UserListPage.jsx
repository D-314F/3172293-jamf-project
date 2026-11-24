import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileSpreadsheet, UserPlus, Filter, RotateCcw } from "lucide-react";
import { DataTable, Button } from "@/shared";
import { UserColumns } from "../table/UserColumns";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { getUsers } from "../services/userServices";
import { hasPermission } from "@/features/permissions/services/permissionServices";

export default function UserListPage() {
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canCreate, setCanCreate] = useState(false);
  const [canReport, setCanReport] = useState(false);

  // Filtros requeridos por RFADMIN05 / RFADMIN06
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchUsersAndPerms = async () => {
      try {
        const [data, createPerm, reportPerm] = await Promise.all([
          getUsers(),
          hasPermission("create_users"),
          hasPermission("report_users"),
        ]);
        setUsers(Array.isArray(data) ? data : []);
        setCanCreate(createPerm);
        setCanReport(reportPerm);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndPerms();
  }, []);

  // Sincroniza en tiempo real cuando se cambia el switch de un usuario en la tabla
  useEffect(() => {
    const handleStatusUpdated = (event) => {
      const { id, isActive } = event.detail;
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === id ? { ...u, isActive, is_active: isActive } : u
        )
      );
    };

    window.addEventListener("jamf:user-status-updated", handleStatusUpdated);
    return () => {
      window.removeEventListener("jamf:user-status-updated", handleStatusUpdated);
    };
  }, []);

  // Lista única de roles disponibles para el selector de filtro
  const availableRoles = useMemo(() => {
    const roles = new Set(
      users.map((u) => u.userRole).filter((role) => Boolean(role))
    );
    return ["Administrador", "Cajero", "Mesero", "Cocinero", "Pendiente", ...roles].filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }, [users]);

  // Filtrado por Rol + Estado y ordenamiento alfabético por Nombre Completo
  const filteredAndSortedUsers = useMemo(() => {
    return [...users]
      .filter((user) => {
        const matchesRole =
          roleFilter === "ALL" ||
          String(user.userRole || "").toLowerCase() === roleFilter.toLowerCase();

        const isUserActive = Boolean(user.isActive ?? user.is_active);
        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "ACTIVE" && isUserActive) ||
          (statusFilter === "INACTIVE" && !isUserActive);

        return matchesRole && matchesStatus;
      })
      .sort((a, b) =>
        String(a.userName || "").localeCompare(String(b.userName || ""), "es", {
          sensitivity: "base",
        })
      );
  }, [users, roleFilter, statusFilter]);

  const hasActiveFilters = roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-6">
      {/* Header M3 con subtítulo e íconos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Listado de Usuarios
          </h1>
          <p className="text-medium text-[var(--color-text-muted)]">
            Administración de personal, roles y cuentas registradas (orden alfabético A–Z)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-4">
          {canReport && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Reportar usuarios
            </Button>
          )}

          {canCreate && (
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/dashboard/userCreate")}
            >
              <UserPlus className="w-4 h-4" />
              Crear usuario
            </Button>
          )}
        </div>
      </div>

      {/* Contenedor Principal de Filtros + Tabla */}
      <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/50 shadow-2xl p-4 sm:p-6 md:p-8 space-y-5 overflow-hidden">
        {/* Barra de Filtros por Rol y Estado */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]/60">
          <div className="flex items-center gap-2 text-small font-[var(--font-label)] text-[var(--color-brand)]">
            <Filter className="w-4 h-4" />
            <span>Filtros rápidos (Nombre y Documento en el buscador):</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro por Rol con flecha a 16px */}
            <div className="relative flex items-center">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filtrar por rol"
                className="min-h-[48px] bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] rounded-xl pl-3.5 pr-10 py-2 text-medium font-[var(--font-label)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
              >
                <option value="ALL">Rol: Todos</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    Rol: {role}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 pointer-events-none text-[var(--color-text-inverse)] flex items-center justify-center opacity-70">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
            </div>

            {/* Filtro por Estado con flecha a 16px */}
            <div className="relative flex items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filtrar por estado"
                className="min-h-[48px] bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] rounded-xl pl-3.5 pr-10 py-2 text-medium font-[var(--font-label)] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
              >
                <option value="ALL">Estado: Todos</option>
                <option value="ACTIVE">Estado: Activo</option>
                <option value="INACTIVE">Estado: Inactivo</option>
              </select>
              <div className="absolute right-4 pointer-events-none text-[var(--color-text-inverse)] flex items-center justify-center opacity-70">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setRoleFilter("ALL");
                  setStatusFilter("ALL");
                }}
                className="inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2 rounded-xl text-medium font-medium text-[var(--color-brand)] bg-[var(--color-brand)]/10 hover:bg-[var(--color-brand)]/20 border border-[var(--color-brand)]/30 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-[var(--color-text-inverse)] text-center py-8 text-body">
            Cargando usuarios de la base de datos...
          </p>
        ) : (
          <DataTable data={filteredAndSortedUsers} columns={UserColumns} />
        )}
      </div>

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        users={filteredAndSortedUsers}
      />
    </section>
  );
}