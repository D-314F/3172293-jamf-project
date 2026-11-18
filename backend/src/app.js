// Importamos Express
import express from "express";
import path from "path";

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
import uploadRoutes from "./features/uploads/upload.routes.js";

// Instancia principal de Express
const app = express();

// Middleware de CORS (permite desarrollo local y dominios configurados en CORS_ORIGIN)
const allowedOrigins = (
    process.env.CORS_ORIGIN || "http://localhost:5173"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Origen no permitido por CORS"));
        },
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Servir archivos físicos subidos en backend/uploads
app.use("/uploads", express.static(path.resolve("uploads")));

// Healthcheck para monitoreo y despliegue gratuito
app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true, service: "jamf-backend" });
});

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
app.use("/api/uploads", uploadRoutes);

// Exportamos la app configurada
export default app;
