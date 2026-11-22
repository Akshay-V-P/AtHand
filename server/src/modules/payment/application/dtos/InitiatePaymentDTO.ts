import { PaymentPurpose } from "../../domain/enums/PaymentPurpose";

export interface InitiatePaymentDTO {
    purpose: PaymentPurpose;
    referenceId: string; // Order ID or Wallet ID
    amount?: number; // Optional for order (auto-calculated from order), required for wallet topup
}

export interface InitiatePaymentResult {
    paymentId: string;
    razorpayOrderId: string;
    amount: number; // in Rupees
    amountInPaise: number;
    currency: string;
    keyId: string;
    purpose: PaymentPurpose;
    referenceId: string;
}
