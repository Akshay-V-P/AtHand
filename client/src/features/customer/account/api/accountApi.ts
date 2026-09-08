import { api } from "../../../../services/axios";
import type { LogoutDTO } from "../dtos/LogoutDTO";
import type { CreateAddressDTO, UpdateAddressDTO } from "../dtos/AddressDTO";


export const accountApi = {
    logout: (data: LogoutDTO) =>
        api.post("/auth/logout", data),

    updateProfile: (data: { name?: string; phone?: string; profilePhotoUrl?: string }) => api.patch("/auth/update-profile", data),

    // Address endpoints
    addAddress: (data: CreateAddressDTO) => api.post("/address", data),
    getAddresses: () => api.get("/address"),
    updateAddress: (data: UpdateAddressDTO) => api.put(`/address/${data.id}`, data),
    deleteAddress: (id: string) => api.delete(`/address/${id}`)
}