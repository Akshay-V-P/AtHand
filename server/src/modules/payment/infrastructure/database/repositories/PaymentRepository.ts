import { IPaymentRepository } from "../../../domain/interfaces/IPaymentRepository";
import { Payment } from "../../../domain/entities/Payment";
import { PaymentModel } from "../models/PaymentModel";

export class PaymentRepository implements IPaymentRepository {
    private mapToEntity(doc: any): Payment {
        return {
            id: doc._id.toString(),
            userId: doc.userId?.toString() || doc.userId,
            amount: doc.amount,
            currency: doc.currency,
            purpose: doc.purpose,
            referenceId: doc.referenceId,
            gateway: doc.gateway,
            razorpayOrderId: doc.razorpayOrderId,
            razorpayPaymentId: doc.razorpayPaymentId,
            razorpaySignature: doc.razorpaySignature,
            status: doc.status,
            failureReason: doc.failureReason,
            metadata: doc.metadata,
            refunds: doc.refunds || [],
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    async create(payment: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
        const doc = new PaymentModel(payment);
        const saved = await doc.save();
        return this.mapToEntity(saved);
    }

    async findById(id: string): Promise<Payment | null> {
        const doc = await PaymentModel.findById(id).exec();
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByRazorpayOrderId(orderId: string): Promise<Payment | null> {
        const doc = await PaymentModel.findOne({ razorpayOrderId: orderId }).exec();
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByRazorpayPaymentId(paymentId: string): Promise<Payment | null> {
        const doc = await PaymentModel.findOne({ razorpayPaymentId: paymentId }).exec();
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByReferenceId(referenceId: string): Promise<Payment[]> {
        const docs = await PaymentModel.find({ referenceId }).sort({ createdAt: -1 }).exec();
        return docs.map(doc => this.mapToEntity(doc));
    }

    async findByUserId(userId: string): Promise<Payment[]> {
        const docs = await PaymentModel.find({ userId }).sort({ createdAt: -1 }).exec();
        return docs.map(doc => this.mapToEntity(doc));
    }

    async update(id: string, payment: Partial<Payment>): Promise<Payment | null> {
        const doc = await PaymentModel.findByIdAndUpdate(
            id,
            { $set: payment },
            { new: true }
        ).exec();
        return doc ? this.mapToEntity(doc) : null;
    }
}
