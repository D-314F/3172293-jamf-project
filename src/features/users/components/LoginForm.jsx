import { useState } from "react";
import { Input, Button } from "@/shared";
import { Link, useNavigate } from "react-router-dom"; // 👈 Importamos useNavigate
import { loginSchema } from "../schemas/loginSchema";
import bf1 from "@/assets/images/bf-1.png";

export default function LoginForm () {
    const navigate = useNavigate(); // 👈 Inicializamos el hook de navegación
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};

            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        // Mensaje de éxito y redirección inmediata al presionar OK en la alerta
        alert("Sesión iniciada correctamente");
        navigate("/dashboard/home"); // 👈 Te lleva directo a la HomePage
    };

    return(
        <div 
            className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${bf1})` }}
        >
            {/* Capa oscura para que resalte el formulario */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>

            <div className="w-full max-w-md p-8 bg-black border border-brand rounded-4xl relative z-10 shadow-2xl">
                <h1 className="text-2xl font-bold text-brand text-center mb-2">
                    Iniciar Sesión
                </h1>

                <p className="text-brand text-sm text-center mb-6">
                    Inicia sesión en nuestra web del SENA que estamos trabajando
                </p>

                <form onSubmit={handleSubmit} className="gap-6 flex flex-col">
                    <Input
                        label="Correo Electrónico"
                        name="userEmail"
                        type="email"
                        value={formData.userEmail}
                        placeholder="Escribe tu correo electrónico"
                        onChange={handleChange}
                        error={errors.userEmail}
                    />

                    <Input
                        label="Contraseña"
                        name="userPassword"
                        type="password"
                        value={formData.userPassword}
                        placeholder="Escribe tu contraseña"
                        onChange={handleChange}
                        error={errors.userPassword}
                    />

                    <div className="text-center text-sm">
                        <span className="text-white">¿Olvidaste tu contraseña? </span>
                        <Link to="/forgot-password" className="text-brand">
  Recupérala Aquí
</Link>

                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        type="submit"
                    >
                        Iniciar sesión
                    </Button>

                    {errors.submit && (
                        <p className="text-red-500 text-sm text-center mt-2">
                            {errors.submit}
                        </p>
                    )}

                    <div className="text-center text-sm">
                        <span className="text-white">¿No tienes cuenta? </span>
                        <Link to="/register" className="text-brand">
                            Regístrate Aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}