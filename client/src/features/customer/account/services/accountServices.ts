import { accountApi } from "../api/accountApi"
import type { LogoutDTO } from "../dtos/LogoutDTO"
import type { CreateAddressDTO, UpdateAddressDTO } from "../dtos/AddressDTO"

export const accountServices = {
    async logout(data: LogoutDTO) {
        const response = await accountApi.logout(data)
        return response
    },

    async updateProfile(data: { name?: string; phone?: string; profilePhotoUrl?: string }) {
        const response = await accountApi.updateProfile(data)
        return response.data
    },

    async addAddress(data: CreateAddressDTO) {
        const response = await accountApi.addAddress(data)
        return response.data
    },

    async getAddresses() {
        const response = await accountApi.getAddresses()
        return response.data
    },

    async updateAddress(data: UpdateAddressDTO) {
        const response = await accountApi.updateAddress(data)
        return response.data
    },

    async deleteAddress(id: string) {
        const response = await accountApi.deleteAddress(id)
        return response.data
    }
}