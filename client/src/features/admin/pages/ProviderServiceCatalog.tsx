import { useEffect, useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    AlertCircle,
    Ban,
    ChevronLeft,
    ChevronRight,
    Layers,
    Pencil,
    Search,
    ShieldCheck,
    SlidersHorizontal,
} from "lucide-react";
import type { ProviderDetails } from "@/shared/types/IProviderDetails";
import { adminServices } from "../services/adminServices";
import type {
    IAdminUpdateProviderServicePayload,
    IProviderService,
    IProviderServiceStats,
    ProviderServiceStatus,
} from "../types/providerService";
import { EditProviderServiceModal } from "../components/EditProviderServiceModal";
import {
    BlockProviderServiceModal,
    UnblockProviderServiceModal,
} from "../components/BlockProviderServiceModal";

interface CategoryOption {
    id: string;
    name: string;
}

const DEFAULT_STATS: IProviderServiceStats = {
    totalServices: 0,
    activeServices: 0,
    inactiveServices: 0,
    blockedServices: 0,
    averagePrice: 0,
    maxServiceRadius: 0,
    onSiteCount: 0,
    instantBookingCount: 0,
};

const STATUS_BADGE_STYLES: Record<ProviderServiceStatus, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    INACTIVE: "bg-slate-100 text-slate-600 border border-slate-200",
    BLOCKED: "bg-rose-50 text-rose-700 border border-rose-200",
};

const getErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        if (message) return message;
    }
    return fallback;
};

const getPageNumbers = (current: number, total: number): (number | "...")[] => {
    if (total <= 7) {
        return Array.from({ length: total }, (_, idx) => idx + 1);
    }
    const pages: (number | "...")[] = [1];
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
};

