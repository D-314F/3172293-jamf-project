import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/bf-1.png";
import { Input, Button } from "@/shared";

export default function AuthLayout() {
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
        <h1 className="mb-3 text-white"> Bienvenido a JAMF </h1>
            <main className = "mx-auto">
                <Input
                    label="Nombre"
                    type="text"
                    placeholder="Escribe tu nombre"
                    htmlFor="user-name"
                    variant = "primary"
                    size = "sm"
                />

                    {/* Actions */}
                <div className="flex gap-6 items-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        onClick={() => {console.log("Se oprimió el submit")}}
                    >
                     Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        type="submit"
                        onClick={() => {console.log("Se oprimió el submit")}}
                    >
                     Guardar
                    </Button>
                </div>
                
                <Outlet />
            </main>
        </div>
        </>
    );
}
