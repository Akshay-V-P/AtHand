import { accountApi } from "../../customer/account/api/accountApi"
import type { LogoutDTO } from "../../customer/account/dtos/LogoutDTO"
import type { ProviderStatus } from "../../provider/enum/ProviderStatus"
import { adminApi } from "../api/adminApi"

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

    async logout(data:LogoutDTO) {
        const response = await accountApi.logout(data)
        return response
    },
    
    async getDocuments(id: string) {
        const response = await adminApi.getDocuments(id)
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
    }
    
}