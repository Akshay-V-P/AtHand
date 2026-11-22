import { useState, useMemo } from "react";
import { useProviderWallet } from "@/features/wallet/hooks/useWallet";
import { useProviderTransactions } from "@/features/wallet/hooks/useWalletTransaction";
import { TransactionHistoryTable } from "@/features/wallet/components/TransactionHistoryTable";
import type { WalletTransactionType } from "@/features/wallet/types/wallet.types";
import { DollarSign, TrendingUp, ShieldCheck, RefreshCw, AlertCircle, Briefcase } from "lucide-react";

const ProviderWalletPage = () => {
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<WalletTransactionType | undefined>(undefined);

    const {
        data: wallet,
        isLoading: isWalletLoading,
        isError: isWalletError,
        error: walletError,
        refetch: refetchWallet,
    } = useProviderWallet();

    const {
        data: txData,
        isLoading: isTxLoading,
        refetch: refetchTransactions,
    } = useProviderTransactions({
        page,
        limit: 10,
        type: typeFilter,
    });

    const handleTypeFilterChange = (type?: WalletTransactionType) => {
        setTypeFilter(type);
        setPage(1);
    };

    // Calculate total earned from completed credits in transaction history
    const totalEarnings = useMemo(() => {
        if (!txData?.items) return wallet?.balance ?? 0;
        const sum = txData.items
            .filter((t) => t.type === "CREDIT" && t.status === "COMPLETED")
            .reduce((acc, curr) => acc + (curr.amount || 0), 0);
        return Math.max(sum, wallet?.balance ?? 0);
    }, [txData, wallet]);

    if (isWalletLoading) {
        return (
            <div className="max-w-7xl mx-auto p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
                <p className="text-sm font-medium">Loading provider wallet & earnings...</p>
            </div>
        );
    }

    if (isWalletError) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <div className="p-8 bg-rose-50 border border-rose-100 rounded-2xl text-center max-w-md mx-auto">
                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-gray-900">Provider Wallet Unavailable</h3>
                    <p className="text-xs text-gray-600 mt-1 mb-4">
                        {(walletError as any)?.response?.data?.message || (walletError as any)?.message || "You must be an approved provider to access this wallet."}
                    </p>
                    <button
                        onClick={() => {
                            refetchWallet();
                            refetchTransactions();
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const availableBalance = wallet?.balance ?? 0;

    return (
        <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Provider Wallet & Earnings</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Track your business earnings, payouts, and service revenue.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Available Balance Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Available Balance
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-medium text-gray-500">₹</span>
                            <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                                {availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span><strong className="text-gray-700 uppercase">{wallet?.status || "ACTIVE"}</strong></span>
                    </div>
                </div>

                {/* Total Lifetime Earnings */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Cumulative Earnings
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-medium text-gray-500">₹</span>
                            <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                                {totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        Total revenue credited to provider wallet
                    </div>
                </div>

                {/* Account & Compliance */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Account Status
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Briefcase className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                            Verified Provider
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Eligible to receive direct payouts and completed order revenue.
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Documents Approved & Verified</span>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <TransactionHistoryTable
                transactions={txData?.items || []}
                totalItems={txData?.totalItems || 0}
                page={page}
                totalPages={txData?.totalPages || 1}
                onPageChange={(newPage) => setPage(newPage)}
                activeTypeFilter={typeFilter}
                onTypeFilterChange={handleTypeFilterChange}
                isLoading={isTxLoading}
                emptyMessage="No provider earnings or transactions yet"
            />
        </div>
    );
};

export default ProviderWalletPage;
