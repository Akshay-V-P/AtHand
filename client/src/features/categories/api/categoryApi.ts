import { api } from "@/services/axios";

export const categoryApi = {
    fetchProvider: (params: any) =>
        api.get('/provider', params),
    fetchProviderProfile: (id: string, params?: { lat?: number; lng?: number }) =>
        api.get(`/provider/${id}`, { params }),
    fetchCategories: () =>
        api.get('/category/active/dropdown')
}