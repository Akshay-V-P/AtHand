import { api } from "../../../../services/axios";

export const providerServiceApi = {
    createService: async (data: any) => {
        const response = await api.post('/provider-service', data);
        return response.data;
    },
    getActiveCategories: async () => {
        const response = await api.get('/category/active/dropdown');
        return response.data;
    },
    getProviderServices: async (params: { page: number; limit: number; providerId: string }) => {
        const response = await api.get('/provider-service', { params });
        return response.data;
    },
    getProviderServiceById: async (id: string) => {
        const response = await api.get(`/provider-service/${id}`);
        return response.data;
    },
    updateProviderService: async (id: string, data: any) => {
        const response = await api.put(`/provider-service/${id}`, data);
        return response.data;
    },
    getServiceRequests: async (params: { lat: number, lng: number, radius: number, categoryId: string }) => {
        const response = await api.get(`/service-requests/nearby`, { params })
        return response.data
    },
    getServiceRequestById: async (id: string) => {
        const response = await api.get(`/service-requests/${id}`)
        return response.data
    }
}
