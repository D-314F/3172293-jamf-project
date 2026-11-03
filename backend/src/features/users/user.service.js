import bcrypt from "bcrypt";
import { userRepository } from "./user.repository.js";

// Formatea fechas de PostgreSQL a YYYY-MM-DD para los inputs
function formatDate(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return String(dateValue);
    return date.toISOString().split("T")[0];
}

// Mapea una fila de PostgreSQL a camelCase para el Frontend
function mapUserFromDb(user) {
    return {
        id: user.id,
        userName: user.user_name,
        userType: user.user_type || "Usuario",
        userRole: user.user_type || "Usuario",
        userDocumentTypes: user.user_document_types || "",
        userDocumentNumber: user.user_document_number || "",
        userBusinessEmail: user.user_business_email || "",
        userEmail: user.user_email || "",
        userPhone: user.user_phone || "",
        userAddress: user.user_address || "",
        userStartDate: formatDate(user.user_start_date),
        userEndDate: formatDate(user.user_end_date),
        userAvatarUrl: user.user_avatar_url || null,
        isActive: user.is_active,
        is_active: user.is_active,
        isStaff: user.is_staff,
        isSuperuser: user.is_superuser,
    };
}

export const userService = {
    async getAllUsers() {
        const users = await userRepository.findAll();
        return users.map(mapUserFromDb);
    },

    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return mapUserFromDb(user);
    },

    async updateUser(id, data) {
        const existing = await userRepository.findById(id);
        if (!existing) {
            throw new Error("Usuario no encontrado");
        }

        const userData = {
            userName: data.userName ?? data.user_name ?? existing.user_name,
            userType: data.userType ?? data.user_type ?? existing.user_type,
            userDocumentTypes:
                data.userDocumentTypes ??
                data.user_document_types ??
                existing.user_document_types,
            userDocumentNumber:
                data.userDocumentNumber ??
                data.user_document_number ??
                existing.user_document_number,
            userBusinessEmail:
                data.userBusinessEmail ??
                data.user_business_email ??
                existing.user_business_email,
            userEmail: data.userEmail ?? data.user_email ?? existing.user_email,
            userPhone: data.userPhone ?? data.user_phone ?? existing.user_phone,
            userAddress:
                data.userAddress ?? data.user_address ?? existing.user_address,
            userStartDate:
                data.userStartDate !== undefined
                    ? data.userStartDate || null
                    : existing.user_start_date,
            userEndDate:
                data.userEndDate !== undefined
                    ? data.userEndDate || null
                    : existing.user_end_date,
            userAvatarUrl:
                data.userAvatarUrl ??
                data.user_avatar_url ??
                existing.user_avatar_url,
            isActive: data.isActive ?? data.is_active ?? existing.is_active,
            isStaff: data.isStaff ?? data.is_staff ?? existing.is_staff,
            isSuperuser:
                data.isSuperuser ?? data.is_superuser ?? existing.is_superuser,
        };

        return await userRepository.update(id, userData);
    },

    async createUser(data) {
        const hashedPassword = await bcrypt.hash(data.userPassword, 10);

        const userData = {
            ...data,
            userPassword: hashedPassword,
            userStartDate: data.userStartDate || null,
            userEndDate: data.userEndDate || null,
            userAvatarUrl: null,
            isStaff: data.isStaff ?? false,
            isActive: data.isActive ?? true,
            isSuperuser: data.isSuperuser ?? false,
        };

        return await userRepository.create(userData);
    },
};