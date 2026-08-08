import { useState } from "react";
import { Menu } from "lucide-react";
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
import { Link } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    console.log("Buscar:", value);
  };

  const handleClear = () => {
    console.log("Campo limpiado");
  };

  return (
    <nav className="w-full bg-brand border-b-2 text-black">
      <div className="mx-auto max-w-7xl px-4 py-2">
        
        {/* FILA PRINCIPAL: Logos + Links Desktop + Buscador Desktop + Menú */}
        <div className="flex items-center justify-between gap-2 h-14 md:h-16">

          {/* 📍 Logos agrupados (Con tamaño reducido en móvil para que no estorben) */}
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

          {/* Buscador Versión DESKTOP (Se oculta en móvil con hidden md:block) */}
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

          {/* Dropdown Menu Hamburguesa */}
          <div className="shrink-0 relative">
            <Dropdown className="z-15">
              <DropdownTrigger>
                <IconButton>
                  <Menu />
                </IconButton>
              </DropdownTrigger>

              <DropdownContent>
                <DropdownItem>Gestión de Productos</DropdownItem>

                <DropdownItem>
                  <Link to="/dashboard/userCreate" className="block w-full">
                    Crear Usuarios
                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <Link to="/dashboard/dishCreate" className="block w-full">
                    Crear Platillos
                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <Link to="/dashboard/dishList" className="block w-full">
                    Listar Platillos
                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <Link to="/dashboard/ProviderCreate" className="block w-full">
                    Crear Proveedores
                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <Link to="/dashboard/providerList" className="block w-full">
                    Listar Proveedores
                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <Link to="/dashboard/createInventory" className="block w-full">
                    Crear Inventario
                  </Link>
                </DropdownItem>
                
                <DropdownItem>
                  <Link to="/dashboard/inventoryList" className="block w-full">
                    Listar inventario
                  </Link>
                </DropdownItem>

                <DropdownItem>
                  <Link to="/dashboard/OrderForm" className="block w-full">
                    Crear Ordenes
                  </Link>
                </DropdownItem>

                <DropdownItem>Cerrar Sesión</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>

        </div>

        {/* FILA SECUNDARIA: Buscador MÓVIL (Solo visible en pantallas chicas < 768px) */}
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