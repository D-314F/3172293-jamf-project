// src/features/users/components/UserRegisterForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  IdCard,
  Briefcase,
  Image as ImageIcon,
  Shield,
  PhoneCall,
  UserPlus,
} from "lucide-react";
import { Input, Select, Checkbox, Button, FileInput, Modal } from "@/shared";
import { getDocumentTypes, getUserTypes } from "@/services/selectService";
import { userSchema } from "../schemas/userSchema";
import {
  showSuccessAlert,
  showCancelAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";
import { createUser } from "../services/userServices";
import { user_groups_function } from "../data/users";

export default function UserRegisterForm() {
  const navigate = useNavigate();

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
  const [errors, setErrors] = useState({});

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

  const handleSaveGroup = () => {
    if (!tempGroup) {
      setModalError("Por favor selecciona un grupo para el usuario.");
      return;
    }
    setFormData((prev) => ({ ...prev, userGroup: tempGroup }));
    setModalError("");
    setIsGroupModalOpen(false);
  };

  const handleSaveSecondaryPhone = () => {
    if (!/^[0-9]{7,15}$/.test(tempSecondaryPhone)) {
      setModalError(
        "Ingresa un número telefónico válido (7 a 15 dígitos numéricos)."
      );
      return;
    }
    setFormData((prev) => ({
      ...prev,
      userSecondaryPhone: tempSecondaryPhone,
    }));
    setModalError("");
    setIsPhoneModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = userSchema.safeParse(formData);

    if (!result.success) {
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
      await createUser(result.data);

      await showSuccessAlert({
        title: "Usuario creado",
        text: "El empleado fue registrado correctamente en el sistema.",
        timer: 2000,
      });

      navigate("/dashboard/userList");
    } catch (error) {
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
      navigate("/dashboard/userList");
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-6">
      {/* Cabecera M3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={handleCancel}
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Button>
          <div>
            <h1 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Registrar Empleado / Usuario
            </h1>
            <p className="text-medium text-[var(--color-text-muted)]">
              Alta administrativa con asignación de cargo, grupo y contrato
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor Principal M3 */}
      <div className="rounded-3xl border border-[var(--color-brand)]/50 bg-[var(--color-background-inverse)] p-5 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna 1: Identidad y Rol */}
            <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/60">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/50">
                <IdCard className="w-5 h-5 text-[var(--color-brand)]" />
                <h2 className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                  Identidad y Cargo
                </h2>
              </div>

              <Select
                label="Tipo de documento"
                name="userDocumentTypes"
                value={formData.userDocumentTypes}
                options={documentTypes}
                onChange={handleChange}
                error={errors.userDocumentTypes}
              />
              <Input
                label="Número de documento"
                name="userDocumentNumber"
                type="text"
                value={formData.userDocumentNumber}
                placeholder="Ej: 1088345678"
                onChange={handleChange}
                error={errors.userDocumentNumber}
              />
              <Input
                label="Nombre completo"
                name="userName"
                type="text"
                value={formData.userName}
                placeholder="Nombre y apellidos"
                onChange={handleChange}
                error={errors.userName}
              />
              <Select
                label="Cargo / Tipo de usuario"
                name="userType"
                value={formData.userType}
                options={userTypes}
                onChange={handleChange}
                error={errors.userType}
              />
              <Input
                label="Contraseña inicial"
                name="userPassword"
                type="password"
                value={formData.userPassword}
                placeholder="Contraseña de acceso"
                onChange={handleChange}
                error={errors.userPassword}
              />

              <div className="pt-1">
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
                  <Shield className="w-4 h-4" />
                  {formData.userGroup
                    ? `Grupo: ${formData.userGroup}`
                    : "Asignar grupo de permisos"}
                </Button>
              </div>
            </div>

            {/* Columna 2: Contacto y Contrato */}
            <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/60">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/50">
                <Briefcase className="w-5 h-5 text-[var(--color-brand)]" />
                <h2 className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                  Contacto y Contrato
                </h2>
              </div>

              <Input
                label="Correo empresarial"
                name="userBusinessEmail"
                type="email"
                value={formData.userBusinessEmail}
                placeholder="empleado@jamf.com.co"
                onChange={handleChange}
                error={errors.userBusinessEmail}
              />
              <Input
                label="Correo personal (Login)"
                name="userEmail"
                type="email"
                value={formData.userEmail}
                placeholder="correo@ejemplo.com"
                onChange={handleChange}
                error={errors.userEmail}
              />
              <Input
                label="Número telefónico"
                name="userPhone"
                type="tel"
                maxLength={10}
                value={formData.userPhone}
                placeholder="10 dígitos"
                onChange={handleChange}
                error={errors.userPhone}
              />
              <Input
                label="Dirección residencial"
                name="userAddress"
                type="text"
                value={formData.userAddress}
                placeholder="Dirección completa"
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
                label="Fecha fin laboral (Opcional)"
                name="userEndDate"
                type="date"
                value={formData.userEndDate}
                onChange={handleChange}
                error={errors.userEndDate}
              />
            </div>

            {/* Columna 3: Foto, Estado y Envío */}
            <div className="flex flex-col justify-between gap-6 p-5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/60">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/50">
                  <ImageIcon className="w-5 h-5 text-[var(--color-brand)]" />
                  <h2 className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                    Archivo y Estado
                  </h2>
                </div>

                <div className="flex flex-col items-start gap-2 w-full">
                  <span className="text-[var(--color-text-inverse)] text-medium font-[var(--font-label)]">
                    Foto de perfil / Documento
                  </span>
                  <FileInput
                    value={formData.userImage}
                    onChange={(files) =>
                      setFormData((prev) => ({ ...prev, userImage: files }))
                    }
                    multiple={true}
                  />
                  {errors.userImage && (
                    <span className="text-[var(--color-error)] text-small">
                      {errors.userImage}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Checkbox
                    id="isActive"
                    name="isActive"
                    label="Usuario activo en el sistema"
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
                  <PhoneCall className="w-4 h-4" />
                  {formData.userSecondaryPhone
                    ? `Tel. Secundario: ${formData.userSecondaryPhone}`
                    : "Agregar teléfono secundario"}
                </Button>
              </div>

              <div className="flex flex-col gap-3 w-full pt-4 border-t border-[var(--color-border)]/50">
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
                  <UserPlus className="w-4 h-4" />
                  Crear usuario
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL 1: Asignar Grupo */}
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

      {/* MODAL 2: Teléfono Secundario */}
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
    </section>
  );
}