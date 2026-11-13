import accessService from "../features/access/access.service.js";

const requirePermission = (permissionCode) => {
    return async (req, res, next) => {
        try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "No autenticado" });
        }

        const granted = await accessService.hasPermission(userId, permissionCode);
        if (!granted) {
            return res.status(403).json({
            error: `No tienes permiso: ${permissionCode}`,
            });
        }

        next();
        } catch (err) {
        return res.status(500).json({ error: err.message });
        }
    };
};

export default requirePermission;