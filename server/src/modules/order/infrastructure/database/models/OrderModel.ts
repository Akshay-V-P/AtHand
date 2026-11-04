import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus } from "../../../domain/enums/OrderStatus";
import { ServiceMode } from "../../../../../shared/enums/ServiceMode";

export interface IOrderDocument extends Document {
    orderNumber: string;
    requestId: mongoose.Types.ObjectId;
    quoteId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    serviceMode: ServiceMode;
    initialQuoteAmount: number;
    finalAmount?: number;
    isAmountRevised: boolean;
    revisionNotes?: string;
    status: OrderStatus;
    appointment?: {
        scheduledDate: Date;
        timeSlot?: string;
        serviceAddress?: any;
        accessInstructions?: string;
        confirmedAt?: Date;
    };
    diagnosis?: {
        summary?: string;
        identifiedIssues?: string[];
        completedAt?: Date;
    };
    repairEstimate?: {
        items: Array<{ title: string; amount: number; type?: string }>;
        laborCost: number;
        partsCost: number;
        otherCharges?: number;
        totalAmount: number;
        estimatedRepairTime?: string;
        warranty?: string;
        notes?: string;
        status: 'PENDING' | 'APPROVED' | 'REJECTED';
        rejectionReason?: string;
        submittedAt?: Date;
        decidedAt?: Date;
    };
    completionDetails?: {
        notes?: string;
        workProofPhotos?: Array<{ url: string; caption: string }>;
        completedAt?: Date;
    };
    payment?: {
        diagnosisFee?: number;
        repairFee?: number;
        totalAmount?: number;
        status: 'PENDING' | 'PAID' | 'REFUNDED';
        paymentMethod?: string;
        paidAt?: Date;
        transactionReference?: string;
    };
    review?: {
        rating: number;
        comment?: string;
        reviewedAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrderDocument>({
    orderNumber: {
        type: String,
        required: true,
        default: () => `REP-${Math.floor(1000 + Math.random() * 9000)}`
    },
    requestId: { type: Schema.Types.ObjectId, ref: 'ServiceRequests', required: true, index: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    serviceMode: {
        type: String,
        enum: Object.values(ServiceMode),
        default: ServiceMode.ONSITE
    },
    initialQuoteAmount: { type: Number, required: true },
    finalAmount: { type: Number },
    isAmountRevised: { type: Boolean, default: false },
    revisionNotes: { type: String },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING,
        index: true
    },
    appointment: {
        scheduledDate: { type: Date },
        timeSlot: { type: String },
        serviceAddress: { type: Schema.Types.Mixed },
        accessInstructions: { type: String },
        confirmedAt: { type: Date }
    },
    diagnosis: {
        summary: { type: String },
        identifiedIssues: [{ type: String }],
        completedAt: { type: Date }
    },
    repairEstimate: {
        items: [{
            title: { type: String, required: true },
            amount: { type: Number, required: true },
            type: { type: String, default: 'PARTS' }
        }],
        laborCost: { type: Number, default: 0 },
        partsCost: { type: Number, default: 0 },
        otherCharges: { type: Number, default: 0 },
        totalAmount: { type: Number },
        estimatedRepairTime: { type: String },
        warranty: { type: String },
        notes: { type: String },
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
        rejectionReason: { type: String },
        submittedAt: { type: Date },
        decidedAt: { type: Date }
    },
    completionDetails: {
        notes: { type: String },
        workProofPhotos: [{
            url: { type: String, required: true },
            caption: { type: String, required: true }
        }],
        completedAt: { type: Date }
    },
    payment: {
        diagnosisFee: { type: Number, default: 0 },
        repairFee: { type: Number },
        totalAmount: { type: Number },
        status: { type: String, enum: ['PENDING', 'PAID', 'REFUNDED'], default: 'PENDING' },
        paymentMethod: { type: String, default: 'ONLINE' },
        paidAt: { type: Date },
        transactionReference: { type: String }
    },
    review: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        reviewedAt: { type: Date }
    }
}, {
    timestamps: true
});

export const OrderModel = mongoose.model<IOrderDocument>('Order', orderSchema);
