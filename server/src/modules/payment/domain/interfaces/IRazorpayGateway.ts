export interface RazorpayOrderResult {
    id: string;
    amount: number; // in paise
    currency: string;
    receipt?: string;
    status: string;
}

export interface RazorpayPaymentDetails {
    id: string;
    order_id: string;
    amount: number; // in paise
    currency: string;
    status: string;
    method: string;
    captured: boolean;
    email?: string;
    contact?: string;
    error_code?: string;
    error_description?: string;
}

export interface RazorpayRefundResult {
    id: string;
    payment_id: string;
    amount: number; // in paise
    status: string;
    currency: string;
}

export interface IRazorpayGateway {
    createOrder(
        amountInPaise: number,
        currency: string,
        receipt: string,
        notes?: Record<string, string>
    ): Promise<RazorpayOrderResult>;

    verifyPaymentSignature(
        razorpayOrderId: string,
        razorpayPaymentId: string,
        signature: string
    ): boolean;

    verifyWebhookSignature(
        rawBody: string | Buffer,
        signature: string,
        webhookSecret?: string
    ): boolean;

    fetchPayment(razorpayPaymentId: string): Promise<RazorpayPaymentDetails>;

    createRefund(
        razorpayPaymentId: string,
        amountInPaise?: number,
        notes?: Record<string, string>
    ): Promise<RazorpayRefundResult>;
}
