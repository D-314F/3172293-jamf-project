import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/bf-2.png";
// import authBg2 from "@/assets/images/bf-3.png"; <-- esta es la imagen del login
import { Navbar } from "@/shared";

import { UserRegisterForm } from "@/features/users";
// import { LoginForm } from "@/features/users";

// import DishForm from "@/features/dishes/components/dishForm";
// import { ProviderCreateForm } from "@/features/providers";
// import { OrderForm  } from "@/features/orders";
// import { InventoryForm } from "@/features/inventory";
// import { InventoryUltimosPasos } from "@/features/inventory";


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

        // Este de aca es para mostrar la imagen el login
        // style={{
        //     backgroundImage: `url(${authBg2})`, // <--- Esta manera es en la que colocamos imagenes
        //     backgroundSize: "cover",
        //     backgroundPosition: "center",
        // }}
        >
            <main className = "mx-auto">

                <Navbar/>
                <UserRegisterForm />
                {/* <LoginForm /> */}

                {/* <ProviderCreateForm /> */}
                {/* <OrderForm /> */}
                {/* <InventoryForm /> */}
                {/* <InventoryUltimosPasos /> */}
                {/* <DishForm />   */}



                <Outlet />
            </main>
        </div>
        </>
    );
}
