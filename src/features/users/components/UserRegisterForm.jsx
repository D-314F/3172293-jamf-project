// UserRegisterForm componente para registrar un usuario
import { useState, useEffect } from "react";
import { Input, Select, Checkbox, Button, FileInput } from "@/shared";
import { getDocumentTypes, getUserTypes } from "@/services/selectService";
import { useNavigate, Link } from "react-router-dom";
import { userSchema } from "../schemas/userSchema";

export default function UserRegisterForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    userDocumentTypes: "",
    userDocumentNumber: "",
    userName: "",
    userType: "",
    userBusinessEmail: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
    userStartDate: "",
    userEndDate: "",
    userImage: [],
    isActive: true,
  });

  const [documentTypes, setDocumentTypes] = useState([]);
  const [userTypes, setUserTypes] = useState([]);

  useEffect(() => {
    getDocumentTypes().then(setDocumentTypes);
    getUserTypes().then(setUserTypes);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = userSchema.safeParse(formData);

    if (!result.success) {
      console.log("Errores de Zod:", result.error.issues);
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      alert("Usuario creado correctamente");
    } catch (error) {
      console.error("Error al crear el usuario", error);
      setErrors({ submit: "Error al crear el usuario" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
      
      {/* Header superior alineado */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Atrás
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-inverse)] text-right">
          Registrar usuarios
        </h1>
      </div>

      {/* Contenedor principal con tarjeta oscura */}
      <div className="rounded-2xl md:rounded-3xl border border-[var(--color-brand)] bg-[var(--color-background-inverse)] p-5 sm:p-8 md:p-10 shadow-2xl">
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* COLUMNA 1 */}
            <div className="flex flex-col gap-4">
              <Select
                label="Tipo de documento"
                name="userDocumentTypes"
                value={formData.userDocumentTypes}
                options={documentTypes}
                onChange={handleChange}
                error={errors.userDocumentTypes}
              />
              <Input
                label="Número Documento"
                name="userDocumentNumber"
                type="text"
                value={formData.userDocumentNumber}
                placeholder="Número Documento"
                onChange={handleChange}
                error={errors.userDocumentNumber}
              />
              <Input
                label="Nombre Completo"
                name="userName"
                type="text"
                value={formData.userName}
                placeholder="Nombre Completo"
                onChange={handleChange}
                error={errors.userName}
              />
              <Select
                label="Tipo de usuario"
                name="userType"
                value={formData.userType}
                options={userTypes}
                onChange={handleChange}
                error={errors.userType}
              />
              
              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="secondary"
                  size="md" 
                  className="w-full"
                >
                  Agregar grupo
                </Button>
              </div>
            </div>

            {/* COLUMNA 2 */}
            <div className="flex flex-col gap-4">
              <Input
                label="Correo empresarial"
                name="userBusinessEmail"
                type="email"
                value={formData.userBusinessEmail}
                placeholder="Correo empresarial"
                onChange={handleChange}
                error={errors.userBusinessEmail}
              />
              <Input
                label="Correo electrónico"
                name="userEmail"
                type="email"
                value={formData.userEmail}
                placeholder="Correo electrónico"
                onChange={handleChange}
                error={errors.userEmail}
              />
              <Input
                label="Número telefónico"
                name="userPhone"
                type="tel"
                value={formData.userPhone}
                placeholder="Número telefónico"
                onChange={handleChange}
                error={errors.userPhone}
              />
              <Input
                label="Dirección residencial"
                name="userAddress"
                type="text"
                value={formData.userAddress}
                placeholder="Dirección residencial"
                onChange={handleChange}
                error={errors.userAddress}
              />
              
              {/* Entradas de Fechas como Texto */}
              <Input
                label="Fecha inicio laboral"
                name="userStartDate"
                type="text"
                placeholder="dd/mm/aaaa"
                value={formData.userStartDate}
                onChange={handleChange}
                error={errors.userStartDate}
              />
              <Input
                label="Fecha fin laboral"
                name="userEndDate"
                type="text"
                placeholder="dd/mm/aaaa"
                value={formData.userEndDate}
                onChange={handleChange}
                error={errors.userEndDate}
              />
            </div>

            {/* COLUMNA 3 */}
            <div className="flex flex-col justify-between gap-6 md:col-span-2 lg:col-span-1">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-2 w-full">
                  <span className="text-[var(--color-text-inverse)] text-sm font-medium">
                    Foto de perfil / Archivo
                  </span>
                  <FileInput
                    value={formData.userImage}
                    onChange={(files) =>
                      setFormData((prev) => ({ ...prev, userImage: files }))
                    }
                    multiple={true}
                  />
                  {errors.userImage && (
                    <span className="text-red-400 text-xs">
                      {errors.userImage}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Checkbox
                    id="isActive"
                    name="isActive"
                    label="Estado del usuario"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                </div>

                <Button 
                  type="button" 
                  variant="secondary"
                  size="md" 
                  className="w-full"
                >
                  Agregar Teléfono Secundario
                </Button>
              </div>

              {/* Botones de acción principales */}
              <div className="flex flex-col gap-3 w-full pt-4">
                <Link to="/dashboard/userList" className="w-full">
                  <Button 
                    type="button" 
                    variant="secondary"
                    size="md" 
                    className="w-full"
                  >
                    Visualizar Lista Usuario
                  </Button>
                </Link>

                <Button 
                  type="submit" 
                  variant="primary"
                  size="md" 
                  className="w-full"
                >
                  Crear usuario
                </Button>
              </div>

            </div>

          </div>
        </form>
      </div>
    </section>
  );
}