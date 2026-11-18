import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";

export const UPLOADS_ROOT = path.resolve("uploads");
export const TEMP_DIR = path.join(UPLOADS_ROOT, "temp");
export const ALLOWED_FOLDERS = new Set(["users", "products", "providers"]);

const ALLOWED_MIME_TYPES = new Map([
    ["image/jpeg", ".jpg"],
    ["image/jpg", ".jpg"],
    ["image/png", ".png"],
    ["image/webp", ".webp"],
    ["image/gif", ".gif"],
]);

// Garantiza que las carpetas base existan incluso en entornos recién clonados
for (const dir of [UPLOADS_ROOT, TEMP_DIR, path.join(UPLOADS_ROOT, "users"), path.join(UPLOADS_ROOT, "products"), path.join(UPLOADS_ROOT, "providers")]) {
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
        cb(null, TEMP_DIR);
    },
    filename(_req, file, cb) {
        const ext = ALLOWED_MIME_TYPES.get(file.mimetype) || path.extname(file.originalname || "").toLowerCase() || ".bin";
        const tempName = `tmp-${crypto.randomUUID()}${ext}`;
        cb(null, tempName);
    },
});

const fileFilter = (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        const err = new Error("Formato de archivo no permitido. Usa PNG, JPG, WEBP o GIF.");
        err.statusCode = 400;
        return cb(err, false);
    }
    return cb(null, true);
};

const multerUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export function uploadSingleImage(req, res, next) {
    multerUpload.single("image")(req, res, (err) => {
        if (!err) return next();
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "La imagen supera el tamaño máximo permitido de 5 MB." });
        }
        return res.status(err.statusCode || 400).json({ error: err.message || "Error procesando la imagen." });
    });
}
