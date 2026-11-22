export interface ReportPaymentFailureDTO {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    internalPaymentId?: string;
    reason?: string;
    code?: string;
}
