import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, ShieldCheck } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import type { IProviderService } from "../types/providerService";
import {
    blockProviderServiceSchema,
    type BlockProviderServiceFormData,
} from "../validation/providerServiceSchema";

const QUICK_REASONS = [
    "Inaccurate or misleading pricing",
    "Incomplete or unclear service description",
    "Violates platform service guidelines",
    "Duplicate service listing",
];

interface BlockProviderServiceModalProps {
    service: IProviderService | null;
    onClose: () => void;
    onConfirmBlock: (serviceId: string, reason: string) => Promise<void>;
}

export const BlockProviderServiceModal = ({
    service,
    onClose,
    onConfirmBlock,
}: BlockProviderServiceModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<BlockProviderServiceFormData>({
        resolver: zodResolver(blockProviderServiceSchema),
        defaultValues: { reason: "" },
    });

    const reasonValue = useWatch({ control, name: "reason" }) || "";

    useEffect(() => {
        if (service) {
            reset({ reason: "" });
        }
    }, [service, reset]);

    const onSubmit = async (data: BlockProviderServiceFormData) => {
        if (!service) return;
        await onConfirmBlock(service.id, data.reason.trim());
    };

    return (
        <Modal
            isOpen={service !== null}
            onClose={() => !isSubmitting && onClose()}
            title="Block Provider Service"
        >
            {service && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 flex items-start gap-3">
                        <Ban className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-rose-900">
                            <p className="font-semibold">
                                Block "{service.name}"?
                            </p>
                            <p className="text-xs text-rose-700 mt-1">
                                This service will be hidden from public search results and customers until unblocked. The provider will see the reason below.
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                htmlFor="block-service-reason"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Block Reason *
                            </label>
                            <span className="text-xs text-gray-400">
                                {reasonValue.length}/500
                            </span>
                        </div>
                        <textarea
                            id="block-service-reason"
                            rows={3}
                            maxLength={500}
                            {...register("reason")}
                            disabled={isSubmitting}
                            placeholder="Explain why this service is being blocked..."
                            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none disabled:bg-gray-50"
                        />
                        {errors.reason && (
                            <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>
                        )}
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">
                            Quick reasons:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {QUICK_REASONS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        setValue("reason", preset, { shouldValidate: true })
                                    }
                                    className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                        >
                            {isSubmitting ? "Blocking..." : "Confirm Block"}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

interface UnblockProviderServiceModalProps {
    service: IProviderService | null;
    isSubmitting: boolean;
    onClose: () => void;
    onConfirmUnblock: (serviceId: string) => Promise<void>;
}

export const UnblockProviderServiceModal = ({
    service,
    isSubmitting,
    onClose,
    onConfirmUnblock,
}: UnblockProviderServiceModalProps) => {
    return (
        <Modal
            isOpen={service !== null}
            onClose={() => !isSubmitting && onClose()}
            title="Unblock Provider Service"
        >
            {service && (
                <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-emerald-950">
                            <p className="font-semibold">
                                Restore "{service.name}"?
                            </p>
                            <p className="text-xs text-emerald-800 mt-1">
                                Unblocking sets the service status back to ACTIVE and clears the block reason.
                            </p>
                        </div>
                    </div>

                    {service.blockReason && (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                            <span className="font-semibold text-gray-800">Previous block reason:</span>{" "}
                            {service.blockReason}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => onConfirmUnblock(service.id)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                        >
                            {isSubmitting ? "Unblocking..." : "Confirm Unblock"}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
