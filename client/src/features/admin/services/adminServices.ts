import type { CreateCategoryDTO } from "../../../shared/dtos/CreateCategoryDTO"
import type { GetCategoriesDTO } from "../../../shared/dtos/GetCategoryDTO"
import { accountApi } from "../../customer/account/api/accountApi"
import type { LogoutDTO } from "../../customer/account/dtos/LogoutDTO"
import { adminApi } from "../api/adminApi"
import type { EditCategoryFormData } from "../validation/EditCategorySchema"
import type { IProviderUpdateData } from "../../provider/applyAsProvider/dtos/UpdateProviderDTO"

export const adminServices = {
    async getProviders(query?: object) {
        const url = new URLSearchParams()
        
        for (let [key, value] of Object.entries(query || {})) {
            if (value !== undefined) {
                url.append(key, String(value))
            }
        }
        return adminApi.getProviders(url.toString())
    },

    async getProvider(id: string) {
        const response = await adminApi.getProvider(id)
        return response
    },
    async updateProvider(id: string, data: IProviderUpdateData) {
        return adminApi.updateProvider(id, data)
    },

    async logout(data:LogoutDTO) {
        const response = await accountApi.logout(data)
        return response
    },
    
    async getDocuments(id: string) {
        const response = await adminApi.getDocuments(id)
        return response
    },
    async getDocumentDisplayUrl(key: string) {
        const response = await adminApi.getDocumentDisplayUrl(key)
        return response
    },
    async updateDocument(id: string, data: { documentKey?: string; verificationStatus: string; remarks?: string; documentType?: string }) {
        const response = await adminApi.updateDocument(id, data);
        return response;
    },
    async approveProvider(id: string) {
        const response = await adminApi.updateProviderStatus(id, {status:"ACTIVE"})
        return response
    },
    async rejectProvider(id: string) {
        const response = await adminApi.updateProviderStatus(id, { status: "DRAFT" })
        return response
    },
    async suspendProvider(id: string) {
        const response = await adminApi.updateProviderStatus(id, { status: "BLOCKED" })
        return response
    },
    async unblockProvider(id: string) {
        const response = await adminApi.updateProviderStatus(id, { status: "ACTIVE" })
        return response
    },

    async getAllCategories(query: GetCategoriesDTO) {
        const response = await adminApi.getAllCategories(query)
        return response
    },

    async createCategory(data: CreateCategoryDTO) {
        const response = await adminApi.createCategory(data)
        return response
    },

    async updateCategory(categoryId: string, data: EditCategoryFormData) {
        const response = await adminApi.updateCategory(categoryId, data)
        return response
    },

    async blockCategory(categoryId: string) {
        return adminApi.blockCategory(categoryId)
    },

    async unblockCategory(categoryId: string) {
        return adminApi.unblockCategory(categoryId)
    },

    async getAllUsers(data:any) {
        const response = await adminApi.getAllUsers(data.page, data.limit, data.search)
        return response
    },
    async updateUser(id: string, data: { name: string; phone?: string }) {
        return adminApi.updateUser(id, data)
    },
    async blockUser(id: string) {
        return adminApi.blockUser(id)
    },
    async unblockUser(id: string) {
        return adminApi.unblockUser(id)
    }
    
}
