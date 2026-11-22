export interface VerifyPaymentDTO {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface VerifyPaymentResult {
    success: boolean;
    paymentId: string;
    orderId?: string;
    status: string;
    amount: number;
    currency: string;
    message: string;
}
