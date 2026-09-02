import { api } from "../../../services/axios";
import type { CreateCategoryDTO } from "../../../shared/dtos/CreateCategoryDTO";
import type { GetCategoriesDTO } from "../../../shared/dtos/GetCategoryDTO";
import type { LogoutDTO } from "../../customer/account/dtos/LogoutDTO";
import type { ProviderStatus } from "../../provider/enum/ProviderStatus";
import type { EditCategoryFormData } from "../validation/EditCategorySchema";
import type { IProviderUpdateData } from "../../provider/applyAsProvider/dtos/UpdateProviderDTO";

export const adminApi = {
    getProviders: (query:string) =>
        api.get(`/admin/get-providers?${query}`),
    getProvider: (id: string) =>
        api.get(`/admin/provider/${id}`),
    updateProvider: (id: string, data: IProviderUpdateData) =>
        api.patch(`/admin/provider/${id}`, data),
    logout: (data:LogoutDTO) => 
        api.post("/auth/logout", data),
    getDocuments: (id: string) =>
        api.get(`/admin/document?id=${id}`),
    getDocumentDisplayUrl: (key: string) =>
        api.post("/provider-application/get-display-url", { key }),
    updateDocument: (id: string, data: any) => 
        api.patch(`/admin/document/${id}`, data),
    updateProviderStatus: (id: string, data:{status:ProviderStatus}) =>
        api.patch(`/admin/provider/${id}/status`, data),
    getAllCategories:(query: GetCategoriesDTO) =>
        api.get("/admin/category", {
            params:query
        }),
    createCategory: (data: CreateCategoryDTO) =>
        api.put("/admin/category", data),
    updateCategory: (categoryId: string, data: EditCategoryFormData) =>
        api.patch(`/admin/category/${categoryId}`, data),
    blockCategory: (categoryId: string) =>
        api.patch(`/admin/category/${categoryId}/block`),

    unblockCategory: (categoryId: string) =>
        api.patch(`/admin/category/${categoryId}/unblock`),

    getAllUsers: (page: number, limit: number, search?: string) =>
        api.get(`/admin/users`, { params: { page, limit, search } }),
    updateUser: (id: string, data: { name: string; phone?: string }) =>
        api.patch(`/admin/user/${id}`, data),
    blockUser: (id: string) =>
        api.patch(`/admin/user/${id}/block`),
    unblockUser: (id: string) =>
        api.patch(`/admin/user/${id}/unblock`)
}