const ProviderServiceCatalog = () => {
    const location = useLocation();
    const { provider } = useOutletContext<{ provider: ProviderDetails | null }>();
    const idFromQuery = new URLSearchParams(location.search).get("id");
    const targetProviderId = provider?.id || idFromQuery;

    const [services, setServices] = useState<IProviderService[]>([]);
    const [stats, setStats] = useState<IProviderServiceStats>(DEFAULT_STATS);
    const [categories, setCategories] = useState<CategoryOption[]>([]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const [editingService, setEditingService] = useState<IProviderService | null>(null);
    const [blockingService, setBlockingService] = useState<IProviderService | null>(null);
    const [unblockingService, setUnblockingService] = useState<IProviderService | null>(null);
    const [isUnblocking, setIsUnblocking] = useState(false);

    useEffect(() => {
        adminServices
            .getAllCategories({ page: 1, limit: 100 })
            .then((res) => {
                const items: Array<{ id: string; name: string }> = res.data?.data?.items || [];
                setCategories(items.map((cat) => ({ id: cat.id, name: cat.name })));
            })
            .catch((err) => {
                console.error("Failed to fetch categories:", err);
            });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const trimmed = searchInput.trim();
            setDebouncedSearch((prev) => {
                if (prev !== trimmed) {
                    setPage(1);
                }
                return trimmed;
            });
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const categoryMap = useMemo(() => {
        const map = new Map<string, string>();
        for (const cat of categories) {
            map.set(cat.id, cat.name);
        }
        return map;
    }, [categories]);

    useEffect(() => {
        let active = true;

        Promise.resolve().then(async () => {
            if (!active) return;

            if (!targetProviderId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await adminServices.getProviderServices(targetProviderId, {
                    page,
                    limit,
                    search: debouncedSearch || undefined,
                    categoryId: categoryFilter || undefined,
                    status: statusFilter || undefined,
                });

                if (!active) return;

                const data = response.data?.data;
                const fetchedItems: IProviderService[] = data?.items || [];
                const fetchedTotalPages: number = data?.totalPages || 0;

                if (page > 1 && fetchedTotalPages > 0 && page > fetchedTotalPages) {
                    setPage(fetchedTotalPages);
                    return;
                }

                setServices(fetchedItems);
                setTotalItems(data?.totalItems || 0);
                setTotalPages(fetchedTotalPages);
                setStats(data?.stats || DEFAULT_STATS);
            } catch (error: unknown) {
                if (!active) return;
                console.error("Failed to fetch provider services:", error);
                toast.error(getErrorMessage(error, "Failed to load provider services"));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        });

        return () => {
            active = false;
        };
    }, [targetProviderId, page, limit, debouncedSearch, categoryFilter, statusFilter, refreshKey]);

    const triggerRefresh = () => setRefreshKey((k) => k + 1);

    const handleSaveEdit = async (
        serviceId: string,
        payload: IAdminUpdateProviderServicePayload
    ) => {
        try {
            await adminServices.updateProviderService(serviceId, payload);
            toast.success("Provider service updated successfully");
            setEditingService(null);
            triggerRefresh();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to update provider service"));
            throw error;
        }
    };

    const handleConfirmBlock = async (serviceId: string, reason: string) => {
        try {
            await adminServices.blockProviderService(serviceId, reason);
            toast.success("Provider service blocked successfully");
            setBlockingService(null);
            triggerRefresh();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to block provider service"));
            throw error;
        }
    };

    const handleConfirmUnblock = async (serviceId: string) => {
        try {
            setIsUnblocking(true);
            await adminServices.unblockProviderService(serviceId);
            toast.success("Provider service unblocked successfully");
            setUnblockingService(null);
            triggerRefresh();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to unblock provider service"));
        } finally {
            setIsUnblocking(false);
        }
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setCategoryFilter("");
        setStatusFilter("");
        setPage(1);
    };

    const hasActiveFilters = Boolean(debouncedSearch || categoryFilter || statusFilter);
    const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalItems);
    const pageNumbers = getPageNumbers(page, totalPages);

    return (
        <div className="flex flex-col space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-gray-500">Total Services</span>
                        <div className="text-blue-600">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalServices}</h3>
                        <p className="text-sm text-gray-500">
                            <span className="text-emerald-600 font-medium">{stats.activeServices} active</span>
                            {" • "}
                            <span className="text-rose-600 font-medium">{stats.blockedServices} blocked</span>
                            {stats.inactiveServices > 0 && ` • ${stats.inactiveServices} inactive`}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-gray-500">Avg. Service Price</span>
                        <div className="text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            ₹{stats.averagePrice.toFixed(2)}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {stats.totalServices > 0
                                ? `Across ${stats.totalServices} catalog service${stats.totalServices === 1 ? "" : "s"}`
                                : "No pricing data yet"}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-gray-500">Service Coverage</span>
                        <div className="text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.maxServiceRadius > 0 ? `Up to ${stats.maxServiceRadius} km` : "0 km"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {stats.onSiteCount} on-site • {stats.instantBookingCount} instant booking
                        </p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Table Header Controls */}
                <div className="px-6 py-5 border-b border-gray-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Service Catalog</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Edit service details or block inappropriate offerings with a reason.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:flex-initial sm:w-60">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search services..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="appearance-none border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-3 pr-9 py-2 bg-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="appearance-none border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-3 pr-9 py-2 bg-white"
                            >
                                <option value="">All Statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="BLOCKED">Blocked</option>
                            </select>
                            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1.5 cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Service Name
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Coverage & Options
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Base Price
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                        Loading provider services...
                                    </td>
                                </tr>
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <p className="text-sm font-medium text-gray-600">
                                            {hasActiveFilters
                                                ? "No services match your current filters."
                                                : "This provider has not added any services yet."}
                                        </p>
                                        {hasActiveFilters && (
                                            <button
                                                type="button"
                                                onClick={handleResetFilters}
                                                className="mt-2 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                                            >
                                                Reset filters
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => {
                                    const resolvedCategory =
                                        service.categoryName ||
                                        categoryMap.get(service.categoryId) ||
                                        "Uncategorized";

                                    return (
                                        <tr key={service.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {service.name}
                                                </div>
                                                {service.description && (
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                        {service.description}
                                                    </p>
                                                )}
                                                {service.status === "BLOCKED" && service.blockReason && (
                                                    <div className="mt-2 inline-flex items-start gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs text-rose-700">
                                                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                                        <span>
                                                            <strong className="font-semibold">Reason:</strong>{" "}
                                                            {service.blockReason}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                                                    {resolvedCategory}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {service.serviceRadius} km radius
                                                    </span>
                                                    <div className="flex flex-wrap gap-1">
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                                                service.isAvailable
                                                                    ? "bg-blue-50 text-blue-700"
                                                                    : "bg-gray-100 text-gray-500"
                                                            }`}
                                                        >
                                                            {service.isAvailable ? "Public" : "Hidden"}
                                                        </span>
                                                        {service.onSite && (
                                                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-medium">
                                                                On-site
                                                            </span>
                                                        )}
                                                        {service.acceptUrgent && (
                                                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[11px] font-medium">
                                                                Urgent
                                                            </span>
                                                        )}
                                                        {service.instantBooking && (
                                                            <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[11px] font-medium">
                                                                Instant
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                                ₹{service.startingPrice.toLocaleString("en-IN")}
                                                <span className="text-xs font-medium text-gray-500 ml-1">
                                                    {service.pricingType === "HOURLY" ? "/hr" : "Flat"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        STATUS_BADGE_STYLES[service.status]
                                                    }`}
                                                >
                                                    {service.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="inline-flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingService(service)}
                                                        title="Edit service"
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    {service.status === "BLOCKED" ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnblockingService(service)}
                                                            title="Unblock service"
                                                            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <ShieldCheck className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setBlockingService(service)}
                                                            title="Block service with reason"
                                                            className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                            Showing <strong className="text-gray-800">{startItem}</strong> to{" "}
                            <strong className="text-gray-800">{endItem}</strong> of{" "}
                            <strong className="text-gray-800">{totalItems}</strong> services
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Rows:</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="border border-gray-200 rounded-md px-2 py-1 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={loading || page <= 1}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        {pageNumbers.map((item, idx) =>
                            item === "..." ? (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="px-2 py-1 text-sm text-gray-400 select-none"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={item}
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setPage(item)}
                                    className={`min-w-8 px-2.5 py-1.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer ${
                                        page === item
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {item}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={loading || totalPages === 0 || page >= totalPages}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <EditProviderServiceModal
                service={editingService}
                categories={categories}
                onClose={() => setEditingService(null)}
                onSave={handleSaveEdit}
            />

            <BlockProviderServiceModal
                service={blockingService}
                onClose={() => setBlockingService(null)}
                onConfirmBlock={handleConfirmBlock}
            />

            <UnblockProviderServiceModal
                service={unblockingService}
                isSubmitting={isUnblocking}
                onClose={() => setUnblockingService(null)}
                onConfirmUnblock={handleConfirmUnblock}
            />
        </div>
    );
};

export default ProviderServiceCatalog;
