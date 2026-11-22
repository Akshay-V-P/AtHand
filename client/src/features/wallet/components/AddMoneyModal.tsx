import { useState } from "react";
import { Modal } from "@/shared/components/Modal";
import { Button } from "@/shared/components/Button";
import { paymentApi } from "@/features/payment/api/paymentApi";
import { loadRazorpayScript } from "@/features/payment/utils/loadRazorpay";
import type { RazorpayCheckoutOptions, RazorpayCheckoutResponse } from "@/features/payment/dtos/PaymentDTOs";
import { useQueryClient } from "@tanstack/react-query";
import { walletQueryKeys } from "../hooks/useWallet";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck, IndianRupee } from "lucide-react";
import { useAppSelector } from "@/hooks/storeHook";

interface AddMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletId: string;
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export const AddMoneyModal = ({ isOpen, onClose, walletId }: AddMoneyModalProps) => {
    const [amount, setAmount] = useState<number | string>(1000);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const user = useAppSelector((state) => state.auth.user);

    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;

    const handleTopUp = async () => {
        if (!numericAmount || isNaN(numericAmount) || numericAmount < 10) {
            toast.error("Please enter a valid amount (minimum ₹10)");
            return;
        }

        try {
            setIsLoading(true);

            // 1. Ensure Razorpay SDK is loaded
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Unable to initialize payment gateway. Please check your internet connection.");
                setIsLoading(false);
                return;
            }

            // 2. Initiate top-up order on backend
            const initResponse = await paymentApi.initiatePayment({
                purpose: "WALLET_TOPUP",
                referenceId: walletId,
                amount: numericAmount,
            });

            if (!initResponse.data.success || !initResponse.data.data) {
                toast.error(initResponse.data.message || "Failed to initiate top-up");
                setIsLoading(false);
                return;
            }

            const checkoutData = initResponse.data.data;

            // 3. Configure Razorpay options
            const options: RazorpayCheckoutOptions = {
                key: checkoutData.keyId || (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || "",
                amount: checkoutData.amountInPaise,
                currency: checkoutData.currency || "INR",
                name: "AtHand Services",
                description: `Customer Wallet Top-up (₹${numericAmount})`,
                order_id: checkoutData.razorpayOrderId,
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || "",
                },
                theme: {
                    color: "#e30000",
                },
                handler: async (response: RazorpayCheckoutResponse) => {
                    try {
                        const verifyRes = await paymentApi.verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            toast.success(`Successfully added ₹${numericAmount} to your wallet!`);
                            await queryClient.invalidateQueries({ queryKey: walletQueryKeys.customer() });
                            onClose();
                        } else {
                            toast.error(verifyRes.data.message || "Payment verification failed");
                        }
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Failed to verify payment");
                    } finally {
                        setIsLoading(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false);
                        toast("Payment process cancelled", { icon: "ℹ️" });
                    },
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", (resp: any) => {
                toast.error(resp.error?.description || "Payment failed");
                setIsLoading(false);
            });
            rzp.open();
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to process top-up");
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Money to Wallet">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter Amount
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <IndianRupee className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                            type="number"
                            min="10"
                            step="10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 1000"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            disabled={isLoading}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">Minimum recharge amount is ₹10.</p>
                </div>

                {/* Preset quick buttons */}
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Popular amounts</p>
                    <div className="grid grid-cols-4 gap-2">
                        {PRESET_AMOUNTS.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => setAmount(preset)}
                                className={`py-2 px-3 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                                    Number(amount) === preset
                                        ? "border-red-500 bg-red-50 text-red-600"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                                disabled={isLoading}
                            >
                                +₹{preset.toLocaleString("en-IN")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Secure 256-bit encrypted checkout powered by Razorpay.</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleTopUp}
                        disabled={isLoading || !numericAmount || numericAmount < 10}
                        className="min-w-[140px] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>Proceed to Pay</span>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
