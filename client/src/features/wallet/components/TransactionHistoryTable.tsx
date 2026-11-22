import type { WalletTransaction, WalletTransactionType } from "../types/wallet.types";
import { ArrowDownLeft, ArrowUpRight, ArrowLeft, ArrowRight, Clock, AlertCircle } from "lucide-react";

interface TransactionHistoryTableProps {
    transactions: WalletTransaction[];
    totalItems: number;
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    activeTypeFilter?: WalletTransactionType;
    onTypeFilterChange: (type?: WalletTransactionType) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

export const TransactionHistoryTable = ({
    transactions,
    totalItems,
    page,
    totalPages,
    onPageChange,
    activeTypeFilter,
    onTypeFilterChange,
    isLoading = false,
    emptyMessage = "No transactions found",
}: TransactionHistoryTableProps) => {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "—";
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Completed</span>;
            case "PENDING":
                return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">Pending</span>;
            case "FAILED":
                return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">Failed</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case "EARNING":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">Earning</span>;
            case "PAYMENT":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">Top-up</span>;
            case "REFUND":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-100">Refund</span>;
            case "WITHDRAWAL":
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-100">Withdrawal</span>;
            default:
                return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-100">{category}</span>;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            {/* Header & Filter Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {totalItems} total transaction{totalItems === 1 ? "" : "s"} recorded
                    </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => onTypeFilterChange(undefined)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            !activeTypeFilter
                                ? "bg-white text-gray-900 shadow-xs"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => onTypeFilterChange("CREDIT")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            activeTypeFilter === "CREDIT"
                                ? "bg-white text-emerald-700 shadow-xs"
                                : "text-gray-600 hover:text-emerald-700"
                        }`}
                    >
                        Credits
                    </button>
                    <button
                        type="button"
                        onClick={() => onTypeFilterChange("DEBIT")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            activeTypeFilter === "DEBIT"
                                ? "bg-white text-rose-700 shadow-xs"
                                : "text-gray-600 hover:text-rose-700"
                        }`}
                    >
                        Debits
                    </button>
                </div>
            </div>

            {/* List / Table Content */}
            <div className="divide-y divide-gray-100">
                {isLoading ? (
                    // Skeleton Rows
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-4 sm:p-5 flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                <div className="space-y-2">
                                    <div className="w-40 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-24 h-3 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="w-20 h-4 bg-gray-200 rounded ml-auto"></div>
                                <div className="w-14 h-3 bg-gray-100 rounded ml-auto"></div>
                            </div>
                        </div>
                    ))
                ) : transactions.length === 0 ? (
                    // Empty State
                    <div className="py-16 px-4 text-center">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">{emptyMessage}</h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                            Your transaction activity and records will appear right here.
                        </p>
                    </div>
                ) : (
                    // Transactions list
                    transactions.map((tx) => {
                        const isCredit = tx.type === "CREDIT";
                        return (
                            <div
                                key={tx.id}
                                className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50/60 transition-colors"
                            >
                                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                            isCredit ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                        }`}
                                    >
                                        {isCredit ? (
                                            <ArrowDownLeft className="w-5 h-5" />
                                        ) : (
                                            <ArrowUpRight className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {tx.description}
                                            </p>
                                            {getCategoryBadge(tx.category)}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{formatDate(tx.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <p
                                        className={`text-base font-bold ${
                                            isCredit ? "text-emerald-600" : "text-rose-600"
                                        }`}
                                    >
                                        {isCredit ? "+" : "-"}₹{Number(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </p>
                                    <div className="flex items-center justify-end gap-1.5 mt-1">
                                        {getStatusBadge(tx.status)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 bg-gray-50/40">
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page <= 1 || isLoading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                    </button>

                    <span className="font-medium">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages || isLoading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium transition-colors"
                    >
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
};
