import { Quote } from "../entities/Quote";

export interface IQuoteRepository {
    create(quote: Quote): Promise<Quote>;
    findById(id: string): Promise<Quote | null>;
    update(id: string, quote: Partial<Quote>): Promise<Quote | null>;
    findByProviderId(providerId: string, skip: number, limit: number): Promise<{ data: Quote[], count: number }>;
    findByRequestId(requestId: string): Promise<Quote[]>;
}
