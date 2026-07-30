import { accountApi } from "../api/accountApi"

export const accountServices = {
    async logout() {
        const response = await accountApi.logout()
        return response
    }
}