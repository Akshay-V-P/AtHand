import { api } from "../../../services/axios";
import type { LogoutDTO } from "../../customer/account/dtos/LogoutDTO";
import type { ProviderStatus } from "../../provider/enum/ProviderStatus";

export const adminApi = {
    getProviders: (query:string) =>
        api.get(`/admin/get-providers?${query}`),
    getProvider: (id: string) =>
        api.get(`/admin/provider/${id}`),
    logout: (data:LogoutDTO) => 
        api.post("/auth/logout", data),
    getDocuments: (id: string) =>
        api.get(`/admin/document?id=${id}`),
    updateDocument: (id: string, data: any) => 
        api.patch(`/admin/document/${id}`, data),
    updateProviderStatus: (id: string, data:{status:ProviderStatus}) =>
        api.patch(`/admin/provider/${id}/status`, data)
}