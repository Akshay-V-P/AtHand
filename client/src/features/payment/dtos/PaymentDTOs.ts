export type PaymentPurpose = 'ORDER_PAYMENT' | 'WALLET_TOPUP';

export interface InitiatePaymentRequest {
    purpose: PaymentPurpose;
    referenceId: string;
    amount?: number;
}

export interface InitiatePaymentResponse {
    paymentId: string;
    razorpayOrderId: string;
    amount: number; // in Rupees
    amountInPaise: number;
    currency: string;
    keyId: string;
    purpose: PaymentPurpose;
    referenceId: string;
}

export interface VerifyPaymentRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    paymentId: string;
    orderId?: string;
    status: string;
    amount: number;
    currency: string;
    message: string;
}

export interface ReportPaymentFailureRequest {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    internalPaymentId?: string;
    reason?: string;
    code?: string;
}

export interface RazorpayCheckoutResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
        color?: string;
    };
    handler: (response: RazorpayCheckoutResponse) => void;
    modal?: {
        ondismiss?: () => void;
    };
}
