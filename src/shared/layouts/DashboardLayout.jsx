import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/bf-2.png";
import { UserRegisterForm } from "@/features/users";
// import DishForm from "@/features/dishes/components/dishForm";

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
                {/* <DishForm /> */}
                <Outlet />
            </main>
        </div>
        </>
    );
}
