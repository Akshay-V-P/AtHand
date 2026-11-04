

import { Quote } from "../../../domain/entities/Quote";
import { IQuoteRepository } from "../../../domain/interfaces/IQuoteRepository";
import { QuoteStatus } from "../../../domain/enums/QuoteStatus";
import { QuoteModel } from "../models/QuoteModel";

export class QuoteRepository implements IQuoteRepository {
    async create(quote: Quote): Promise<Quote> {
        const createdQuote = await QuoteModel.create(quote);
        return this.toEntity(createdQuote);
    }

    async findById(id: string): Promise<Quote | null> {
        const quoteDoc = await QuoteModel.findById(id).populate('requestId');
        if (!quoteDoc) return null;
        return this.toEntity(quoteDoc);
    }

    async update(id: string, quoteData: Partial<Quote>): Promise<Quote | null> {
        const updatedQuote = await QuoteModel.findByIdAndUpdate(id, quoteData, { new: true }).populate('requestId');
        if (!updatedQuote) return null;
        return this.toEntity(updatedQuote);
    }

    async findByProviderId(providerId: string, skip: number = 0, limit: number = 10): Promise<{ data: Quote[], count: number }> {
        const count = await QuoteModel.countDocuments({ providerId });
        const quotes = await QuoteModel.find({ providerId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('requestId');

        return {
            data: quotes.map(q => this.toEntity(q)),
            count
        };
    }

    async findByRequestId(requestId: string): Promise<Quote[]> {
        const quotes = await QuoteModel.find({ requestId }).populate('providerId');
        return quotes.map(q => this.toEntity(q));
    }

    private toEntity(doc: any): Quote {
        return new Quote(
            doc.requestId,
            doc.providerId,
            doc.estimatedTotal,
            doc.laborCost,
            doc.partsCost,
            doc.estimatedRepairTime,
            doc.technicalNotes,
            doc.status as QuoteStatus,
            doc.includeWarrenty,
            doc._id.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }
}
