import { PaymentPurpose } from "../enums/PaymentPurpose";
import { PaymentStatus } from "../enums/PaymentStatus";

export interface IRefundRecord {
    refundId: string;
    amount: number; // in Rupees
    status: string;
    reason?: string;
    createdAt: Date;
}

export interface Payment {
    id?: string;
    userId: string;
    amount: number; // in Rupees
    currency: string;
    purpose: PaymentPurpose;
    referenceId: string; // Order ID or Wallet ID
    gateway: string; // 'RAZORPAY'
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: PaymentStatus;
    failureReason?: string;
    metadata?: Record<string, any>;
    refunds?: IRefundRecord[];
    createdAt?: Date;
    updatedAt?: Date;
}
