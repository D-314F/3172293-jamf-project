// src/features/users/components/PublicRegisterForm.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft, ShieldAlert } from "lucide-react";
import { Input, Select, Button } from "@/shared";
import { getDocumentTypes } from "@/services/selectService";
import { userSchema } from "../schemas/userSchema";
import {
    showSuccessAlert,
    showUserErrorAlert,
} from "@/shared/services/alertService";
import { createUser } from "../services/userServices";
import bf1 from "@/assets/images/bf-2.png";
import logo from "@/assets/images/1-logo.png";

// Esquema exclusivo para registro inicial (sin campos administrativos)
const publicRegisterSchema = userSchema.pick({
    userDocumentTypes: true,
    userDocumentNumber: true,
    userName: true,
    userEmail: true,
    userPhone: true,
    userAddress: true,
    userPassword: true,
    });

    export default function PublicRegisterForm() {
    const navigate = useNavigate();
    const [documentTypes, setDocumentTypes] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        userDocumentTypes: "",
        userDocumentNumber: "",
        userName: "",
        userEmail: "",
        userPhone: "",
        userAddress: "",
        userPassword: "",
    });

    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = publicRegisterSchema.safeParse(formData);

        if (!result.success) {
        const fieldErrors = {};
        result.error.issues.forEach((issue) => {
            fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);

        await showUserErrorAlert({
            title: "Revisa tus datos",
            text: "Por favor completa correctamente todos los campos personales.",
        });
        return;
        }

        setErrors({});

        try {
        setIsSubmitting(true);
        await createUser({
            ...result.data,
            userDocumentNumber: result.data.userDocumentNumber.trim(),
            userName: result.data.userName.trim(),
            userEmail: result.data.userEmail.trim(),
            userPhone: result.data.userPhone.trim(),
            userAddress: result.data.userAddress.trim(),
            userType: "Pendiente",
            userBusinessEmail: null,
            userStartDate: null,
            userEndDate: null,
            isActive: true,
        });

        await showSuccessAlert({
            title: "¡Cuenta registrada!",
            text: "Tus datos iniciales fueron guardados. Ya puedes iniciar sesión.",
            timer: 2200,
        });

        navigate("/login");
        } catch (error) {
        await showUserErrorAlert({
            title: "No se pudo completar el registro",
            text: error.message,
        });
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <div
        className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bf1})` }}
        >
        <div className="absolute inset-0 bg-[var(--color-background-inverse)]/75 backdrop-blur-xs z-0" />

        <section className="w-full max-w-2xl relative z-10 space-y-4">
            {/* Botón superior para volver */}
            <div className="flex items-center justify-between">
            <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => navigate("/dashboard/home")}
            >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
            </Button>
            </div>

            {/* Card Principal Estilo POS Pione (Imágenes 1 y 2) */}
            <div className="rounded-3xl border border-[var(--color-brand)]/60 bg-[var(--color-background-inverse)] p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Encabezado con Logo en insignia dorada */}
            <div className="flex flex-col items-center text-center gap-2 border-b border-[var(--color-border)]/50 pb-4">
                <div className="flex items-center justify-center rounded-2xl bg-[var(--color-brand)] px-4 py-2 shadow-md">
                <img
                    src={logo}
                    alt="Logo JAMF"
                    className="h-9 object-contain"
                />
                </div>
                <h1 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)] mt-1">
                Crear Cuenta en JAMF
                </h1>
                <p className="text-medium text-[var(--color-text-muted)] max-w-md">
                Ingresa tus datos básicos. El administrador asignará tu cargo y
                permisos dentro del sistema.
                </p>
            </div>

            {/* Nota informativa */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-brand)]/30 px-4 py-3 text-small text-[var(--color-text-muted)]">
                <ShieldAlert className="w-4 h-4 text-[var(--color-brand)] shrink-0 mt-0.5" />
                <span>
                Tu cuenta se creará con estado inicial{" "}
                <strong className="text-[var(--color-brand)]">Pendiente de rol</strong>{" "}
                hasta que el administrador configure tu área de trabajo.
                </span>
            </div>

            {/* Formulario en 2 columnas limpias */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                    label="Tipo de documento"
                    name="userDocumentTypes"
                    htmlFor="reg-docType"
                    value={formData.userDocumentTypes}
                    options={documentTypes}
                    onChange={handleChange}
                    error={errors.userDocumentTypes}
                />

                <Input
                    label="Número de documento"
                    name="userDocumentNumber"
                    htmlFor="reg-docNumber"
                    type="text"
                    placeholder="Ej: 1088345678"
                    value={formData.userDocumentNumber}
                    onChange={handleChange}
                    error={errors.userDocumentNumber}
                />

                <div className="sm:col-span-2">
                    <Input
                    label="Nombre completo"
                    name="userName"
                    htmlFor="reg-userName"
                    type="text"
                    placeholder="Ej: Camilo Andrés Pérez"
                    value={formData.userName}
                    onChange={handleChange}
                    error={errors.userName}
                    />
                </div>

                <Input
                    label="Correo electrónico (Acceso)"
                    name="userEmail"
                    htmlFor="reg-userEmail"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.userEmail}
                    onChange={handleChange}
                    error={errors.userEmail}
                />

                <Input
                    label="Número telefónico"
                    name="userPhone"
                    htmlFor="reg-userPhone"
                    type="tel"
                    maxLength={10}
                    placeholder="10 dígitos"
                    value={formData.userPhone}
                    onChange={handleChange}
                    error={errors.userPhone}
                />

                <div className="sm:col-span-2">
                    <Input
                    label="Dirección residencial"
                    name="userAddress"
                    htmlFor="reg-userAddress"
                    type="text"
                    placeholder="Ej: Calle 25 #10-15, Pereira"
                    value={formData.userAddress}
                    onChange={handleChange}
                    error={errors.userAddress}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Input
                    label="Contraseña"
                    name="userPassword"
                    htmlFor="reg-userPassword"
                    type="password"
                    placeholder="Mínimo 8 caracteres, mayúscula, número y símbolo"
                    value={formData.userPassword}
                    onChange={handleChange}
                    error={errors.userPassword}
                    />
                </div>
                </div>

                <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full"
                >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? "Registrando cuenta..." : "Crear mi cuenta"}
                </Button>

                <p className="text-center text-medium text-[var(--color-text-muted)] pt-1">
                ¿Ya tienes una cuenta registrada?{" "}
                <Link
                    to="/login"
                    className="text-[var(--color-brand)] font-[var(--font-heading)] hover:underline"
                >
                    Inicia sesión aquí
                </Link>
                </p>
            </form>
            </div>
        </section>
        </div>
    );
    }