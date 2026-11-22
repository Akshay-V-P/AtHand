import { api } from "@/services/axios";
import type { Wallet, WalletTransaction } from "../types/wallet.types";
import type { PaginatedResult, TransactionFilters } from "../types/pagination.types";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const walletApi = {
    // Customer Wallet APIs
    getCustomerWallet: () =>
        api.get<ApiResponse<Wallet>>("/wallet/customer"),

    getCustomerTransactions: (params?: TransactionFilters) =>
        api.get<ApiResponse<PaginatedResult<WalletTransaction>>>("/wallet/customer/transactions", { params }),

    // Provider Wallet APIs
    getProviderWallet: () =>
        api.get<ApiResponse<Wallet>>("/wallet/provider"),

    getProviderTransactions: (params?: TransactionFilters) =>
        api.get<ApiResponse<PaginatedResult<WalletTransaction>>>("/wallet/provider/transactions", { params }),

    // Generic Wallet APIs
    getWalletById: (id: string) =>
        api.get<ApiResponse<Wallet>>(`/wallet/${id}`),

    getTransactionsByWalletId: (walletId: string, params?: TransactionFilters) =>
        api.get<ApiResponse<PaginatedResult<WalletTransaction>>>(`/wallet/${walletId}/transactions`, { params }),

    createWallet: (userId: string, type?: string) =>
        api.post<ApiResponse<Wallet>>("/wallet", { userId, type }),
};
