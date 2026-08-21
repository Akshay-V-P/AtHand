import { api } from "../../../services/axios";
import type { LogoutDTO } from "../../customer/account/dtos/LogoutDTO";

export const adminApi = {
    getProviders: (query:string) =>
        api.get(`/admin/get-providers?${query}`),
    getProvider: (id: string) =>
        api.get(`/admin/get-provider/${id}`),
    logout: (data:LogoutDTO) => 
        api.post("/auth/logout", data),
}