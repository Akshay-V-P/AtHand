import { api } from "../../../../services/axios";
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
        api.post<{ success: boolean; message: string; data: Order }>("/order/accept-quote", data),

    getOrderByRequestId: (requestId: string) =>
        api.get<{ success: boolean; message: string; data: Order }>(`/order/by-request/${requestId}`),

    getOrderById: (orderId: string) =>
        api.get<{ success: boolean; message: string; data: Order }>(`/order/${orderId}`),

    getCustomerOrders: (page: number = 1, limit: number = 20) =>
        api.get<{ success: boolean; message: string; data: { orders: Order[]; total: number; page: number; limit: number } }>(
            `/order/customer/my-orders?page=${page}&limit=${limit}`
        ),

    getProviderOrders: (providerId?: string, page: number = 1, limit: number = 20, status?: string) => {
        const params = new URLSearchParams();
        if (providerId) params.append("providerId", providerId);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (status) params.append("status", status);
        return api.get<{ success: boolean; message: string; data: { orders: Order[]; total: number; page: number; limit: number } }>(
            `/order/provider/my-orders?${params.toString()}`
        );
    },

    submitDiagnosis: (orderId: string, data: SubmitDiagnosisDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/diagnosis`, data),

    submitRepairEstimate: (orderId: string, data: SubmitRepairEstimateDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/estimate`, data),

    submitEstimateDecision: (orderId: string, data: CustomerEstimateDecisionDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/estimate-decision`, data),

    completeRepair: (orderId: string, data: CompleteRepairDTO) =>
        api.patch<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/complete`, data),

    processPayment: (orderId: string, data: ProcessPaymentDTO) =>
        api.post<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/payment`, data),

    submitReview: (orderId: string, data: SubmitReviewDTO) =>
        api.post<{ success: boolean; message: string; data: Order }>(`/order/${orderId}/review`, data),
};
