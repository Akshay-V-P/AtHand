import { providerApplicationApi } from "../api/providerApplicationApi";
import type { BusinessDetailsDTO } from "../dtos/BusinessDetailsDTO";
import type { DocumentUploadDTO } from "../dtos/DocumentUploadDTO";

export const apiService = {
    async updateDraft(data:BusinessDetailsDTO) {
        const draft = await providerApplicationApi.updateDraft(data)
        return draft
    },
    async getCategories() {
        const categories = await providerApplicationApi.getCategories()
        return categories
    },
    async createProvider(userId: string) {
        const response = await providerApplicationApi.createAccount(userId)
        return response
    },
    async getDraft(userId: string) {
        const response = await providerApplicationApi.getDraft(userId)
        return response
    },
    async uploadDocument(data: DocumentUploadDTO) {
        const document = await providerApplicationApi.uploadDocument(data)
        return document
    },
    async getProvider(userId: string) {
        const response = await providerApplicationApi.getProvider(userId)
        return response
    }
}