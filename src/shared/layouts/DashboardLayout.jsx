import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/bg-3.jpg";
import { UserRegisterForm } from "@/features/users";

export default function DashboardLayout() {
    return (
        <>
        <div 
        className = "min-h-screen w-full put-20"
        style={{
            backgroundImage: `url(${authBg})`, // <--- Esta manera es en la que colocamos imagenes
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
    >
            <main className = "mx-auto">
                <UserRegisterForm />
                <Outlet />
            </main>
        </div>
        </>
    );
}