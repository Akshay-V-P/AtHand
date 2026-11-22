export interface RefundPaymentDTO {
    amount?: number; // in Rupees. If omitted, full refund
    reason?: string;
}

export interface RefundPaymentResult {
    success: boolean;
    refundId: string;
    paymentId: string;
    amount: number;
    status: string;
}
