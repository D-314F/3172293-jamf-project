// UserRegisterForm componente para registrar un usuario
import { useState, useEffect } from "react";
import { Input, Select, Checkbox, Button, FileInput } from "@/shared";
import { getDocumentTypes, getUserTypes } from "@/services/selectService";
import { useNavigate } from "react-router-dom";
import { userSchema } from "../schemas/userSchema";

export default function UserRegisterForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [FormData, setFormData] = useState({
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

    const result = userSchema.safeParse(FormData);

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
      // await createUser(result.data);
      // navigate("/dashboard/users");
    } catch (error) {
      console.error("Error al crear el usuario", error);
      setErrors({ submit: "Error al crear el usuario" });
    }
  };

  return (
    <div
      className="p-8 text-[var(--color-text-primary)]"
      style={{
        backgroundImage: "url('/assets/images/bg-register.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-fit mb-6">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Atrás
        </Button>
      </div>

      <h1 className="text-[var(--text-main)] font-[var(--font-heading)] mb-6 text-[var(--color-text-inverse)]">
        Registrar usuarios
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* COLUMNA 1 */}
          <div className="flex flex-col gap-4">
            <Select
              label="Tipo de documento"
              name="userDocumentTypes"
              value={FormData.userDocumentTypes}
              options={documentTypes}
              onChange={handleChange}
              error={errors.userDocumentTypes}
            />
            <Input
              label="Número Documento"
              name="userDocumentNumber"
              type="text"
              value={FormData.userDocumentNumber}
              placeholder="Número Documento"
              onChange={handleChange}
              error={errors.userDocumentNumber}
            />
            <Input
              label="Nombre Completo"
              name="userName"
              type="text"
              value={FormData.userName}
              placeholder="Nombre Completo"
              onChange={handleChange}
              error={errors.userName}
            />
            <Select
              label="Tipo de usuario"
              name="userType"
              value={FormData.userType}
              options={userTypes}
              onChange={handleChange}
              error={errors.userType}
            />
            <div className="w-full">
              <Button variant="primary" type="button" size="md">
                Agregar grupo
              </Button>
            </div>
            <div className="w-full">
              <Button variant="primary" type="button" size="md">
                Visualizar Lista Usuario
              </Button>
            </div>
          </div>

          {/* COLUMNA 2 */}
          <div className="flex flex-col gap-4">
            <Input
              label="Correo empresarial"
              name="userBusinessEmail"
              type="email"
              value={FormData.userBusinessEmail}
              placeholder="Correo empresarial"
              onChange={handleChange}
              error={errors.userBusinessEmail}
            />
            <Input
              label="Correo electrónico"
              name="userEmail"
              type="email"
              value={FormData.userEmail}
              placeholder="Correo electrónico"
              onChange={handleChange}
              error={errors.userEmail}
            />
            <Input
              label="Número telefónico"
              name="userPhone"
              type="tel"
              value={FormData.userPhone}
              placeholder="Número telefónico"
              onChange={handleChange}
              error={errors.userPhone}
            />
            <Input
              label="Dirección residencial"
              name="userAddress"
              type="text"
              value={FormData.userAddress}
              placeholder="Dirección residencial"
              onChange={handleChange}
              error={errors.userAddress}
            />
            <Input
              label="Fecha inicio laboral"
              name="userStartDate"
              type="text"
              value={FormData.userStartDate}
              placeholder="Fecha inicio laboral"
              onChange={handleChange}
              error={errors.userStartDate}
            />
            <Input
              label="Fecha fin laboral"
              name="userEndDate"
              type="text"
              value={FormData.userEndDate}
              placeholder="Fecha fin laboral"
              onChange={handleChange}
              error={errors.userEndDate}
            />
          </div>

          {/* COLUMNA 3 */}
          <div className="flex flex-col gap-4">
            <FileInput
              value={FormData.userImage}
              onChange={(files) =>
                setFormData((prev) => ({ ...prev, userImage: files }))
              }
              multiple={true}
            />
            {errors.userImage && (
              <span className="text-[var(--color-error)] text-[var(--text-small)]">
                {errors.userImage}
              </span>
            )}

            <Checkbox
              id="isActive"
              name="isActive"
              label="Estado del usuario"
              checked={FormData.isActive}
              onChange={handleChange}
            />

            <div className="w-full">
              <Button variant="primary" type="button" size="md">
                Agregar Teléfono Secundario
              </Button>
            </div>

            <div className="w-full [&>button]:w-full mt-4">
              <Button variant="primary" type="submit" size="md">
                Crear usuario
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
