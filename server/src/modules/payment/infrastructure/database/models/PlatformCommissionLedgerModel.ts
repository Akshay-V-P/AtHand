import mongoose, { Schema, Document } from "mongoose";
import { PlatformCommissionStatus } from "../../../domain/entities/PlatformCommissionLedger";

export interface IPlatformCommissionLedgerDocument extends Document {
    orderId: mongoose.Types.ObjectId;
    paymentId?: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    providerUserId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    categoryName?: string;
    orderNumber?: string;
    paymentMethod: string;
    grossAmount: number;
    commissionPercentage: number;
    commissionAmount: number;
    providerEarnings: number;
    currency: string;
    status: PlatformCommissionStatus;
    refundedAmount: number;
    partsAmount?: number;
    labourAmount?: number;
    partsCommissionPercentage?: number;
    labourCommissionPercentage?: number;
    partsCommissionAmount?: number;
    labourCommissionAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PlatformCommissionLedgerSchema = new Schema<IPlatformCommissionLedgerDocument>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
            index: true,
        },
        paymentId: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            index: true,
        },
        providerId: {
            type: Schema.Types.ObjectId,
            ref: "Provider",
            required: true,
            index: true,
        },
        providerUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Categories",
            required: true,
            index: true,
        },
        categoryName: {
            type: String,
        },
        orderNumber: {
            type: String,
        },
        paymentMethod: {
            type: String,
            required: true,
            default: "ONLINE",
        },
        grossAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        commissionPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        commissionAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        providerEarnings: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            default: "INR",
        },
        status: {
            type: String,
            enum: Object.values(PlatformCommissionStatus),
            default: PlatformCommissionStatus.ALLOCATED,
            index: true,
        },
        refundedAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        partsAmount: {
            type: Number,
            min: 0,
        },
        labourAmount: {
            type: Number,
            min: 0,
        },
        partsCommissionPercentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        labourCommissionPercentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        partsCommissionAmount: {
            type: Number,
            min: 0,
        },
        labourCommissionAmount: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

PlatformCommissionLedgerSchema.index({ createdAt: -1 });
PlatformCommissionLedgerSchema.index({ providerId: 1, createdAt: -1 });
PlatformCommissionLedgerSchema.index({ categoryId: 1, createdAt: -1 });

export const PlatformCommissionLedgerModel = mongoose.model<IPlatformCommissionLedgerDocument>(
    "PlatformCommissionLedger",
    PlatformCommissionLedgerSchema
);
