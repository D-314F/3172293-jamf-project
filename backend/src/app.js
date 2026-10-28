// Importamos Express
import express from "express";

// Importamos CORS
import cors from "cors";

import userRoutes from "./features/users/user.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import dishRoutes from "./features/dishes/dish.routes.js";
import orderRoutes from "./features/orders/order.routes.js";
import providerRoutes from "./features/providers/provider.routes.js";
import inventoryRoutes from "./features/inventory/inventory.routes.js";

// Instancia principal de Express
const app = express();

// Middleware de CORS
app.use(cors({ origin: "http://localhost:5173" }));


app.use(express.json());

// Registro de rutas 
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/inventory", inventoryRoutes);

// Exportamos la app configurada
export default app;