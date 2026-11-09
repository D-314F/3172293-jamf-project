import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../services/logoutService";

// RNF09: 10 minutos de inactividad (10 * 60 * 1000 = 600,000 ms)
// TIP PARA SUSTENTACIÓN: Si el instructor pide verlo en vivo rápido, puedes cambiar el 10 por 0.25 (15 segundos)
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000;

export default function SessionTimeout() {
    const navigate = useNavigate();
    const location = useLocation();
    const timerRef = useRef(null);

    useEffect(() => {
        const handleInactivityLogout = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        // 1. Eliminamos el token de la sesión
        logout();

        // 2. Redirigimos al login reemplazando el historial para impedir volver atrás
        navigate("/login", { replace: true });

        // 3. Mostramos el aviso correspondiente de cierre por inactividad
        await Swal.fire({
            icon: "warning",
            title: "Sesión cerrada por inactividad",
            text: "Por tu seguridad, la sesión se cerró automáticamente tras 10 minutos sin actividad.",
            confirmButtonText: "Iniciar sesión nuevamente",
            customClass: {
            popup: "rounded-2xl",
            title: "!text-amber-600 font-bold",
            confirmButton:
                "!bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium",
            },
            buttonsStyling: false,
        });
        };

        const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Solo activamos el contador si existe una sesión iniciada (token activo)
        if (sessionStorage.getItem("token")) {
            timerRef.current = setTimeout(handleInactivityLogout, INACTIVITY_LIMIT_MS);
        }
    };

    // Eventos de interacción del usuario que reinician el contador de inactividad
    const activityEvents = [
        "mousemove",
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "click",
        ];

        activityEvents.forEach((event) =>
        window.addEventListener(event, resetTimer)
        );

        // Inicializar el temporizador al montar o cambiar de ruta
        resetTimer();

        return () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        activityEvents.forEach((event) =>
            window.removeEventListener(event, resetTimer)
        );
        };
    }, [navigate, location.pathname]);

    return null;
}