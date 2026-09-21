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
            timerProgressBar: "!bg-green-600",
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

export function showConfirmDeleteAlert({
  title = "¿Estás seguro?",
  text = "¡No podrás revertir esta acción!",
  confirmButtonText = "Sí, eliminar",
  cancelButtonText = "No, cancelar",
}) {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true, // Invierte el orden de los botones
    customClass: {
      popup: "rounded-2xl",
      title: "!text-amber-600 font-bold",
      confirmButton: "!bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg ml-2 font-medium",
      cancelButton: "!bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-lg font-medium",
    },
    buttonsStyling: false,
  });
}

export function showOpsAlert({
  title = "Ops, hubo un error",
  text = "¡Ocurrió un fallo inesperado en el sistema!",
  footer = '<a href="#" class="text-red-600 hover:underline">¿Por qué tengo este problema?</a>',
  confirmButtonText = "Entendido",
} = {}) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    footer,
    confirmButtonText,
    customClass: {
      popup: "rounded-2xl",
      title: "!text-red-600 font-bold",
      confirmButton: "bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium",
      footer: "text-sm text-gray-500",
    },
    buttonsStyling: false,
  });
}

// Error al crear usuario
export function showUserErrorAlert({
  title = "Error al crear usuario",
  text = "No se pudo registrar el usuario. Por favor, verifica que los campos estén correctos.",
}) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Intentar de nuevo",
    customClass: {
      popup: "rounded-2xl",
      title: "!text-red-600 font-bold",
      confirmButton: "bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition",
    },
    buttonsStyling: false,
  });
}
