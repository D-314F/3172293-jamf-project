import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { ALLOWED_FOLDERS, UPLOADS_ROOT } from "./upload.middleware.js";
import { uploadRepository } from "./upload.repository.js";

const MIME_EXT_MAP = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
};

async function safeUnlink(filePath) {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
    } catch {
        // Ignorar si ya fue movido o eliminado
    }
}

export const uploadService = {
    async processUploadedImage(file, rawFolder = "products") {
        const folder = String(rawFolder || "products").trim().toLowerCase();

        if (!ALLOWED_FOLDERS.has(folder)) {
            await safeUnlink(file?.path);
            const err = new Error("Carpeta de destino inválida. Usa 'users', 'products' o 'providers'.");
            err.statusCode = 400;
            throw err;
        }

        if (!file || !file.path) {
            const err = new Error("No se recibió ningún archivo de imagen.");
            err.statusCode = 400;
            throw err;
        }

        try {
            const buffer = await fs.readFile(file.path);
            const sha256 = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 24);
            const ext = MIME_EXT_MAP[file.mimetype] || path.extname(file.originalname || "").toLowerCase() || ".png";
            const hashName = `${sha256}${ext}`;

            const targetDir = path.join(UPLOADS_ROOT, folder);
            await fs.mkdir(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, hashName);

            try {
                await fs.access(targetPath);
                // Archivo idéntico por hash ya existe: eliminamos el temporal
                await safeUnlink(file.path);
            } catch {
                await fs.rename(file.path, targetPath);
            }

            const fileUrl = `/uploads/${folder}/${hashName}`;
            const saved = await uploadRepository.create({
                folder,
                originalName: file.originalname || hashName,
                hashName,
                fileUrl,
                mimeType: file.mimetype,
                sizeBytes: file.size || buffer.length,
            });

            return {
                id: saved.id,
                url: saved.file_url,
                fileUrl: saved.file_url,
                hashName: saved.hash_name,
                originalName: saved.original_name,
                mimeType: saved.mime_type,
                sizeBytes: saved.size_bytes,
                folder: saved.folder,
            };
        } catch (err) {
            await safeUnlink(file?.path);
            throw err;
        }
    },

    async listMedia() {
        return await uploadRepository.findAll();
    },
};
