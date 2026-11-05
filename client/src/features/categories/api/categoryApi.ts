import { api } from "@/services/axios";

export const categoryApi = {
    fetchProvider: (params: any) =>
        api.get('/provider', params),
    fetchCategories: () =>
        api.get('/category/active/dropdown')
}