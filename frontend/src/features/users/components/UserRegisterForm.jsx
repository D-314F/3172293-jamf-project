// UserRegisterForm componente para registrar un usuario
import { useState, useEffect } from "react";
import { Input, Select, Checkbox, Button, FileInput, Modal } from "@/shared";
import { ArrowLeft } from "lucide-react";
import { getDocumentTypes, getUserTypes } from "@/services/selectService";
import { useNavigate, useLocation } from "react-router-dom"; 
import { userSchema } from "../schemas/userSchema";
import { 
  showSuccessAlert, 
  showCancelAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";
import bf1 from "@/assets/images/bf-2.png";

import { createUser } from "../services/userServices";
import { user_groups_function } from "../data/users";


export default function UserRegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    userDocumentTypes: "",
    userDocumentNumber: "",
    userName: "",
    userType: "",
    userBusinessEmail: "",
    userEmail: "",
    userPassword: "",
    userPhone: "",
    userSecondaryPhone: "",
    userGroup: "",
    userAddress: "",
    userStartDate: "",
    userEndDate: "",
    userImage: [],
    isActive: true,
  });

  const [documentTypes, setDocumentTypes] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const isPublicRegister = location.pathname === "/register";
  const [errors, setErrors] = useState({});

  // Estados para los 2 modales reutilizando el mismo componente <Modal />
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [tempGroup, setTempGroup] = useState("");
  const [tempSecondaryPhone, setTempSecondaryPhone] = useState("");
  const [modalError, setModalError] = useState("");

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

  // Guardar Grupo desde el Modal
  const handleSaveGroup = () => {
    if (!tempGroup) {
      setModalError("Por favor selecciona un grupo para el usuario.");
      return;
    }
    setFormData((prev) => ({ ...prev, userGroup: tempGroup }));
    setModalError("");
    setIsGroupModalOpen(false);
  };

  // Esto sirve para guardar Teléfono Secundario desde el Modal
  const handleSaveSecondaryPhone = () => {
    if (!/^[0-9]{7,15}$/.test(tempSecondaryPhone)) {
      setModalError("Ingresa un número telefónico válido (7 a 15 dígitos numéricos).");
      return;
    }
    setFormData((prev) => ({ ...prev, userSecondaryPhone: tempSecondaryPhone }));
    setModalError("");
    setIsPhoneModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = userSchema.safeParse(formData);

    if (!result.success) {
      console.log("Errores de Zod:", result.error.issues);
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor, completa correctamente todos los campos obligatorios.",
      });

      return;
    }

    setErrors({});

    try {
      const response = await createUser(result.data);
      console.log("Usuario creado:", response);

      await showSuccessAlert({
        title: "Usuario creado",
        text: "El usuario se ha creado correctamente",
        timer: 2000,
      });

      navigate(isPublicRegister ? "/login" : "/dashboard/userList");
    } catch (error) {
      console.error("Error al crear el usuario", error);
      await showUserErrorAlert({
        title: "No se pudo crear el usuario",
        text: error.message,
      });
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios no guardados se perderán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(isPublicRegister ? "/login" : "/dashboard/userList");
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bf1})` }}
    >
      
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10 flex flex-col gap-4">
        
        <div className="flex items-center justify-between gap-4 mb-2">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={handleCancel}
            className="!w-auto flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Button>

          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-inverse)] font-[var(--font-heading)] text-right">
            Registrar usuarios
          </h1>
        </div>

        {/* Contenedor principal*/}
        <div className="rounded-2xl md:rounded-3xl border border-[var(--color-brand)] bg-[var(--color-background-inverse)] p-5 sm:p-8 md:p-10 shadow-2xl">
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
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
                <Input
                  label="Contraseña"
                  name="userPassword"
                  type="password"
                  value={formData.userPassword}
                  placeholder="Contraseña"
                  onChange={handleChange}
                  error={errors.userPassword}
                />
                
                <div className="pt-2">
                  <Button 
                    type="button" 
                    variant="primary"
                    size="md" 
                    className="w-full"
                    onClick={() => {
                      setTempGroup(formData.userGroup);
                      setModalError("");
                      setIsGroupModalOpen(true);
                    }}
                  >
                    {formData.userGroup
                      ? `Grupo asignado: ${formData.userGroup}`
                      : "Agregar grupo"}
                  </Button>
                </div>
              </div>

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
                
                <Input
                  label="Fecha inicio laboral"
                  name="userStartDate"
                  type="date"
                  value={formData.userStartDate}
                  onChange={handleChange}
                  error={errors.userStartDate}
                />
                <Input
                  label="Fecha fin laboral"
                  name="userEndDate"
                  type="date"
                  value={formData.userEndDate}
                  onChange={handleChange}
                  error={errors.userEndDate}
                />
              </div>

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
                      <span className="text-[var(--color-error)] text-xs">
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
                    variant="primary"
                    size="md" 
                    className="w-full"
                    onClick={() => {
                      setTempSecondaryPhone(formData.userSecondaryPhone);
                      setModalError("");
                      setIsPhoneModalOpen(true);
                    }}
                  >
                    {formData.userSecondaryPhone
                      ? `Tel. Secundario: ${formData.userSecondaryPhone}`
                      : "Agregar Teléfono Secundario"}
                  </Button>
                </div>

                <div className="flex flex-col gap-3 w-full pt-4">
                  <Button 
                    type="button" 
                    variant="secondary"
                    size="md" 
                    className="w-full"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
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

      {/* MODAL 1: Agregar Grupo de Permisos (reutilizando <Modal />) */}
      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title="Asignar Grupo al Usuario"
      >
        <Select
          label="Selecciona el grupo o área de permisos"
          name="tempGroup"
          value={tempGroup}
          options={user_groups_function}
          onChange={(e) => {
            setTempGroup(e.target.value);
            setModalError("");
          }}
          error={modalError}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsGroupModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveGroup}
          >
            Guardar grupo
          </Button>
        </div>
      </Modal>

      {/* MODAL 2: Agregar Teléfono Secundario */}
      <Modal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        title="Agregar Teléfono Secundario"
      >
        <Input
          label="Segundo número de contacto (Opcional)"
          name="tempSecondaryPhone"
          type="tel"
          value={tempSecondaryPhone}
          placeholder="Ej. 3109876543"
          className="h-10"
          onChange={(e) => {
            setTempSecondaryPhone(e.target.value);
            setModalError("");
          }}
          error={modalError}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsPhoneModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveSecondaryPhone}
          >
            Guardar teléfono
          </Button>
        </div>
      </Modal>
    </div>
  );
}