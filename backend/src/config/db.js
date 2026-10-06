// Importamos el paquete 'pg' usando el sistema de módulos ES
import pkg from 'pg';

// Extraemos la clase Pool desde el paquete
const { Pool } = pkg;

// Importamos dotenv para leer variables de entorno
import dotenv from "dotenv";

// Cargamos las variables definidas en el archivo .env
dotenv.config();

// Creamos y exportamos la instancia del Pool de PostgreSQL
export const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
});

// Evento que se dispara al conectar
pool.on('connect', () => {
    console.log("Conectado a PostgreSQL");
});

// Evento que se dispara en caso de error
pool.on("error", (err) => {
    console.error("Error en la conexión con PostgreSQL", err);
});