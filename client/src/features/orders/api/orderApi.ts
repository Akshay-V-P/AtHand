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
        api.post<{ success: boolean; message: string; data: Order }>('/order/accept-quote', data),

    getOrderById: (orderId: string) =>
        api.get<{ success: boolean; message: string; data: Order }>(`/order/${orderId}`),

    getOrderByRequestId: (requestId: string) =>
        api.get<{ success: boolean; message: string; data: Order }>(`/order/by-request/${requestId}`),

    getCustomerOrders: (page = 1, limit = 20) =>
        api.get<{ success: boolean; message: string; data: { data: Order[]; total: number } }>(`/order/customer/orders?page=${page}&limit=${limit}`),

    getProviderOrders: (providerId?: string, status?: string, page = 1, limit = 10) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status && status !== 'all') params.append('status', status);
        if (providerId) params.append('providerId', providerId);
        return api.get<{ success: boolean; message: string; data: PaginatedResponse<Order> }>(`/order/provider/orders?${params.toString()}`);
    },

    submitDiagnosis: (orderId: string, data: SubmitDiagnosisDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/diagnosis`, data),

    submitRepairEstimate: (orderId: string, data: SubmitRepairEstimateDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/estimate`, data),

    respondToEstimate: (orderId: string, data: CustomerEstimateDecisionDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/estimate-decision`, data),

    submitEstimateDecision: (orderId: string, data: CustomerEstimateDecisionDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/estimate-decision`, data),

    startWork: (orderId: string) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/start`),

    completeRepair: (orderId: string, data: CompleteRepairDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/complete`, data),

    processPayment: (orderId: string, data: ProcessPaymentDTO) =>
        api.post<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/payment`, data),

    submitReview: (orderId: string, data: SubmitReviewDTO) =>
        api.post<{ success: boolean; message: string; data: any }>(`/order/${orderId}/review`, data),
};
