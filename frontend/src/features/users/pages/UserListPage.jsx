import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileSpreadsheet, UserPlus } from "lucide-react";
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

  useEffect(() => {
    const fetchUsersAndPerms = async () => {
      try {
        const [data, createPerm, reportPerm] = await Promise.all([
          getUsers(),
          hasPermission("create_users"),
          hasPermission("report_users"),
        ]);
        setUsers(data);
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

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-6">
      {/* Header M3 con subtítulo e íconos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Listado de Usuarios
          </h1>
          <p className="text-medium text-[var(--color-text-muted)]">
            Administración de personal, roles y cuentas registradas
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
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

      {/* Tabla */}
      <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/50 shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
        {loading ? (
          <p className="text-[var(--color-text-inverse)] text-center py-8 text-body">
            Cargando usuarios de la base de datos...
          </p>
        ) : (
          <DataTable data={users} columns={UserColumns} />
        )}
      </div>

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}