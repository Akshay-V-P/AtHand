export interface EditQuoteDto {
    id: string;
    providerId: string;
    estimatedTotal?: number;
    laborCost?: number;
    partsCost?: number;
    estimatedRepairTime?: string;
    technicalNotes?: string;
    includeWarrenty?: boolean;
}
