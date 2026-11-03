import { providerRepository } from "./provider.repository.js";

function mapProviderFromDb(provider) {
    return {
        id: provider.id,
        // Compatibilidad con la tabla y formularios
        fullName: provider.provider_name,
        providerName: provider.provider_name,
        userType: "Proveedor",
        documentType: provider.provider_document_type,
        providerDocumentType: provider.provider_document_type,
        providerDocumentNumber: provider.provider_document_number,
        email: provider.provider_email,
        providerEmail: provider.provider_email,
        phone: provider.provider_phone,
        providerPhone: provider.provider_phone,
        address: provider.provider_address,
        providerAddress: provider.provider_address,
        products: provider.provider_products,
        providerProducts: provider.provider_products,
        observations: provider.provider_observations || "",
        providerObservations: provider.provider_observations || "",
        providerImageUrl: provider.provider_image_url || null,
        providerStatus: provider.provider_status,
        accountStatus: provider.provider_status ? "Activo" : "Inactivo",
        isActive: provider.provider_status,
    };
}

export const providerService = {
    async getAllProviders() {
        const providers = await providerRepository.findAll();
        return providers.map(mapProviderFromDb);
    },

    async getProviderById(id) {
        const provider = await providerRepository.findById(id);
        if (!provider) {
            throw new Error("Proveedor no encontrado");
        }
        return mapProviderFromDb(provider);
    },

    async updateProvider(id, data) {
        const existing = await providerRepository.findById(id);
        if (!existing) {
            throw new Error("Proveedor no encontrado");
        }

        const providerData = {
            providerDocumentType:
                data.providerDocumentType ??
                data.documentType ??
                existing.provider_document_type,
            providerDocumentNumber:
                data.providerDocumentNumber ??
                existing.provider_document_number,
            providerName:
                data.providerName ??
                data.fullName ??
                existing.provider_name,
            providerObservations:
                data.providerObservations !== undefined
                    ? data.providerObservations
                    : existing.provider_observations,
            providerProducts:
                data.providerProducts ??
                data.products ??
                existing.provider_products,
            providerPhone:
                data.providerPhone ??
                data.phone ??
                existing.provider_phone,
            providerEmail:
                data.providerEmail ??
                data.email ??
                existing.provider_email,
            providerAddress:
                data.providerAddress ??
                data.address ??
                existing.provider_address,
            providerImageUrl:
                data.providerImageUrl ?? existing.provider_image_url,
            providerStatus:
                data.providerStatus !== undefined
                    ? Boolean(data.providerStatus)
                    : data.accountStatus !== undefined
                    ? data.accountStatus === "Activo" || data.accountStatus === true
                    : existing.provider_status,
        };

        return await providerRepository.update(id, providerData);
    },

    async createProvider(data) {
        const providerData = {
            ...data,
            providerObservations: data.providerObservations || null,
            providerImageUrl: null,
            providerStatus: data.providerStatus ?? true,
        };

        return await providerRepository.create(providerData);
    },
};