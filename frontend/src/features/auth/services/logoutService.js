// Cierra la sesión eliminando el token guardado
export function logout() {
    sessionStorage.removeItem("token");
}