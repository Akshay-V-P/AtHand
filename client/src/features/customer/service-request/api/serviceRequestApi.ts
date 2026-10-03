import { api } from "../../../../services/axios";
import type { CreateServiceRequestDTO, ServiceRequest, ServiceRequestPaginatedResponse, UpdateServiceRequestDTO } from "../dtos/ServiceRequestDTOs";


export const serviceRequestApi = {
    createRequest: (data: CreateServiceRequestDTO) =>
        api.post("/service-requests", data),

    getRequests: (page: number = 1, limit: number = 10, status?: string) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (status) params.append('status', status);
        return api.get<{ success: boolean, message: string, data: ServiceRequestPaginatedResponse }>(`/service-requests?${params.toString()}`);
    },

    getRequest: (id: string) =>
        api.get<{ success: boolean, message: string, data: ServiceRequest }>(`/service-requests/${id}`),

    updateRequest: (id: string, data: Omit<UpdateServiceRequestDTO, 'id'>) =>
        api.patch<{ success: boolean, message: string, data: ServiceRequest }>(`/service-requests/${id}`, data),

    cancelRequest: (id: string) =>
        api.patch<{ success: boolean, message: string, data: ServiceRequest }>(`/service-requests/${id}/cancel`),
};
