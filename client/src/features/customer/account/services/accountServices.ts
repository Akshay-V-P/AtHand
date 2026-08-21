import { accountApi } from "../api/accountApi"
import type { LogoutDTO } from "../dtos/LogoutDTO"

export const accountServices = {
    async logout(data:LogoutDTO) {
        const response = await accountApi.logout(data)
        return response
    }
}