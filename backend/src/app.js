// Importamos Express
import express from "express";

// Importamos CORS
import cors from "cors";

import userRoutes from "./features/users/user.routes.js";
import authRoutes from "./features/auth/auth.routes.js";

// Instancia principal de Express
const app = express();

// Middleware de CORS
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware para parsear cuerpos JSON
app.use(express.json());

// Registro de rutas 
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Exportamos la app configurada
export default app;