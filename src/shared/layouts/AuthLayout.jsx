import { useState, useEffect } from "react";

import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/bf-1.png";
import { 
    Input,
    Button,
    Select,
    Checkbox
} from "@/shared";

import { getDocumentTypes } from "@/services/selectService";

export default function AuthLayout() {
    //Estado para los tipos de documento
    const [documentTypes, setDocumentTypes] = useState([]);

    // Uso del estado useEffect 
    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
    },[]);

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
        {/* Contenedor principal */}
        <h1 className="mb-3 text-white"> Bienvenido a JAMF </h1>

        {/* Contenedor del formulario */}

        {/* Esta vista no es el formulario final. Es una vista de prueba    para validar los componentes base: Input, Button, Select y Checkbox usando los estilos del proyecto. */}

            <main className = "mx-auto">
                <Input
                    label="Nombre"
                    type="text"
                    placeholder="Escribe tu nombre"
                    htmlFor="user-name"
                    variant = "primary"
                    size = "md"
                />
                <Input
                    label="Correo"
                    type="email"
                    placeholder="Escribe tu correo"
                    htmlFor="user-email"
                    variant = "primary"
                    size = "md"
                />
                <Input
                    label="Telefono "
                    type="tel"
                    placeholder="Escribe tu telefono"
                    htmlFor="user-phone"
                    variant = "primary"
                    size = "lg"
                />
                {/* <Input
                    label="Borrar Tipo de documento "
                    type="tel"
                    placeholder="Escribe tu telefono"
                    htmlFor="user-phone"
                /> */}

                <Input
                    label="Documento"
                    type="text"
                    placeholder="Escribe tu documento"
                    htmlFor="user-document-number"
                />

                <Select
                    label="Tipo de documento"
                    name="userDocumentTypes"
                    htmlFor="userDocumentTypes"
                    options={documentTypes}
                />

                    {/* Actions */}
                <div className="mt-4 flex gap-6 items-center">
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

                {/* Actions */}

                <div className="mt-4">
                    <Checkbox 
                        label="Acepto los términos y condiciones"
                    />
                </div>
                
                <Outlet />
            </main>
        </div>
        </>
    );
}
