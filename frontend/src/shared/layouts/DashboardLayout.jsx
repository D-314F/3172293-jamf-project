import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import authBg from "@/assets/images/bf-2.png";
import { Navbar } from "@/shared";
import Footer from "./Footer";
import { SessionTimeout } from "@/features/auth";
import { hasPermission } from "@/features/permissions/services/permissionServices";
import { showOpsAlert } from "@/shared/services/alertService";

// Rutas públicas del dashboard (para comensales/visitantes)
const PUBLIC_DASHBOARD_PATHS = ["/dashboard", "/dashboard/home", "/dashboard/menu"];

// Relación entre cada ruta del sistema y su permiso en PostgreSQL
function getRequiredPermission(pathname) {
  // Usuarios
  if (pathname === "/dashboard/userList") return "list_users";
  if (pathname === "/dashboard/userCreate") return "create_users";
  if (pathname.startsWith("/dashboard/userview/")) return "view_users";
  if (pathname.startsWith("/dashboard/userEdit/")) return "update_users";

  // Platillos
  if (pathname === "/dashboard/dishList") return "list_dishes";
  if (pathname === "/dashboard/dishCreate") return "create_dishes";
  if (pathname.includes("/dashboard/dishes/") && pathname.endsWith("/view")) return "view_dishes";
  if (pathname.includes("/dashboard/dishes/") && pathname.endsWith("/edit")) return "update_dishes";

  // Órdenes
  if (pathname === "/dashboard/orderList") return "list_orders";
  if (pathname === "/dashboard/orders/create" || pathname === "/dashboard/OrderForm") return "create_orders";
  if (pathname.startsWith("/dashboard/orders/detail/")) return "view_orders";
  if (pathname.startsWith("/dashboard/orders/edit/")) return "update_orders";

  // Proveedores
  if (pathname === "/dashboard/providerList") return "list_providers";
  if (pathname === "/dashboard/providerCreate") return "create_providers";
  if (pathname.startsWith("/dashboard/providerView/")) return "view_providers";
  if (pathname.startsWith("/dashboard/providerEdit/")) return "update_providers";

  // Inventario
  if (pathname === "/dashboard/inventoryList") return "list_inventory";
  if (pathname === "/dashboard/createInventory") return "create_inventory";
  if (pathname.includes("/dashboard/inventory/") && pathname.endsWith("/view")) return "view_inventory";
  if (pathname.includes("/dashboard/inventory/") && pathname.endsWith("/edit")) return "update_inventory";

  // Módulo de Permisos
  if (pathname === "/dashboard/permissions") return "create_users";

  return null;
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [checkingPermission, setCheckingPermission] = useState(false);

  const isPublicPath =
    PUBLIC_DASHBOARD_PATHS.includes(location.pathname) ||
    location.pathname.startsWith("/dashboard/menu/view/");

  useEffect(() => {
    let isMounted = true;

    const verifyRouteAccess = async () => {
      if (!token || isPublicPath) return;

      const requiredPerm = getRequiredPermission(location.pathname);
      if (!requiredPerm) return;

      try {
        setCheckingPermission(true);
        const granted = await hasPermission(requiredPerm);

        if (isMounted && !granted) {
          await showOpsAlert({
            title: "Acceso restringido",
            text: `No cuentas con el permiso requerido (${requiredPerm}) para acceder a esta sección.`,
          });
          navigate("/dashboard/home", { replace: true });
        }
      } catch (error) {
        console.error("Error verificando permiso de ruta:", error);
      } finally {
        if (isMounted) setCheckingPermission(false);
      }
    };

    verifyRouteAccess();
    return () => {
      isMounted = false;
    };
  }, [location.pathname, token, isPublicPath, navigate]);

  // Si no hay token e intenta entrar a un módulo privado, redirige al login
  if (!token && !isPublicPath) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Control de cierre automático tras 10 minutos de inactividad (RNF09) */}
      <SessionTimeout />

      <Navbar />

      <main className="flex-grow ">
        {!checkingPermission && <Outlet />}
      </main>

      <Footer />
    </div>
  );
}