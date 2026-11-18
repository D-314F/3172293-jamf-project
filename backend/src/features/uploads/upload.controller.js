import { uploadService } from "./upload.service.js";

export const uploadController = {
    async uploadImage(req, res) {
        try {
            const { folder } = req.params;
            const media = await uploadService.processUploadedImage(req.file, folder);
            return res.status(201).json(media);
        } catch (err) {
            console.error("ERROR AL SUBIR IMAGEN:", err.message);
            return res.status(err.statusCode || 500).json({
                error: err.message || "Error interno al almacenar la imagen.",
            });
        }
    },

    async getAll(_req, res) {
        try {
            const files = await uploadService.listMedia();
            return res.status(200).json(files);
        } catch (err) {
            console.error("ERROR AL LISTAR MULTIMEDIA:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
};
