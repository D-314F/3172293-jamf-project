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
  LogOut,
  ShieldCheck,
  ChevronRight,
  Home,
  LayoutGrid,
  X,
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
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const [allowedModules, setAllowedModules] = useState({
    users: false,
    dishes: false,
    orders: false,
    providers: false,
    inventory: false,
    permissions: false,
  });

  useEffect(() => {
    setIsMobileSheetOpen(false);
  }, [location.pathname]);

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
    setIsMobileSheetOpen(false);
    const result = await showConfirmDeleteAlert({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar tu sesión actual en el sistema?",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      sessionStorage.removeItem("token");
      setProfile(null);
      setIsProfileOpen(false);
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

  const firstName = profile?.userName?.trim()
    ? profile.userName.trim().split(/\s+/)[0]
    : "Perfil";
  const initials = getUserInitials(profile?.userName || "");

  const adminModuleItems = [
    allowedModules.users && {
      label: "Usuarios",
      to: "/dashboard/userList",
      icon: Users,
    },
    allowedModules.dishes && {
      label: "Platillos",
      to: "/dashboard/dishList",
      icon: UtensilsCrossed,
    },
    allowedModules.orders && {
      label: "Órdenes",
      to: "/dashboard/orderList",
      icon: Logs,
    },
    allowedModules.providers && {
      label: "Proveedores",
      to: "/dashboard/providerList",
      icon: Truck,
    },
    allowedModules.inventory && {
      label: "Inventario",
      to: "/dashboard/inventoryList",
      icon: Boxes,
    },
    allowedModules.permissions && {
      label: "Permisos",
      to: "/dashboard/permissions",
      icon: ShieldCheck,
    },
  ].filter(Boolean);

  const isHomeActive = location.pathname === "/dashboard/home";
  const isMenuActive = location.pathname === "/dashboard/menu";
  const isOrdersActive = location.pathname.startsWith("/dashboard/order");
  const isModuleRouteActive =
    location.pathname.startsWith("/dashboard/user") ||
    location.pathname.startsWith("/dashboard/dish") ||
    location.pathname.startsWith("/dashboard/provider") ||
    location.pathname.startsWith("/dashboard/inventory") ||
    location.pathname.startsWith("/dashboard/permissions");

  return (
    <>
      {/* BARRA SUPERIOR */}
      <nav className="w-full bg-[var(--color-brand)] border-b-2 border-[var(--color-background-inverse)] text-[var(--color-text-primary)]">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2 sm:gap-4 h-14 md:h-16">
            {/* 1. Logos independientes (Izquierda) */}
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
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

              <span className="h-6 sm:h-9 w-[2px] bg-[var(--color-background-inverse)] rounded-full" />

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

            {/* 3. Acciones Derecha */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[var(--color-background-inverse)]/40 text-[var(--color-text-primary)] hover:bg-[var(--color-background-inverse)]/10 transition-all duration-200 active:scale-95"
                  >
                    Iniciar sesión
                  </Link>

                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-1 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-[var(--color-background-inverse)] text-[var(--color-brand)] shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <span>Registrarse</span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>

                  <span className="hidden md:inline-block h-6 w-[1.5px] bg-[var(--color-background-inverse)]/25 rounded-full mx-0.5" />
                </>
              ) : (
                profile && (
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    title="Ver mi perfil"
                    className="inline-flex items-center gap-2 p-1 pr-3 rounded-full bg-[var(--color-background-inverse)] text-[var(--color-brand)] shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-full bg-[var(--color-brand)] text-[var(--color-text-primary)] flex items-center justify-center text-xs font-bold">
                      {initials}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text-inverse)] max-w-[95px] sm:max-w-[110px] truncate">
                      {firstName}
                    </span>
                  </button>
                )
              )}

              {/* Dropdown Menu Hamburguesa (Solo Desktop) */}
              <div className="relative hidden md:block">
                <Dropdown className="z-15">
                  <DropdownTrigger>
                    <IconButton ariaLabel="Abrir menú de navegación">
                      <Menu />
                    </IconButton>
                  </DropdownTrigger>

                  <DropdownContent>
                    <DropdownItem>
                      <Link
                        to="/dashboard/menu"
                        className="flex items-center gap-3 w-full text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition"
                      >
                        <BookOpen size={18} className="text-[var(--color-brand)] shrink-0" />
                        <span>Ver Menú</span>
                      </Link>
                    </DropdownItem>

                    {isAuthenticated && allowedModules.users && (
                      <DropdownItem>
                        <Link
                          to="/dashboard/userList"
                          className="flex items-center gap-3 w-full text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition"
                        >
                          <Users size={18} className="text-[var(--color-brand)] shrink-0" />
                          <span>Gestionar Usuarios</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.dishes && (
                      <DropdownItem>
                        <Link
                          to="/dashboard/dishList"
                          className="flex items-center gap-3 w-full text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition"
                        >
                          <UtensilsCrossed size={18} className="text-[var(--color-brand)] shrink-0" />
                          <span>Gestionar Platillos</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.orders && (
                      <DropdownItem>
                        <Link
                          to="/dashboard/orderList"
                          className="flex items-center gap-3 w-full text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition"
                        >
                          <Logs size={18} className="text-[var(--color-brand)] shrink-0" />
                          <span>Gestionar Órdenes</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.providers && (
                      <DropdownItem>
                        <Link
                          to="/dashboard/providerList"
                          className="flex items-center gap-3 w-full text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition"
                        >
                          <Truck size={18} className="text-[var(--color-brand)] shrink-0" />
                          <span>Gestionar Proveedores</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.inventory && (
                      <DropdownItem>
                        <Link
                          to="/dashboard/inventoryList"
                          className="flex items-center gap-3 w-full text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition"
                        >
                          <Boxes size={18} className="text-[var(--color-brand)] shrink-0" />
                          <span>Gestionar Inventario</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && allowedModules.permissions && (
                      <DropdownItem>
                        <Link
                          to="/dashboard/permissions"
                          className="flex items-center gap-3 w-full text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition"
                        >
                          <ShieldCheck size={18} className="text-[var(--color-brand)] shrink-0" />
                          <span>Gestionar Permisos</span>
                        </Link>
                      </DropdownItem>
                    )}

                    {isAuthenticated && (
                      <>
                        <hr className="border-[var(--color-border)]/15 my-1" />
                        <DropdownItem onClick={handleLoginRedirect}>
                          <div className="flex items-center gap-3 w-full text-left text-[var(--color-brand)] hover:opacity-80 font-semibold transition cursor-pointer">
                            <LogIn size={18} className="shrink-0" />
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

      {/* PANEL TÁCTIL INFERIOR DE MÓDULOS EN MOBILE */}
      {isMobileSheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden flex flex-col justify-end pb-24 px-3"
          onClick={() => setIsMobileSheetOpen(false)}
        >
          <div
            className="w-full max-w-md mx-auto bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/40 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/15">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-inverse)] font-[var(--font-heading)]">
                  Módulos del Sistema POS
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Selecciona un área de gestión
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {adminModuleItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {adminModuleItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileSheetOpen(false)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all active:scale-95 ${
                        active
                          ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] border-[var(--color-brand)] font-bold shadow-md"
                          : "bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] border-[var(--color-border)]/15 hover:border-[var(--color-brand)]/40"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          active ? "text-[var(--color-text-primary)]" : "text-[var(--color-brand)]"
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-semibold truncate">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)] text-center py-3">
                Tu cuenta actual tiene acceso de consulta a la carta gastronómica.
              </p>
            )}
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR FLOTANTE EN MOBILE */}
      <div className="fixed bottom-3 inset-x-3 z-50 md:hidden pointer-events-none">
        <div className="max-w-md mx-auto bg-[var(--color-background-inverse)]/95 backdrop-blur-md border border-[var(--color-brand)]/40 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around pointer-events-auto">
          {/* 1. Inicio */}
          <Link
            to="/dashboard/home"
            className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              isHomeActive
                ? "text-[var(--color-brand)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)]"
            }`}
          >
            {isHomeActive && (
              <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]" />
            )}
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Inicio</span>
          </Link>

          {/* 2. Carta / Menú */}
          <Link
            to="/dashboard/menu"
            className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              isMenuActive
                ? "text-[var(--color-brand)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)]"
            }`}
          >
            {isMenuActive && (
              <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]" />
            )}
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Menú</span>
          </Link>

          {/* 3. Órdenes (Acceso directo si tiene permiso) */}
          {isAuthenticated && allowedModules.orders && (
            <Link
              to="/dashboard/orderList"
              className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                isOrdersActive
                  ? "text-[var(--color-brand)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)]"
              }`}
            >
              {isOrdersActive && (
                <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]" />
              )}
              <Logs className="w-5 h-5" />
              <span className="text-[11px] font-semibold mt-1">Órdenes</span>
            </Link>
          )}

          {/* 4. Módulos POS (Si está autenticado) */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setIsMobileSheetOpen((prev) => !prev)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all cursor-pointer ${
                isMobileSheetOpen || isModuleRouteActive
                  ? "text-[var(--color-brand)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)]"
              }`}
            >
              {(isMobileSheetOpen || isModuleRouteActive) && (
                <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]" />
              )}
              <LayoutGrid className="w-5 h-5" />
              <span className="text-[11px] font-semibold mt-1">Módulos</span>
            </button>
          )}

          {/* 5. Salir (si está autenticado) o Ingresar (si es visitante) */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl text-[var(--color-error)] hover:opacity-85 transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[11px] font-semibold mt-1">Salir</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-[11px] font-semibold mt-1">Ingresar</span>
            </Link>
          )}
        </div>
      </div>

      {/* Card Modal con la información del perfil */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        allowedModules={allowedModules}
        onLogout={handleLoginRedirect}
        onProfileUpdated={setProfile}
      />
    </>
  );
}