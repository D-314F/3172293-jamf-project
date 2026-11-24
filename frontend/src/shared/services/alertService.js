// src/shared/services/alertService.js
import Swal from "sweetalert2";

// Configuración base compartida vinculada a las variables CSS del proyecto
const baseAlertConfig = {
  background: "var(--color-background-inverse)",
  color: "var(--color-text-inverse)",
  buttonsStyling: false,
};

// 1. Alerta de Éxito
export function showSuccessAlert({
  title = "Éxito",
  text = "",
  confirmButtonText = "Aceptar",
  timer = 1500,
}) {
  return Swal.fire({
    ...baseAlertConfig,
    icon: "success",
    iconColor: "var(--color-success)",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,
    customClass: {
      popup:
        "rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 font-[var(--font-body)]",
      title:
        "text-title font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]",
      htmlContainer:
        "text-medium font-[var(--font-body)] text-[var(--color-text-muted)] mt-2",
      confirmButton:
        "bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:brightness-110 font-bold px-6 py-2.5 rounded-xl shadow-lg transition cursor-pointer",
      timerProgressBar: "!bg-[var(--color-brand)]",
    },
  });
}

// 2. Alerta de Cancelar / Descartar
export function showCancelAlert({
  title = "Cancelado",
  text = "",
  confirmButtonText,
  cancelButtonText = "No, seguir aquí",
  timer = 2000,
}) {
  const isFormExitQuestion =
    title.includes("?") ||
    text.includes("perderán") ||
    text.includes("guardarán");

  if (isFormExitQuestion) {
    return Swal.fire({
      ...baseAlertConfig,
      icon: "warning",
      iconColor: "var(--color-brand)",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmButtonText || "Sí, salir",
      cancelButtonText,
      reverseButtons: true,
      customClass: {
        popup:
          "rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 font-[var(--font-body)]",
        title:
          "text-title font-bold font-[var(--font-heading)] text-[var(--color-brand-soft)]",
        htmlContainer:
          "text-medium font-[var(--font-body)] text-[var(--color-text-muted)] mt-2",
        confirmButton:
          "bg-[var(--color-brand-soft)] text-[var(--color-text-on-solid)] hover:opacity-90 font-bold px-5 py-2.5 rounded-xl ml-3 shadow transition cursor-pointer",
        cancelButton:
          "bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] font-medium px-5 py-2.5 rounded-xl transition cursor-pointer",
      },
    });
  }

  return Swal.fire({
    ...baseAlertConfig,
    icon: "error",
    iconColor: "var(--color-brand-soft)",
    title,
    text,
    confirmButtonText: confirmButtonText || "Aceptar",
    timer,
    timerProgressBar: true,
    showConfirmButton: true,
    customClass: {
      popup:
        "rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 font-[var(--font-body)]",
      title:
        "text-title font-bold font-[var(--font-heading)] text-[var(--color-brand-soft)]",
      htmlContainer:
        "text-medium font-[var(--font-body)] text-[var(--color-text-muted)] mt-2",
      confirmButton:
        "bg-[var(--color-brand-soft)] text-[var(--color-text-on-solid)] hover:opacity-90 font-bold px-6 py-2.5 rounded-xl transition cursor-pointer",
      timerProgressBar: "!bg-[var(--color-brand-soft)]",
    },
  });
}

// 3. Alerta de Confirmación de Eliminación
export function showConfirmDeleteAlert({
  title = "¿Estás seguro?",
  text = "¡No podrás revertir esta acción!",
  confirmButtonText = "Sí, eliminar",
  cancelButtonText = "No, cancelar",
}) {
  return Swal.fire({
    ...baseAlertConfig,
    title,
    text,
    icon: "warning",
    iconColor: "var(--color-brand)",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      popup:
        "rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 font-[var(--font-body)]",
      title:
        "text-title font-bold font-[var(--font-heading)] text-[var(--color-brand-soft)]",
      htmlContainer:
        "text-medium font-[var(--font-body)] text-[var(--color-text-muted)] mt-2",
      confirmButton:
        "bg-[var(--color-brand-soft)] text-[var(--color-text-on-solid)] hover:opacity-90 font-bold px-5 py-2.5 rounded-xl ml-3 shadow transition cursor-pointer",
      cancelButton:
        "bg-[var(--color-surface-dark)] text-[var(--color-text-inverse)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] font-medium px-5 py-2.5 rounded-xl transition cursor-pointer",
    },
  });
}

// 4. Alerta de Fallo Genérico del Sistema
export function showOpsAlert({
  title = "Ops, hubo un error",
  text = "¡Ocurrió un fallo inesperado en el sistema!",
  footer = '<a href="#" class="text-[var(--color-brand-soft)] hover:underline">¿Por qué tengo este problema?</a>',
  confirmButtonText = "Entendido",
} = {}) {
  return Swal.fire({
    ...baseAlertConfig,
    icon: "error",
    iconColor: "var(--color-brand-soft)",
    title,
    text,
    footer,
    confirmButtonText,
    customClass: {
      popup:
        "rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 font-[var(--font-body)]",
      title:
        "text-title font-bold font-[var(--font-heading)] text-[var(--color-brand-soft)]",
      htmlContainer:
        "text-medium font-[var(--font-body)] text-[var(--color-text-muted)] mt-2",
      confirmButton:
        "bg-[var(--color-brand-soft)] text-[var(--color-text-on-solid)] hover:opacity-90 font-bold px-6 py-2.5 rounded-xl shadow transition cursor-pointer",
      footer: "text-small text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3",
    },
  });
}

// 5. Alerta de Error de Usuario / Validación
export function showUserErrorAlert({
  title = "Error de validación",
  text = "No se pudo completar la operación. Por favor verifica la información ingresada.",
  confirmButtonText = "Intentar de nuevo",
}) {
  return Swal.fire({
    ...baseAlertConfig,
    icon: "error",
    iconColor: "var(--color-brand-soft)",
    title,
    text,
    confirmButtonText,
    customClass: {
      popup:
        "rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 font-[var(--font-body)]",
      title:
        "text-title font-bold font-[var(--font-heading)] text-[var(--color-brand-soft)]",
      htmlContainer:
        "text-medium font-[var(--font-body)] text-[var(--color-text-muted)] mt-2",
      confirmButton:
        "bg-[var(--color-brand-soft)] text-[var(--color-text-on-solid)] hover:opacity-90 font-bold px-6 py-2.5 rounded-xl shadow transition cursor-pointer",
    },
  });
}

// Alias de compatibilidad
export const showErrorAlert = showUserErrorAlert;