import { api } from "@/services/axios";
import type { PaginatedResponse } from "@/shared/dtos/PaginatedResponse";
import type {
    Order,
    AcceptQuoteDTO,
    SubmitDiagnosisDTO,
    SubmitRepairEstimateDTO,
    CustomerEstimateDecisionDTO,
    CompleteRepairDTO,
    ProcessPaymentDTO,
    SubmitReviewDTO
} from "../dtos/OrderDTOs";

export const orderApi = {
    acceptQuote: (data: AcceptQuoteDTO) =>
        api.post<{ success: boolean; message: string; data: { orderId: string } }>('/orders', data),

    getOrderById: (orderId: string) =>
        api.get<{ success: boolean; message: string; data: Order }>(`/orders/${orderId}`),

    getProviderOrders: (status?: string, page = 1, limit = 10) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.append('status', status);
        return api.get<{ success: boolean; message: string; data: PaginatedResponse<Order> }>(`/orders/provider/orders?${params.toString()}`);
    },

    submitDiagnosis: (orderId: string, data: SubmitDiagnosisDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/orders/${orderId}/diagnosis`, data),

    submitRepairEstimate: (orderId: string, data: SubmitRepairEstimateDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/orders/${orderId}/estimate`, data),

    respondToEstimate: (orderId: string, data: CustomerEstimateDecisionDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/orders/${orderId}/estimate-decision`, data),

    startWork: (orderId: string) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/orders/${orderId}/start`),

    completeRepair: (orderId: string, data: CompleteRepairDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/orders/${orderId}/complete`, data),

    processPayment: (orderId: string, data: ProcessPaymentDTO) =>
        api.post<{ success: boolean; message: string; data: Order }>(`/orders/${orderId}/payment`, data),

    submitReview: (orderId: string, data: SubmitReviewDTO) =>
        api.post<{ success: boolean; message: string; data: any }>(`/orders/${orderId}/review`, data),
};
