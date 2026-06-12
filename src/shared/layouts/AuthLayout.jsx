import { useState, useEffect } from "react";

import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/bg-1.png";
import { 
    Input, 
    Button, 
    Select, 
    Checkbox 
} 
from "@/shared";
import { getDocumentTypes } from "../../services/selectService";



export default function AuthLayout() {

    //Estado para los tipos de documento
    const [documentTypes, setDocumentTypes] = useState([]);

    // Uso del estado useEffect 
    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
    },[])

    return (
        <> 
        <div 
        className = "min-h-screen w-full"
        style={{
            backgroundImage: `url(${authBg})`, // <--- Esta manera es en la que colocamos imagenes
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
    >
            <main className = "mx-auto">
                <Input
                    label="Nombre"
                    type="text"
                    placeholder="Escribe tu nombre"
                    htmlFor="user-name"
                    variant = "primary"
                    size = "sm"
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
                <Input
                    label="Borrar Tipo de documento "
                    type="tel"
                    placeholder="Escribe tu telefono"
                    htmlFor="user-phone"
                />
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
              

                <Checkbox />

                
                <Outlet />
            </main>
        </div>
        </>
    );
}