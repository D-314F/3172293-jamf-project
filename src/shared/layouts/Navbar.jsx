import { useState } from "react";
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
} from "lucide-react";
import {
  IconButton,
  SearchField,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/shared";
import logo from "@/assets/images/1-logo.png";
import logo2 from "@/assets/images/2-logo.png";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value) => {
    console.log("Buscar:", value);
  };

  const handleClear = () => {
    console.log("Campo limpiado");
  };

  const handleLoginRedirect = () => {
    navigate("/login"); 
  };

  return (
    <nav className="w-full bg-brand border-b-2 text-black">
      <div className="mx-auto max-w-7xl px-4 py-2">
        
        {/* FILA PRINCIPAL */}
        <div className="flex items-center justify-between gap-2 h-14 md:h-16">

          {/* Logos agrupados */}
          <Link to="/dashboard" className="flex items-center gap-2 sm:gap-4 shrink-0">
            <img src={logo2} alt="Logo Rico" className="h-7 sm:h-10 object-contain" />
            <img src={logo} alt="Logo SENA" className="h-7 sm:h-10 object-contain" />
          </Link>

          {/* Links de navegación (Solo Desktop) */}
          <ul className="hidden md:flex items-center gap-6 font-medium">
            <li>
              <Link to="/dashboard/home" className="hover:text-primary transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-primary transition">
                Cursos
              </Link>
            </li>
            <li>
              <Link to="/inicio" className="hover:text-primary transition">
                Multimedia
              </Link>
            </li>
            <li>
              <Link to="/inicio" className="hover:text-primary transition">
                Contacto
              </Link>
            </li>
          </ul>

          {/* Buscador Versión DESKTOP */}
          <div className="hidden md:block w-72 lg:w-80">
            <SearchField
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
              onClear={handleClear}
              placeholder="Buscar..."
              size="md"
              variant="outlined"
              className="w-full"
            />
          </div>

          {/* Dropdown Menu Hamburguesa Remasterizado */}
          <div className="shrink-0 relative">
            <Dropdown className="z-15">
              <DropdownTrigger>
                <IconButton>
                  <Menu />
                </IconButton>
              </DropdownTrigger>

              <DropdownContent className="w-56 p-2 bg-black border border-brand rounded-xl">

                {/* Ver Menú (Reemplaza a productos) */}
                <DropdownItem>
                  <Link to="/dashboard/menu" className="flex items-center gap-3 w-full py-1 text-white hover:text-amber-400 transition">
                    <BookOpen size={18} className="text-amber-400" />
                    <span>Ver Menú</span>
                  </Link>
                </DropdownItem>

                {/* Gestión de Usuarios */}
                <DropdownItem>
                  <Link to="/dashboard/userList" className="flex items-center gap-3 w-full py-1 text-white hover:text-amber-400 transition">
                    <Users size={18} className="text-amber-400" />
                    <span>Gestionar Usuarios</span>
                  </Link>
                </DropdownItem>

                {/* Gestión de Platillos */}
                <DropdownItem>
                  <Link to="/dashboard/dishList" className="flex items-center gap-3 w-full py-1 text-white hover:text-amber-400 transition">
                    <UtensilsCrossed size={18} className="text-amber-400" />
                    <span>Gestionar Platillo</span>
                  </Link>
                </DropdownItem>

                {/* Gestión de Ordenes */}
                <DropdownItem>
                  <Link to="/dashboard/OrderForm" className="flex items-center gap-3 w-full py-1 text-white hover:text-amber-400 transition">
                    <Logs size={18} className="text-amber-400" />
                    <span>Agregar Orden</span>
                  </Link>
                </DropdownItem>

                {/* Gestión de Proveedores */}
                <DropdownItem>
                  <Link to="/dashboard/providerList" className="flex items-center gap-3 w-full py-1 text-white hover:text-amber-400 transition">
                    <Truck size={18} className="text-amber-400" />
                    <span>Gestionar Proveedores</span>
                  </Link>
                </DropdownItem>

                {/* Gestión de Inventario */}
                <DropdownItem>
                  <Link to="/dashboard/inventoryList" className="flex items-center gap-3 w-full py-1 text-white hover:text-amber-400 transition">
                    <Boxes size={18} className="text-amber-400" />
                    <span>Gestionar Inventario</span>
                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <Link to="/dashboard/permissions" className="flex items-center gap-3 w-full py-1 text-white hover:text-amber-400 transition">
                    <ShieldCheck size={18} className="text-amber-400" />
                    <span>Gestionar Permisos</span>
                  </Link>
                </DropdownItem>

                {/* Separador visual */}
                <hr className="border-gray-700 my-2" />

                {/* Iniciar Sesión */}
                <DropdownItem>
                  <button 
                    onClick={handleLoginRedirect} 
                    className="flex items-center gap-3 w-full py-1 text-left text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer"
                  >
                    <LogIn size={18} />
                    <span>Iniciar sesión</span>
                  </button>
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>

        </div>

        {/* FILA SECUNDARIA: Buscador MÓVIL */}
        <div className="block md:hidden pt-1 pb-2 w-full">
          <SearchField
            value={search}
            onChange={setSearch}
            onSubmit={handleSearch}
            onClear={handleClear}
            placeholder="Buscar..."
            size="md"
            variant="outlined"
            className="w-full"
          />
        </div>

      </div>
    </nav>
  );
}