import type { WalletTransaction, WalletTransactionCategory, WalletTransactionStatus, WalletTransactionType } from "./wallet.types";

export interface TransactionFilters {
    page?: number;
    limit?: number;
    type?: WalletTransactionType;
    category?: WalletTransactionCategory;
    status?: WalletTransactionStatus;
    startDate?: string;
    endDate?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type PaginatedTransaction = PaginatedResult<WalletTransaction>;
