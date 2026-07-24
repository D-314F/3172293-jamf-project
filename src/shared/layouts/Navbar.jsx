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
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* 📍 Logos agrupados sin separador */}
          <Link to="/dashboard" className="flex items-center gap-4">
            <img src={logo2} alt="Logo Rico" className="h-10 object-contain" />
            <img src={logo} alt="Logo SENA" className="h-10 object-contain" />
          </Link>

          {/* Links de navegación */}
          <ul className="hidden md:flex items-center gap-6 font-medium">
            <li>
              <Link to="/auth" className="hover:text-primary transition">
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

          {/* SearchField */}
          <div>
            <SearchField
              value={search}
              onChange={setSearch}
              onSubmit={handleSearch}
              onClear={handleClear}
              placeholder="Buscar productos..."
              size="md"
              variant="outlined"
              className="w-76"
            />
          </div>

          {/* Dropdown Menu */}
          <div>
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
                  <Link to="/dashboard/userList" className="block w-full">
                    Listar usuarios
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
                  <Link to="/dashboard/createInventory" className="block w-full">
                    Crear Inventario
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
      </div>
    </nav>
  );
}