import { Outlet, Navigate, useLocation } from "react-router-dom";
import authBg from "@/assets/images/bf-2.png";
import { Navbar } from "@/shared";
import Footer from "./Footer";
import { SessionTimeout } from "@/features/auth";

// Rutas del dashboard que un visitante puede ver sin haber iniciado sesión
const PUBLIC_DASHBOARD_PATHS = ["/dashboard", "/dashboard/home", "/dashboard/menu"];

export default function DashboardLayout() {
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  const isPublicPath =
    PUBLIC_DASHBOARD_PATHS.includes(location.pathname) ||
    location.pathname.startsWith("/dashboard/menu/view/");

  // Si no hay token e intenta entrar o devolverse con la flecha "Atrás" a un módulo privado, redirige al login
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
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}