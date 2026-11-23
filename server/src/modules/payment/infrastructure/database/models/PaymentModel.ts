import { Schema, model } from "mongoose";
import { Payment } from "../../../domain/entities/Payment";
import { PaymentPurpose } from "../../../domain/enums/PaymentPurpose";
import { PaymentStatus } from "../../../domain/enums/PaymentStatus";

const refundRecordSchema = new Schema(
    {
        refundId: { type: String, required: true },
        amount: { type: Number, required: true },
        status: { type: String, required: true },
        reason: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const paymentBreakdownSchema = new Schema(
    {
        partsAmount: { type: Number, required: true, min: 0 },
        labourAmount: { type: Number, required: true, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 },
        categoryCommissionPercentage: { type: Number, required: true, min: 0, max: 100 },
        partsCommissionPercentage: { type: Number, required: true, min: 0, max: 100 },
        labourCommissionPercentage: { type: Number, required: true, min: 0, max: 100 },
        partsCommissionAmount: { type: Number, required: true, min: 0 },
        labourCommissionAmount: { type: Number, required: true, min: 0 },
        totalCommissionAmount: { type: Number, required: true, min: 0 },
        providerEarning: { type: Number, required: true, min: 0 },
        platformEarning: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const paymentSchema = new Schema<Payment>(
    {
        userId: {
            type: Schema.Types.ObjectId as any,
            ref: "User",
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            default: "INR",
            uppercase: true,
        },
        purpose: {
            type: String,
            enum: Object.values(PaymentPurpose),
            required: true,
            index: true,
        },
        referenceId: {
            type: String,
            required: true,
            index: true,
        },
        gateway: {
            type: String,
            required: true,
            default: "RAZORPAY",
        },
        razorpayOrderId: {
            type: String,
            sparse: true,
            index: true,
        },
        razorpayPaymentId: {
            type: String,
            sparse: true,
            index: true,
        },
        razorpaySignature: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.CREATED,
            required: true,
            index: true,
        },
        failureReason: {
            type: String,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
        refunds: [refundRecordSchema],
        breakdown: {
            type: paymentBreakdownSchema,
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Helpful compound index to quickly find all payment attempts for a given reference
paymentSchema.index({ referenceId: 1, purpose: 1, createdAt: -1 });

export const PaymentModel = model<Payment>("Payment", paymentSchema);
