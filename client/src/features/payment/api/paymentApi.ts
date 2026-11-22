import { api } from "@/services/axios";
import type {
    InitiatePaymentRequest,
    InitiatePaymentResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    ReportPaymentFailureRequest,
} from "../dtos/PaymentDTOs";

export const paymentApi = {
    initiatePayment: (data: InitiatePaymentRequest) =>
        api.post<{ success: boolean; message: string; data: InitiatePaymentResponse }>(
            "/payment/initiate",
            data
        ),

    verifyPayment: (data: VerifyPaymentRequest) =>
        api.post<{ success: boolean; message: string; data: VerifyPaymentResponse }>(
            "/payment/verify",
            data
        ),

    reportPaymentFailure: (data: ReportPaymentFailureRequest) =>
        api.post<{ success: boolean; message: string; data: any }>(
            "/payment/failure",
            data
        ),

    getPaymentById: (paymentId: string) =>
        api.get<{ success: boolean; message: string; data: any }>(`/payment/${paymentId}`),

    getPaymentsByOrder: (orderId: string) =>
        api.get<{ success: boolean; message: string; data: any[] }>(`/payment/order/${orderId}`),
};
