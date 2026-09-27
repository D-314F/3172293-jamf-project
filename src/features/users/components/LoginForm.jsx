import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Input, Button } from "@/shared";
import { loginSchema } from "../schemas/loginSchema";
import { 
showSuccessAlert, 
showUserErrorAlert 
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";
import logo from "@/assets/images/1-logo.png";

export default function LoginForm() {
const navigate = useNavigate(); 
const [errors, setErrors] = useState({});

const [formData, setFormData] = useState({
userEmail: "",
userPassword: "",
});

const handleChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({
    ...prev,
    [name]: value,
}));

if (errors[name]) {
    setErrors((prev) => ({
    ...prev,
    [name]: "",
    }));
}
};

const handleSubmit = async (e) => {
e.preventDefault();

const result = loginSchema.safeParse(formData);

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
    await showSuccessAlert({
    title: "¡Bienvenido!",
    text: "Has ingresado correctamente a la plataforma.",
    timer: 2000,
    });

    navigate("/dashboard/home"); 
} catch (error) {
    console.error("Error al iniciar sesión:", error);
    setErrors({ submit: "Error al iniciar sesión" });

    await showUserErrorAlert({
    title: "Error de autenticación",
    text: "El correo o la contraseña son incorrectos.",
    });
}
};

return (
<div 
    className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-cover bg-center bg-no-repeat relative"
    style={{ backgroundImage: `url(${bf1})` }}
>
    {/* Capa de superposición con opacidad */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>

    {/* Contenedor Card adaptado a variables CSS del sistema */}
    <div className="w-full max-w-md p-6 sm:p-8 md:p-10 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-2xl md:rounded-3xl relative z-10 shadow-2xl flex flex-col items-center transition-all duration-300">

    {/* Icono / Logo */}
    <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-full bg-[var(--color-brand)] p-3 flex items-center justify-center shadow-md">
        <img 
        src={logo} 
        alt="Logo Marca" 
        className="w-full h-full object-contain" 
        />
    </div>

    <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-brand)] text-center mb-1">
        Iniciar Sesión
    </h1>

    <p className="text-[var(--color-brand)]/80 text-xs sm:text-sm text-center mb-6 max-w-xs">
        Ingresa tus credenciales para acceder a la plataforma
    </p>

    <form onSubmit={handleSubmit} className="gap-5 flex flex-col w-full">
        <Input
        label="Correo Electrónico"
        name="userEmail"
        type="email"
        value={formData.userEmail}
        placeholder="ejemplo@correo.com"
        onChange={handleChange}
        error={errors.userEmail}
        />

        <Input
        label="Contraseña"
        name="userPassword"
        type="password"
        value={formData.userPassword}
        placeholder="••••••••"
        onChange={handleChange}
        error={errors.userPassword}
        />

        <div className="text-center text-xs sm:text-sm">
        <Link 
            to="/forgot-password" 
            className="text-[var(--color-brand)] hover:underline transition-all"
        >
            ¿Olvidaste tu contraseña?
        </Link>
        </div>

        <Button
        variant="primary"
        size="md"
        type="submit"
        className="w-full mt-2"
        >
        Iniciar sesión
        </Button>

        {errors.submit && (
        <p className="text-red-500 text-xs sm:text-sm text-center mt-1">
            {errors.submit}
        </p>
        )}

        <div className="text-center text-xs sm:text-sm pt-4 border-t border-[var(--color-border)]/20">
        <span className="text-[var(--color-text-main,#ffffff)]/80">¿No tienes cuenta? </span>
        <Link 
            to="/register" 
            className="text-[var(--color-brand)] font-semibold hover:underline transition-all"
        >
            Regístrate Aquí
        </Link>
        </div>
    </form>
    </div>
</div>
);
}