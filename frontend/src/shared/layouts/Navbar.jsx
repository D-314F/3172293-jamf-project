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
  ChevronRight,
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
import { Link, useNavigate } from "react-router-dom";

// Importamos la alerta de error del servicio
import { showOpsAlert } from "@/shared/services/alertService";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    sessionStorage.removeItem("token");
    navigate("/login"); 
  };

  // Handlers para mostrar la alerta de error en las secciones solicitadas
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

  return (
    <nav className="w-full bg-[var(--color-brand)] border-b-2 border-[var(--color-background-inverse)] text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-2">
        
        {/* FILA PRINCIPAL */}
        <div className="flex items-center justify-between gap-4 h-14 md:h-16">

          {/* 1. Logos independientes (Izquierda) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Imagen SENA */}
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

            {/* Línea separadora */}
            <span
              className="h-7 sm:h-9 w-[2px] bg-[var(--color-background-inverse)] rounded-full"
            />

            {/* Imagen JAMF */}
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

          {/* 3. Acciones Derecha: Botones Auth (Estilo Browserbase/Cloudflare) + Menú */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Botón Iniciar Sesión (Estilo píldora con borde como Cloudflare) */}
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-[var(--color-background-inverse)]/40 text-[var(--color-text-primary)] hover:bg-[var(--color-background-inverse)]/10 transition-all duration-200 active:scale-95"
            >
              Iniciar sesión
            </Link>

            {/* Botón Registrarse (Estilo píldora sólida negra con flecha como Browserbase) */}
            <Link
              to="/register"
              className="group inline-flex items-center gap-1 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-[var(--color-background-inverse)] text-[var(--color-brand)] shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Registrarse</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {/* Separador sutil antes del menú */}
            <span className="hidden sm:inline-block h-6 w-[1.5px] bg-[var(--color-background-inverse)]/25 rounded-full mx-0.5" />

            {/* Dropdown Menu Hamburguesa */}
            <div className="relative">
              <Dropdown className="z-15">
                <DropdownTrigger>
                  <IconButton ariaLabel="Abrir menú de administración">
                    <Menu />
                  </IconButton>
                </DropdownTrigger>

                <DropdownContent className="w-56 p-2 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-xl">

                  {/* Ver Menú */}
                  <DropdownItem>
                    <Link to="/dashboard/menu" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                      <BookOpen size={18} className="text-[var(--color-brand)]" />
                      <span>Ver Menú</span>
                    </Link>
                  </DropdownItem>

                  {/* Gestión de Usuarios */}
                  <DropdownItem>
                    <Link to="/dashboard/userList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                      <Users size={18} className="text-[var(--color-brand)]" />
                      <span>Gestionar Usuarios</span>
                    </Link>
                  </DropdownItem>

                  {/* Gestión de Platillos */}
                  <DropdownItem>
                    <Link to="/dashboard/dishList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                      <UtensilsCrossed size={18} className="text-[var(--color-brand)]" />
                      <span>Gestionar Platillo</span>
                    </Link>
                  </DropdownItem>

                  {/* Gestión de Órdenes */}
                  <DropdownItem>
                    <Link to="/dashboard/orderList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                      <Logs size={18} className="text-[var(--color-brand)]" />
                      <span>Gestionar Órdenes</span>
                    </Link>
                  </DropdownItem>

                  {/* Gestión de Proveedores */}
                  <DropdownItem>
                    <Link to="/dashboard/providerList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                      <Truck size={18} className="text-[var(--color-brand)]" />
                      <span>Gestionar Proveedores</span>
                    </Link>
                  </DropdownItem>

                  {/* Gestión de Inventario */}
                  <DropdownItem>
                    <Link to="/dashboard/inventoryList" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                      <Boxes size={18} className="text-[var(--color-brand)]" />
                      <span>Gestionar Inventario</span>
                    </Link>
                  </DropdownItem>

                  {/* Gestión de Permisos*/}
                  <DropdownItem>
                    <Link to="/dashboard/permissions" className="flex items-center gap-3 w-full py-1 text-[var(--color-text-inverse)] hover:text-[var(--color-brand)] transition">
                      <ShieldCheck size={18} className="text-[var(--color-brand)]" />
                      <span>Gestionar Permisos</span>
                    </Link>
                  </DropdownItem>

                  {/* Separador visual */}
                  <hr className="border-gray-700 my-2" />

                  {/* Cerrar sesión */}
                  <DropdownItem>
                    <button 
                      onClick={handleLoginRedirect} 
                      className="flex items-center gap-3 w-full py-1 text-left text-[var(--color-brand)] hover:opacity-80 font-medium transition cursor-pointer"
                    >
                      <LogIn size={18} />
                      <span>Cerrar sesión</span>
                    </button>
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
}