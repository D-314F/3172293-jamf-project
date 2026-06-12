// UserRegisterForm componente para registrar un usuario

import { useState, useEffect } from "react";
import { Input, Select, Checkbox, Button } from "@/shared";
import { getDocumentTypes } from "@/services/selectService";
import { useNavigate } from "react-router-dom";
import { userSchema } from "../schemas/userSchema";




export default function UserRegisterForm (){
        //

        //Navegacion
        const navigate = useNavigate();

        //Estado del error
         const [errors, setErrors] = useState({})

        // Estado del formulario 
        const [FormData, setFormData] =  useState({
            userName: "",
            userEmail: "",
            userPhone: "",
            userDocumentTypes: "",
            userDocumentNumber: "",
            userPassword: "",
            // userImage: [],

            //Flags booleanos
            isStaff: false,
            isActive: true,
            isSuperUser: false,
        });

        //Estado para los tipos de documento
        const [documentTypes, setDocumentTypes] = useState([]);
    
        // Uso del estado useEffect 
        useEffect(() => {
            getDocumentTypes().then(setDocumentTypes);
        },[])

        //========================================
        //          Handle Generico
        //========================================
        /**
         * Función que se ejecuta cada vez que cambia el valor de un input del formulario
         */
        const handleChange = (e) => {
            // Se obtiene el nombre del campo y su valor
            const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            // Se copian todos los valores anteriores del estado
            ...prev,

            // Se actualiza unicamente lo que cambio
            [name]: type === "checkbox" ? checked : value,
        }));
    };

 

    //===================== HANDLE SUBMIT =============================
    const handleSubmit = async(e) => {
        //Evita que el formulario recargue la pagina
        e.preventDefault();

        //Validamos los datos del formulario contra el esquema Zod
        //saFeParse NO lanza exceptcion, retorna un objeto controlado
        const result = userSchema.safeParse(FormData);

        //Verificar en consola si el esquema está funcionado correctamente 
        // console.log(result);

        //Si la validacion falla
        if(!result.success){
            //Objeto donde almacenaremos los errores por campo
            const fieldErrors = {};

            // Recorremos cada error generado por Zod
            result.error.issues.forEach((issue) => {
                //issue.path[0] corresponde al nombre del campo
                // issue.message contiene el mensaje de error definido en el schema
                fieldErrors[issue.path[0]] = issue.message;
            });

            // Actualizamos el estado de errores para mostrarlos en el UI 
            setErrors(fieldErrors);

            // Cortamos la ejecución: NO se envia nada al backend

            return;
        }
        // Si la validacion pasa, limpiamos errores previos
        setErrors({});

        //Activamos eestado de envio (util para desahibilitar el boton)
        // setIsSubmitting(true);

        try {
            //llamamos al servivio frontend que soncume la API 
            //result.data contiene los datos ya validamos por Zod
            // const responde = await createUser(result.data); linea comentada es un servicio 

            //Log informativo para desarrolllo
            // console("Usuario Creado:", responde); igual

            //Feedback basico al usuario 
            alert("Usuario creado correctamente");

            //Navegamos a la vista anterior
            // navigate (-1) equivale a "volver atras"
            navigate(-1);
        } catch (error){
            //Caoturamos errores de red o errores lanzados por el service
            console.error("Error:" , error.message);

            //Mstramos el mensaje de error al usuario 
            alert(error.message);
        } finally {
            //Pase lo que pase, desactivamos el esrado de envio 
            // setIsSubmitting(false);
        }
    };

    //========================================
    //          Handle NameChange
    //========================================

    // const handleNameChange = (e) => {
    //     const value = e.target.value.trim();

    //     if (value === "") {
    //         console.log("El nombre no puede estar vacio");
    //     }
    // };

return(
        <div className="grid items-center justify-center">
            <h1 className="mx-auto my-12 text-title font-heading font-bold text-white">
                Registro de usuarios</h1>
            {/* Formulario*/}
            <form 
                action=""
                onSubmit={handleSubmit}
            >

                  <Input
                    label="Nombre"
                    name="userName"
                    type="text"
                    value={FormData.userName}
                    placeholder="Escribe tu nombre"
                    htmlFor="user-name"
                    onChange={handleChange}
                    error={errors.userName}
            />
            <Input
                    label="Correo"
                    name="userEmail"
                    type="email"
                    value={FormData.userEmail}
                    placeholder="Escribe tu correo electronico"
                    htmlFor="user-email"
                    onChange={handleChange}
                    error={errors.userEmail}
            />
            <Input
                    label="Telefono"
                    name="userPhone"
                    type="tel"
                    value={FormData.userPhone}
                    placeholder="Escribe tu numero de telefono"
                    htmlFor="user-phone"
                    onChange={handleChange}
                    error={errors.userPhone}
            />

            <Select
                    label="Tipo de documento"
                    name="userDocumentTypes"
                    value={FormData.userDocumentTypes}
                    htmlFor="userDocumentTypes"
                    options={documentTypes}
                    onChange={handleChange}
                    error={errors.userDocumentTypes}
            />
             <Input
                    label="Documento"
                    name="userDocumentNumber"
                    type="text"
                    value={FormData.userDocumentNumber}
                    placeholder="Escribe tu numero de documento"
                    htmlFor="user-document-number"
                    onChange={handleChange}
                    error={errors.userDocumentNumber}
            />
             <Input
                    label="Contraseña"
                    name="userPassword"
                    type="password"
                    value={FormData.userPassword}
                    placeholder="Escribe tu contraseña"
                    htmlFor="user-password"
                    onChange={handleChange}
                    error={errors.userPassword}
                    />

                    {/*Checkbox*/}
            <div className="grid gap-4 my-2">
                <Checkbox
                    id="isSuperUser"
                    name="isSuperUser"
                    label="Es super usuario"
                    checked = {FormData.isSuperUser}
                    onChange={handleChange}
                />
                <Checkbox
                    id="isStaff"
                    name="isStaff"
                    label="Es staff"
                    checked = {FormData.isStaff}
                    onChange={handleChange}
                />
                <Checkbox
                    id="isActive"
                    name="isActive"
                    label="Esta activo"
                    checked = {FormData.isActive}
                    onChange={handleChange}
                />

            </div>

            
            


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
                
            
          </form>
        </div>
    );
}


