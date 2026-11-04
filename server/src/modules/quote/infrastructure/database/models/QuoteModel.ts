import mongoose, { Schema, Document } from "mongoose";
import { QuoteStatus } from "../../../domain/enums/QuoteStatus";

export interface IQuoteDocument extends Document {
    requestId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    estimatedTotal: number;
    laborCost: number;
    partsCost: number;
    estimatedRepairTime: string;
    technicalNotes: string;
    status: QuoteStatus;
    includeWarrenty: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const quoteSchema = new Schema<IQuoteDocument>({
    requestId: { type: Schema.Types.ObjectId, ref: 'ServiceRequests', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    estimatedTotal: { type: Number, required: true },
    laborCost: { type: Number, required: true },
    partsCost: { type: Number, required: true },
    estimatedRepairTime: { type: String, required: true },
    technicalNotes: { type: String, required: true },
    status: { type: String, enum: Object.values(QuoteStatus), default: QuoteStatus.PENDING },
    includeWarrenty: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});

export const QuoteModel = mongoose.model<IQuoteDocument>('Quote', quoteSchema);
