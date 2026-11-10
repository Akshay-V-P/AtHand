import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import { getPresignedDisplayUrl } from "@/services/imageService";
import type {
    IAdminUpdateProviderServicePayload,
    IProviderService,
} from "../types/providerService";
import {
    editProviderServiceSchema,
    type EditProviderServiceFormData,
} from "../validation/providerServiceSchema";

interface CategoryOption {
    id: string;
    name: string;
}

interface EditProviderServiceModalProps {
    service: IProviderService | null;
    categories: CategoryOption[];
    onClose: () => void;
    onSave: (serviceId: string, payload: IAdminUpdateProviderServicePayload) => Promise<void>;
}

export const EditProviderServiceModal = ({
    service,
    categories,
    onClose,
    onSave,
}: EditProviderServiceModalProps) => {
    const [mediaKeys, setMediaKeys] = useState<string[]>([]);
    const [mediaPreviews, setMediaPreviews] = useState<Record<string, string>>({});

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<EditProviderServiceFormData>({
        resolver: zodResolver(editProviderServiceSchema),
    });

    const pricingType = useWatch({ control, name: "pricingType" });

    useEffect(() => {
        if (!service) return;

        reset({
            name: service.name,
            categoryId: service.categoryId,
            description: service.description || "",
            pricingType: service.pricingType,
            startingPrice: service.startingPrice,
            serviceRadius: service.serviceRadius,
            onSite: service.onSite,
            acceptUrgent: service.acceptUrgent,
            instantBooking: service.instantBooking,
            isAvailable: service.isAvailable,
            status: service.status,
        });

        const keys = service.media || [];
        let cancelled = false;

        Promise.resolve().then(async () => {
            if (cancelled) return;
            setMediaKeys(keys);
            setMediaPreviews({});
            if (keys.length === 0) return;

            const entries = await Promise.all(
                keys.map(async (key) => {
                    try {
                        const res = await getPresignedDisplayUrl(key);
                        return [key, res.data?.data as string] as const;
                    } catch {
                        return [key, ""] as const;
                    }
                })
            );
            if (cancelled) return;
            const map: Record<string, string> = {};
            for (const [key, url] of entries) {
                if (url) map[key] = url;
            }
            setMediaPreviews(map);
        });

        return () => {
            cancelled = true;
        };
    }, [service, reset]);

    const handleRemoveMedia = (keyToRemove: string) => {
        setMediaKeys((prev) => prev.filter((k) => k !== keyToRemove));
    };

    const onSubmit = async (data: EditProviderServiceFormData) => {
        if (!service) return;

        const payload: IAdminUpdateProviderServicePayload = {
            name: data.name.trim(),
            categoryId: data.categoryId,
            description: data.description.trim(),
            pricingType: data.pricingType,
            startingPrice: Number(data.startingPrice),
            serviceRadius: Number(data.serviceRadius),
            onSite: data.onSite,
            acceptUrgent: data.acceptUrgent,
            instantBooking: data.instantBooking,
            isAvailable: data.isAvailable,
            media: mediaKeys,
        };

        if (service.status !== "BLOCKED" && (data.status === "ACTIVE" || data.status === "INACTIVE")) {
            payload.status = data.status;
        }

        await onSave(service.id, payload);
    };

    const isBlocked = service?.status === "BLOCKED";

    return (
        <Modal
            isOpen={service !== null}
            onClose={() => !isSubmitting && onClose()}
            title="Edit Provider Service"
            maxWidth="max-w-2xl"
        >
            {service && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {isBlocked && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold text-rose-800">
                                    This service is currently blocked
                                </p>
                                <p className="text-rose-700 mt-0.5">
                                    <span className="font-medium">Reason:</span>{" "}
                                    {service.blockReason || "No reason recorded"}
                                </p>
                                <p className="text-xs text-rose-600 mt-1">
                                    You can update its details here; use the Unblock action in the catalog to restore it.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Service Name *
                            </label>
                            <input
                                type="text"
                                {...register("name")}
                                disabled={isSubmitting}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Category *
                            </label>
                            <select
                                {...register("categoryId")}
                                disabled={isSubmitting}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50"
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Service Status
                            </label>
                            {isBlocked ? (
                                <div className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
                                    BLOCKED (Managed via Unblock)
                                </div>
                            ) : (
                                <select
                                    {...register("status")}
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50"
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            {...register("description")}
                            disabled={isSubmitting}
                            placeholder="Describe the scope and technical details..."
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-none disabled:bg-gray-50"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Pricing Model *
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setValue("pricingType", "HOURLY", { shouldValidate: true })}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                        pricingType === "HOURLY"
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    Hourly
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setValue("pricingType", "FLAT_FEE", { shouldValidate: true })}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                        pricingType === "FLAT_FEE"
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    Flat Fee
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Starting Price (₹) *
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                {...register("startingPrice", { valueAsNumber: true })}
                                disabled={isSubmitting}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50"
                            />
                            {errors.startingPrice && (
                                <p className="mt-1 text-xs text-red-500">{errors.startingPrice.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Service Radius (km) *
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="500"
                                step="1"
                                {...register("serviceRadius", { valueAsNumber: true })}
                                disabled={isSubmitting}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50"
                            />
                            {errors.serviceRadius && (
                                <p className="mt-1 text-xs text-red-500">{errors.serviceRadius.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                            Service Options & Visibility
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Listed on Public Profile</span>
                                <input
                                    type="checkbox"
                                    {...register("isAvailable")}
                                    disabled={isSubmitting}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>

                            <label className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">On-site Service</span>
                                <input
                                    type="checkbox"
                                    {...register("onSite")}
                                    disabled={isSubmitting}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>

                            <label className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Accept Urgent Jobs</span>
                                <input
                                    type="checkbox"
                                    {...register("acceptUrgent")}
                                    disabled={isSubmitting}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>

                            <label className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Instant Booking</span>
                                <input
                                    type="checkbox"
                                    {...register("instantBooking")}
                                    disabled={isSubmitting}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>
                        </div>
                    </div>

                    {mediaKeys.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Portfolio Images ({mediaKeys.length})
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {mediaKeys.map((key, index) => (
                                    <div
                                        key={key}
                                        className="relative group h-20 rounded-xl border border-gray-200 bg-gray-100 overflow-hidden flex items-center justify-center"
                                    >
                                        {mediaPreviews[key] ? (
                                            <img
                                                src={mediaPreviews[key]}
                                                alt={`Service media ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[11px] text-gray-500 px-2 text-center truncate">
                                                Image {index + 1}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedia(key)}
                                            disabled={isSubmitting}
                                            title="Remove image"
                                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer disabled:opacity-60"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
