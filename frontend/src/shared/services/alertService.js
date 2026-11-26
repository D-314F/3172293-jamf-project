// src/shared/services/alertService.js
import Swal from "sweetalert2";

// Pasa el data-theme del <html> al popup de Swal para que herede las variables CSS
function getThemeConfig() {
  return {
    didOpen: (popup) => {
      const theme = document.documentElement.getAttribute("data-theme") || "";
      if (theme) popup.setAttribute("data-theme", theme);
    },
  };
}

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
    ...getThemeConfig(),
    customClass: {
      popup:
        "!bg-[var(--color-background-inverse)] !text-[var(--color-text-inverse)] rounded-2xl",
      title: "!text-[var(--color-success)] font-bold",
      htmlContainer: "!text-[var(--color-text-muted)]",
      confirmButton:
        "!bg-[var(--color-success)] !text-white px-4 py-2 rounded-lg font-medium",
      timerProgressBar: "!bg-[var(--color-success)]",
    },
    buttonsStyling: false,
  });
}

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
      icon: "warning",
      iconColor: "var(--color-brand)",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmButtonText || "Sí, salir",
      cancelButtonText,
      reverseButtons: true,
      ...getThemeConfig(),
      customClass: {
        popup:
          "!bg-[var(--color-background-inverse)] !text-[var(--color-text-inverse)] rounded-2xl",
        title: "!text-[var(--color-brand-soft)] font-bold",
        htmlContainer: "!text-[var(--color-text-muted)]",
        confirmButton:
          "!bg-[var(--color-brand-soft)] !text-white px-4 py-2 rounded-lg ml-2 font-medium",
        cancelButton:
          "!bg-[var(--color-surface-dark)] !text-[var(--color-text-inverse)] border border-[var(--color-border)] px-4 py-2 rounded-lg font-medium",
      },
      buttonsStyling: false,
    });
  }

  return Swal.fire({
    icon: "error",
    iconColor: "var(--color-brand-soft)",
    title,
    text,
    confirmButtonText: confirmButtonText || "Aceptar",
    timer,
    timerProgressBar: true,
    showConfirmButton: true,
    ...getThemeConfig(),
    customClass: {
      popup:
        "!bg-[var(--color-background-inverse)] !text-[var(--color-text-inverse)] rounded-2xl",
      title: "!text-[var(--color-brand-soft)] font-bold",
      htmlContainer: "!text-[var(--color-text-muted)]",
      confirmButton:
        "!bg-[var(--color-brand-soft)] !text-white px-4 py-2 rounded-lg font-medium",
      timerProgressBar: "!bg-[var(--color-brand-soft)]",
    },
    buttonsStyling: false,
  });
}

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
    iconColor: "var(--color-brand)",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    ...getThemeConfig(),
    customClass: {
      popup:
        "!bg-[var(--color-background-inverse)] !text-[var(--color-text-inverse)] rounded-2xl",
      title: "!text-[var(--color-brand)] font-bold",
      htmlContainer: "!text-[var(--color-text-muted)]",
      confirmButton:
        "!bg-[var(--color-brand-soft)] !text-white px-4 py-2 rounded-lg ml-2 font-medium",
      cancelButton:
        "!bg-[var(--color-surface-dark)] !text-[var(--color-text-inverse)] border border-[var(--color-border)] px-4 py-2 rounded-lg font-medium",
    },
    buttonsStyling: false,
  });
}

export function showOpsAlert({
  title = "Ops, hubo un error",
  text = "¡Ocurrió un fallo inesperado en el sistema!",
  footer = '<a href="#" class="underline" style="color: var(--color-brand-soft)">¿Por qué tengo este problema?</a>',
  confirmButtonText = "Entendido",
} = {}) {
  return Swal.fire({
    icon: "error",
    iconColor: "var(--color-brand-soft)",
    title,
    text,
    footer,
    confirmButtonText,
    ...getThemeConfig(),
    customClass: {
      popup:
        "!bg-[var(--color-background-inverse)] !text-[var(--color-text-inverse)] rounded-2xl",
      title: "!text-[var(--color-brand-soft)] font-bold",
      htmlContainer: "!text-[var(--color-text-muted)]",
      confirmButton:
        "!bg-[var(--color-brand-soft)] !text-white px-4 py-2 rounded-lg font-medium",
      footer: "!bg-[var(--color-background-inverse)] !text-[var(--color-text-muted)] text-small",
    },
    buttonsStyling: false,
  });
}

export function showUserErrorAlert({
  title = "Error de validación",
  text = "No se pudo completar la operación. Por favor verifica la información ingresada.",
  confirmButtonText = "Intentar de nuevo",
}) {
  return Swal.fire({
    icon: "error",
    iconColor: "var(--color-brand-soft)",
    title,
    text,
    confirmButtonText,
    ...getThemeConfig(),
    customClass: {
      popup:
        "!bg-[var(--color-background-inverse)] !text-[var(--color-text-inverse)] rounded-2xl",
      title: "!text-[var(--color-brand-soft)] font-bold",
      htmlContainer: "!text-[var(--color-text-muted)]",
      confirmButton:
        "!bg-[var(--color-brand-soft)] !text-white px-4 py-2 rounded-lg font-medium transition",
    },
    buttonsStyling: false,
  });
}


export function showInfoAlert({
  title = "Información",
  text = "",
  confirmButtonText = "Entendido",
} = {}) {
  return Swal.fire({
    icon: "info",
    iconColor: "var(--color-brand)",
    title,
    text,
    confirmButtonText,
    ...getThemeConfig(),
    customClass: {
      popup:
        "!bg-[var(--color-background-inverse)] !text-[var(--color-text-inverse)] rounded-2xl",
      title: "!text-[var(--color-brand)] font-bold",
      htmlContainer: "!text-[var(--color-text-muted)]",
      confirmButton:
        "!bg-[var(--color-brand)] !text-[var(--color-text-on-solid)] px-4 py-2 rounded-lg font-medium",
    },
    buttonsStyling: false,
  });
}