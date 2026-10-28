import { providerRepository } from "./provider.repository.js";

export const providerService = {
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