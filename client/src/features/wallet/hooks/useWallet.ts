import { useQuery } from "@tanstack/react-query";
import { walletApi } from "../api/walletApi";
import type { TransactionFilters } from "../types/pagination.types";

export const walletQueryKeys = {
    all: ["wallet"] as const,
    customer: () => [...walletQueryKeys.all, "customer"] as const,
    customerTransactions: (filters?: TransactionFilters) =>
        [...walletQueryKeys.customer(), "transactions", filters] as const,
    provider: () => [...walletQueryKeys.all, "provider"] as const,
    providerTransactions: (filters?: TransactionFilters) =>
        [...walletQueryKeys.provider(), "transactions", filters] as const,
    details: (id: string) => [...walletQueryKeys.all, "detail", id] as const,
};

export const useCustomerWallet = () => {
    return useQuery({
        queryKey: walletQueryKeys.customer(),
        queryFn: async () => {
            const response = await walletApi.getCustomerWallet();
            return response.data.data;
        },
        staleTime: 30 * 1000,
    });
};

export const useProviderWallet = (enabled: boolean = true) => {
    return useQuery({
        queryKey: walletQueryKeys.provider(),
        queryFn: async () => {
            const response = await walletApi.getProviderWallet();
            return response.data.data;
        },
        enabled,
        staleTime: 30 * 1000,
    });
};
