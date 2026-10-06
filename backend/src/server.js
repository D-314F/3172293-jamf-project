// Punto de arranque del servidor
import app from "./app.js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Definir el puerto
const PORT = process.env.PORT || 4000;

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});