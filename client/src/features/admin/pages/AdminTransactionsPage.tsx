import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../api/adminApi";
import StatCard from "../components/StatCard";
import {
    TrendingUp,
    DollarSign,
    Briefcase,
    RotateCcw,
    RefreshCw,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

interface FinancialSummary {
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

interface CommissionLedgerItem {
    id: string;
    orderId: string;
    orderNumber?: string;
    categoryName?: string;
    paymentMethod: string;
    grossAmount: number;
    commissionPercentage: number;
    commissionAmount: number;
    providerEarnings: number;
    currency: string;
    status: string;
    refundedAmount: number;
    partsAmount?: number;
    labourAmount?: number;
    partsCommissionPercentage?: number;
    labourCommissionPercentage?: number;
    partsCommissionAmount?: number;
    labourCommissionAmount?: number;
    createdAt: string;
}

export default function AdminTransactionsPage() {
    const [summary, setSummary] = useState<FinancialSummary | null>(null);
    const [ledgerItems, setLedgerItems] = useState<CommissionLedgerItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSummary = useCallback(async () => {
        try {
            const res = await adminApi.getFinancialSummary();
            if (res.data?.success) {
                setSummary(res.data.data);
            }
        } catch (err: any) {
            console.error("Failed to load financial summary", err);
        }
    }, []);

    const fetchLedger = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await adminApi.getCommissionLedger({
                page,
                limit: 10,
                search: search || undefined,
                status: statusFilter || undefined,
            });
            if (res.data?.success) {
                setLedgerItems(res.data.data.items || []);
                setTotalItems(res.data.data.total || 0);
                setTotalPages(res.data.data.totalPages || 1);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load commission ledger");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [page, search, statusFilter]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    useEffect(() => {
        fetchLedger();
    }, [fetchLedger]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchSummary();
        fetchLedger();
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "—";
        try {
            return new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ALLOCATED":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={12} /> Allocated
                    </span>
                );
            case "REFUNDED":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                        <RotateCcw size={12} /> Refunded
                    </span>
                );
            case "PARTIALLY_REFUNDED":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        <RotateCcw size={12} /> Partial Refund
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const netPlatformMargin =
        summary && summary.totalGrossAmount > 0
            ? ((summary.totalCommissionAmount / summary.totalGrossAmount) * 100).toFixed(1)
            : "0.0";

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Financial Ledger & Commissions
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Marketplace gross volume, platform commission, and provider payouts
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                    <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
                    Refresh Data
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
                    title="Gross Marketplace Volume"
                    value={`₹${(summary?.totalGrossAmount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    subtitle={
                        (summary?.totalPartsAmount || summary?.totalLabourAmount)
                            ? `Parts: ₹${(summary?.totalPartsAmount ?? 0).toLocaleString()} | Labour: ₹${(summary?.totalLabourAmount ?? 0).toLocaleString()}`
                            : `${summary?.totalAllocations ?? 0} settled orders`
                    }
                    trend="+100%"
                    trendType="positive"
                    iconBg="bg-indigo-50"
                />
                <StatCard
                    icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                    title="Platform Commission Earned"
                    value={`₹${(summary?.totalCommissionAmount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    subtitle={
                        (summary?.totalPartsCommissionAmount || summary?.totalLabourCommissionAmount)
                            ? `Parts: ₹${(summary?.totalPartsCommissionAmount ?? 0).toLocaleString()} | Labour: ₹${(summary?.totalLabourCommissionAmount ?? 0).toLocaleString()}`
                            : `Avg take rate: ${netPlatformMargin}%`
                    }
                    trend={`${netPlatformMargin}%`}
                    trendType="positive"
                    iconBg="bg-emerald-50"
                />
                <StatCard
                    icon={<Briefcase className="w-5 h-5 text-blue-600" />}
                    title="Provider Net Earnings"
                    value={`₹${(summary?.totalProviderEarnings ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    subtitle="Distributed to provider wallets"
                    trend="Disbursed"
                    trendType="neutral"
                    iconBg="bg-blue-50"
                />
                <StatCard
                    icon={<RotateCcw className="w-5 h-5 text-rose-600" />}
                    title="Total Refunded Amount"
                    value={`₹${(summary?.totalRefundedAmount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    subtitle="Proportionally reversed"
                    trend="Audited"
                    trendType="neutral"
                    iconBg="bg-rose-50"
                />
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by order #, category..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-600"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="border border-gray-200 rounded-xl text-xs py-2 px-3 text-gray-700 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="ALLOCATED">Allocated</option>
                        <option value="REFUNDED">Refunded</option>
                        <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
                    </select>
                </div>
            </div>

            {/* Commission Ledger Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Platform Financial Ledger</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {totalItems} total transactions recorded with immutable snapshots
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                                <th className="p-4 pl-6">Order Details</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Payment Method</th>
                                <th className="p-4 text-right">Gross Amount</th>
                                <th className="p-4 text-right">Commission (%)</th>
                                <th className="p-4 text-right">Platform Take</th>
                                <th className="p-4 text-right">Provider Earnings</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="p-4 pl-6">
                                            <div className="h-4 bg-gray-200 rounded w-28"></div>
                                        </td>
                                        <td className="p-4">
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        </td>
                                        <td className="p-4">
                                            <div className="h-4 bg-gray-100 rounded w-16"></div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="h-4 bg-gray-100 rounded w-12 ml-auto"></div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="h-4 bg-gray-200 rounded w-14 ml-auto"></div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                                        </td>
                                        <td className="p-4">
                                            <div className="h-4 bg-gray-100 rounded w-16"></div>
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="h-4 bg-gray-100 rounded w-24"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : ledgerItems.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-12 text-center text-gray-400">
                                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="font-medium text-sm text-gray-500">No ledger records found</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Commission entries will appear automatically when orders are paid.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                ledgerItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 pl-6 font-semibold text-gray-900">
                                            #{item.orderNumber || item.orderId}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 font-medium">
                                                {item.categoryName || "General"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 font-mono text-[11px]">
                                            {item.paymentMethod}
                                        </td>
                                        <td className="p-4 text-right font-bold text-gray-900">
                                            <div>₹{item.grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                                            {(item.partsAmount !== undefined || item.labourAmount !== undefined) && (
                                                <div className="text-[10px] text-gray-400 font-normal">
                                                    P: ₹{(item.partsAmount ?? 0).toLocaleString()} | L: ₹{(item.labourAmount ?? 0).toLocaleString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right text-indigo-700 font-semibold">
                                            <div>{item.commissionPercentage}%</div>
                                            {item.partsCommissionPercentage !== undefined && (
                                                <div className="text-[10px] text-gray-400 font-normal">
                                                    L: {item.labourCommissionPercentage ?? item.commissionPercentage}% | P: {item.partsCommissionPercentage}%
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right font-bold text-emerald-700">
                                            <div>+₹{item.commissionAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                                            {(item.partsCommissionAmount !== undefined || item.labourCommissionAmount !== undefined) && (
                                                <div className="text-[10px] text-gray-400 font-normal">
                                                    P: ₹{(item.partsCommissionAmount ?? 0).toLocaleString()} | L: ₹{(item.labourCommissionAmount ?? 0).toLocaleString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right font-bold text-blue-700">
                                            ₹{item.providerEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-4">{getStatusBadge(item.status)}</td>
                                        <td className="p-4 pr-6 text-gray-500 whitespace-nowrap">
                                            {formatDate(item.createdAt)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>
                            Page {page} of {totalPages} ({totalItems} total)
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
