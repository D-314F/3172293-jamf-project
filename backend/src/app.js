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
import permissionsRoutes from "./features/permissions/permissions.routes.js";
import groupsRoutes from "./features/groups/groups.routes.js";
import accessRoutes from "./features/access/access.routes.js";

// Instancia principal de Express
const app = express();

// Middleware de CORS
app.use(cors({ origin: "http://localhost:5173" }));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Registro de rutas 
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/access", accessRoutes);

// Exportamos la app configurada
export default app;