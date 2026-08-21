import { providerApplicationApi } from "../api/providerApplicationApi";
import type { BusinessDetailsDTO } from "../dtos/BusinessDetailsDTO";
import type { DocumentUploadDTO } from "../dtos/DocumentUploadDTO";
import type { PresignedDisplayUrlDTO } from "../dtos/PresignedUrlDTO";
import type { IProviderUpdateData } from "../dtos/UpdateProviderDTO";

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
    async getProvider(id: string) {
        const response = await providerApplicationApi.getProvider(id)
        return response
    },
    async getPresignedDisplayUrl(key:string) {
        const response = await providerApplicationApi.getPresignedUrl({key})
        return response
    },
    async updateProvider(id: string, updateData: IProviderUpdateData) {
        const response = await providerApplicationApi.updateProvider({ id, updateData })
        return response
    }
}