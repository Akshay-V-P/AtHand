import { PlatformCommissionLedger } from "../entities/PlatformCommissionLedger";

export interface CommissionLedgerFilter {
    page: number;
    limit: number;
    categoryId?: string;
    providerId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}

export interface PaginatedCommissionLedgerResult {
    items: PlatformCommissionLedger[];
    total: number;
    page: number;
    totalPages: number;
}

export interface PlatformFinancialSummary {
    totalGrossAmount: number;
    totalCommissionAmount: number;
    totalProviderEarnings: number;
    totalAllocations: number;
    totalRefundedAmount: number;
    totalPartsAmount?: number;
    totalLabourAmount?: number;
    totalPartsCommissionAmount?: number;
    totalLabourCommissionAmount?: number;
}

export interface ICommissionLedgerRepository {
    create(data: Omit<PlatformCommissionLedger, "id">): Promise<PlatformCommissionLedger>;
    findById(id: string): Promise<PlatformCommissionLedger | null>;
    findByOrderId(orderId: string): Promise<PlatformCommissionLedger | null>;
    findByPaymentId(paymentId: string): Promise<PlatformCommissionLedger | null>;
    update(id: string, data: Partial<PlatformCommissionLedger>): Promise<PlatformCommissionLedger | null>;
    findAll(filter: CommissionLedgerFilter): Promise<PaginatedCommissionLedgerResult>;
    getFinancialSummary(startDate?: Date, endDate?: Date): Promise<PlatformFinancialSummary>;
}
