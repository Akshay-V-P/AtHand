export interface CreateProviderResponseDto{
    id: string;
    userId: string;
    businessName: string;
    status: string;
    documents?: string[];
}