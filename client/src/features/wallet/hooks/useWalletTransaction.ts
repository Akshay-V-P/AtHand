import { useQuery } from "@tanstack/react-query";
import { walletApi } from "../api/walletApi";
import { walletQueryKeys } from "./useWallet";
import type { TransactionFilters } from "../types/pagination.types";

export const useCustomerTransactions = (filters?: TransactionFilters) => {
    return useQuery({
        queryKey: walletQueryKeys.customerTransactions(filters),
        queryFn: async () => {
            const response = await walletApi.getCustomerTransactions(filters);
            return response.data.data;
        },
        staleTime: 30 * 1000,
    });
};

export const useProviderTransactions = (filters?: TransactionFilters, enabled: boolean = true) => {
    return useQuery({
        queryKey: walletQueryKeys.providerTransactions(filters),
        queryFn: async () => {
            const response = await walletApi.getProviderTransactions(filters);
            return response.data.data;
        },
        enabled,
        staleTime: 30 * 1000,
    });
};
