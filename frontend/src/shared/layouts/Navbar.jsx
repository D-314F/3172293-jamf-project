import { useState, useEffect } from "react";
import { 
  Menu, 
  Users, 
  BookOpen, 
  UtensilsCrossed,
  Logs, 
  Truck, 
  Boxes, 
  LogIn,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import {
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/shared";
import logo from "@/assets/images/1-logo.png";
import logo2 from "@/assets/images/2-logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Importamos alertas, permisos y servicio de perfil
import { showOpsAlert, showConfirmDeleteAlert } from "@/shared/services/alertService";
import { hasPermission } from "@/features/permissions/services/permissionServices";
import { getProfile, getUserInitials } from "@/features/auth/services/authService";
import UserProfileModal from "@/features/auth/components/UserProfileModal";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [allowedModules, setAllowedModules] = useState({
    users: false,
    dishes: false,
    orders: false,
    providers: false,
    inventory: false,
    permissions: false,
  });

  // Consultar perfil y qué módulos puede ver el usuario logueado
  useEffect(() => {
    let isMounted = true;

    const loadUserContext = async () => {
      if (!isAuthenticated) {
        if (isMounted) {
          setProfile(null);
          setAllowedModules({
            users: false,
            dishes: false,
            orders: false,
            providers: false,
            inventory: false,
            permissions: false,
          });
        }
        return;
      }

      try {
        const [profileData, users, dishes, orders, providers, inventory, createUsers] =
          await Promise.all([
            getProfile().catch(() => null),
            hasPermission("list_users"),
            hasPermission("list_dishes"),
            hasPermission("list_orders"),
            hasPermission("list_providers"),
            hasPermission("list_inventory"),
            hasPermission("create_users"),
          ]);

        if (isMounted) {
          setProfile(profileData);
          setAllowedModules({
            users,
            dishes,
            orders,
            providers,
            inventory,
            permissions: users && createUsers,
          });
        }
      } catch (error) {
        console.error("Error verificando permisos y perfil:", error);
      }
    };

    loadUserContext();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, location.pathname]);

  const handleLoginRedirect = async () => {
    const result = await showConfirmDeleteAlert({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar tu sesión actual en el sistema?",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      sessionStorage.removeItem("token");
      setProfile(null);
      navigate("/login", { replace: true });
    }
  };

  const handleCursosClick = (e) => {
    e.preventDefault();
    showOpsAlert({
      title: "Ops, hubo un error",
      text: "El módulo de Cursos no está disponible en este momento.",
    });
  };

  const handleMultimediaClick = (e) => {
    e.preventDefault();
    showOpsAlert({
      title: "Ops, hubo un error",
      text: "No se pudieron cargar los recursos multimedia del sistema.",
    });
  };

  const handleContactoClick = (e) => {
    e.preventDefault();
    showOpsAlert({
      title: "Ops, hubo un error",
      text: "El servicio de contacto no responde. Inténtalo más tarde.",
    });
  };

  const firstName = profile?.userName ? profile.userName.split(" ")[0] : "Perfil";
  const initials = getUserInitials(profile?.userName || "");

  return (
    <>
      <nav className="w-full bg-[var(--color-brand)] border-b-2 border-[var(--color-background-inverse)] text-[var(--color-text-primary)]">
        <div className="mx-auto max-w-7xl px-4 py-2">
          
          {/* FILA PRINCIPAL */}
          <div className="flex items-center justify-between gap-4 h-14 md:h-16">

            {/* 1. Logos independientes (Izquierda) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <a
                href="https://senarisaraldadosquebradas.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Centro de Formación SENA Dosquebradas"
                className="inline-flex items-center transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <img
                  src={logo2}
                  alt="Logo SENA"
                  className="h-7 sm:h-10 object-contain"
                />
              </a>

              <span className="h-7 sm:h-9 w-[2px] bg-[var(--color-background-inverse)] rounded-full" />

              <Link
                to="/dashboard/home"
                title="Ir al Inicio - JAMF"
                className="inline-flex items-center transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <img
                  src={logo}
                  alt="Logo JAMF"
                  className="h-7 sm:h-10 object-contain"
                />
              </Link>
            </div>

            {/* 2. Links de navegación centrados (Solo Desktop) */}
            <ul className="hidden md:flex items-center gap-8 font-medium">
              <li>
                <Link
                  to="/dashboard/home"
                  className="hover:opacity-75 transition cursor-pointer font-semibold"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleCursosClick} 
                  className="hover:opacity-75 transition cursor-pointer font-semibold"
                >
                  Cursos
                </button>
              </li>
              <li>
                <button 
                  onClick={handleMultimediaClick} 
                  className="hover:opacity-75 transition cursor-pointer font-semibold"
                >
                  Multimedia
                </button>
              </li>
              <li>
                <button 
                  onClick={handleContactoClick} 
                  className="hover:opacity-75 transition cursor-pointer font-semibold"
                >
                  Contacto
                </button>
              </li>
            </ul>

            {/* 3. Acciones Derecha: Botones Auth o Chip de Perfil + Menú */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[var(--color-background-inverse)]/40 text-[var(--color-text-primary)] hover:bg-[var(--color-background-inverse)]/10 transition-all duration-200 active:scale-95"
                  >
                    Iniciar sesión
                  </Link>

                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-1 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-[var(--color-background-inverse)] text-[var(--color-brand)] shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <span>Registrarse</span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>

                  <span className="hidden sm:inline-block h-6 w-[1.5px] bg-[var(--color-background-inverse)]/25 rounded-full mx-0.5" />
                </>
              ) : (
                profile && (
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    title="Ver mi perfil"
                    className="inline-flex items-center gap-2 p-1 sm:pr-3 rounded-full bg-[var(--color-background-inverse)] text-[var(--color-brand)] shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-full bg-[var(--color-brand)] text-[var(--color-text-primary)] flex items-center justify-center text-xs font-bold">
                      {initials}
                    </span>
                    <span className="hidden sm:inline text-xs font-semibold text-[var(--color-text-inverse)] max-w-[110px] truncate">
                      {firstName}
                    </span>
                  </button>
                )
              )}

              {/* Dropdown Menu Hamburguesa */}
              <div className="relative">
                <Dropdown className="z-15">
                  <DropdownTrigger>
                    <IconButton ariaLabel="Abrir menú de navegación">
                      <Menu />
                    </IconButton>
                  </DropdownTrigger>

                  <DropdownContent className="w-60 p-2 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-xl">

                  {/* Card Modal con la información del perfil */}
                        <UserProfileModal
                          isOpen={isProfileOpen}
                          onClose={() => setIsProfileOpen(false)}
                          profile={profile}
                          allowedModules={allowedModules}
                          onLogout={handleLoginRedirect}
                        />

                    {/* Ver Menú (Siempre visible para clientes y empleados) */}
                    <DropdownItem>
                      <Link to="/dashboard/menu" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                        <BookOpen size={18} className="text-[var(--color-brand)]" />
                        <span>Ver Menú</span>
                      </Link>
                    </DropdownItem>

                    {/* Módulos administrativos según permisos del usuario logueado */}
                    {isAuthenticated && allowedModules.users && (
                      <DropdownItem>
                        <Link to="/dashboard/userList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                          <Users size={18} className="text-[var(--color-brand)]" />
                          <span>Gestionar Usuarios</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.dishes && (
                      <DropdownItem>
                        <Link to="/dashboard/dishList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                          <UtensilsCrossed size={18} className="text-[var(--color-brand)]" />
                          <span>Gestionar Platillo</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.orders && (
                      <DropdownItem>
                        <Link to="/dashboard/orderList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                          <Logs size={18} className="text-[var(--color-brand)]" />
                          <span>Gestionar Órdenes</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.providers && (
                      <DropdownItem>
                        <Link to="/dashboard/providerList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                          <Truck size={18} className="text-[var(--color-brand)]" />
                          <span>Gestionar Proveedores</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.inventory && (
                      <DropdownItem>
                        <Link to="/dashboard/inventoryList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                          <Boxes size={18} className="text-[var(--color-brand)]" />
                          <span>Gestionar Inventario</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.permissions && (
                      <DropdownItem>
                        <Link to="/dashboard/permissions" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                          <ShieldCheck size={18} className="text-[var(--color-brand)]" />
                          <span>Gestionar Permisos</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {/* Cerrar sesión */}
                    {isAuthenticated && (
                      <>
                        <hr className="border-gray-700 my-2" />
                        <DropdownItem onClick={handleLoginRedirect}>
                          <div className="flex items-center gap-3 w-full py-1 text-left text-[var(--color-brand)] hover:opacity-80 font-medium transition cursor-pointer">
                            <LogIn size={18} />
                            <span>Cerrar sesión</span>
                          </div>
                        </DropdownItem>
                      </>
                    )}
                  </DropdownContent>
                </Dropdown>
              </div>
            </div>

          </div>

        </div>
      </nav>

      {/* Card Modal con la información del perfil */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        allowedModules={allowedModules}
        onProfileUpdated={setProfile}
      />
    </>
  );
}