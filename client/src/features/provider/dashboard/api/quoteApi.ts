import { api } from '../../../../services/axios';

export interface CreateQuotePayload {
    requestId: string;
    providerId: string;
    estimatedTotal: number;
    laborCost: number;
    partsCost: number;
    estimatedRepairTime: string;
    technicalNotes: string;
    includeWarrenty: boolean;
}

export const quoteApi = {
    createQuote: (data: CreateQuotePayload) => api.post('/quote', data),
    editQuote: (id: string, data: Partial<CreateQuotePayload>) => api.put(`/quote/${id}`, data),
    getProviderQuotes: (providerId: string, page = 1, limit = 50) => api.get(`/quote/provider/${providerId}`, { params: { page, limit } })
}
