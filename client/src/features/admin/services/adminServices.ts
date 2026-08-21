import { accountApi } from "../../customer/account/api/accountApi"
import type { LogoutDTO } from "../../customer/account/dtos/LogoutDTO"
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
    }
}