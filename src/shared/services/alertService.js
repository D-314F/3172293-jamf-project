// src/shared/services/alertService.js

import Swal from "sweetalert2";

export function showSuccessAlert({
    title = "Éxito",
    text = "",
    confirmButtonText = "Aceptar",
    timer = 1000,
}) {
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonText,
        timer,
        timerProgressBar: true,

        customClass: {
            popup: "rounded-2x1",
            title: "text-green-600",  
            confirmButton: "bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg",
        },

        buttonsStyling: false,
    });
}

export function showCancelAlert({
    // Los valores despues del = son valores por defecto
    title = "Cancelado",
    text = "",
    confirmButtonText = "Aceptar",
    timer = 1000,
}) {
   // Swal.fire() crea el modal.
   return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,
    showConfirmButton: true,

    customClass: {
      popup: "rounded-2xl",
      title: "!text-red-600",
      confirmButton: "bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg text-text-inverse",
      timerProgressBar: "!bg-red-600",
    },
    buttonsStyling: false,
  });

}
// El signo de ! nos sirve para decirle al sistema que es importante
