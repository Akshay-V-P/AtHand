import { Payment } from "../entities/Payment";

export interface IPaymentRepository {
    create(payment: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByRazorpayOrderId(orderId: string): Promise<Payment | null>;
    findByRazorpayPaymentId(paymentId: string): Promise<Payment | null>;
    findByReferenceId(referenceId: string): Promise<Payment[]>;
    findByUserId(userId: string): Promise<Payment[]>;
    update(id: string, payment: Partial<Payment>): Promise<Payment | null>;
}
