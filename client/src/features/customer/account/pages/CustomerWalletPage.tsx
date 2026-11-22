import { useState } from "react";
import { useCustomerWallet } from "@/features/wallet/hooks/useWallet";
import { useCustomerTransactions } from "@/features/wallet/hooks/useWalletTransaction";
import { AddMoneyModal } from "@/features/wallet/components/AddMoneyModal";
import { TransactionHistoryTable } from "@/features/wallet/components/TransactionHistoryTable";
import type { WalletTransactionType } from "@/features/wallet/types/wallet.types";
import { Plus, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";


const CustomerWalletPage = () => {
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<WalletTransactionType | undefined>(undefined);

    const {
        data: wallet,
        isLoading: isWalletLoading,
        isError: isWalletError,
        error: walletError,
        refetch: refetchWallet,
    } = useCustomerWallet();

    const {
        data: txData,
        isLoading: isTxLoading,
        refetch: refetchTransactions,
    } = useCustomerTransactions({
        page,
        limit: 10,
        type: typeFilter,
    });

    const handleTypeFilterChange = (type?: WalletTransactionType) => {
        setTypeFilter(type);
        setPage(1);
    };

    if (isWalletLoading) {
        return (
            <div className="flex-1 py-12 flex flex-col items-center justify-center text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin text-red-500 mb-3" />
                <p className="text-sm font-medium">Loading your customer wallet...</p>
            </div>
        );
    }

    if (isWalletError) {
        return (
            <div className="flex-1 p-6">
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center max-w-md mx-auto">
                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-gray-900">Failed to load wallet</h3>
                    <p className="text-xs text-gray-600 mt-1 mb-4">
                        {(walletError as any)?.response?.data?.message || (walletError as any)?.message || "Something went wrong."}
                    </p>
                    <button
                        onClick={() => {
                            refetchWallet();
                            refetchTransactions();
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const balance = wallet?.balance ?? 0;

    return (
        <div className="flex-1 space-y-6">
            {/* Header / Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Wallet</h1>
                <p className="text-xs text-gray-500 mt-1">
                    Manage your personal account balance and track service payment transactions.
                </p>
            </div>

            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 sm:p-8 shadow-md">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-56 h-56 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                                Available Balance
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-medium text-gray-400">₹</span>
                            <span className="text-4xl sm:text-5xl font-black tracking-tight">
                                {balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>{wallet?.status || "ACTIVE"}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAddMoneyOpen(true)}
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-bold rounded-2xl shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Money</span>
                        </button>
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
                emptyMessage="No customer transactions yet"
            />

            {/* Add Money Modal */}
            {wallet?.id && (
                <AddMoneyModal
                    isOpen={isAddMoneyOpen}
                    onClose={() => setIsAddMoneyOpen(false)}
                    walletId={wallet.id}
                />
            )}
        </div>
    );
};

export default CustomerWalletPage;
