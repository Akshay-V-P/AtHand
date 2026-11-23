import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { IRazorpayGateway } from "../../domain/interfaces/IRazorpayGateway";
import { PaymentStatus } from "../../domain/enums/PaymentStatus";
import { PaymentPurpose } from "../../domain/enums/PaymentPurpose";
import { RefundPaymentDTO, RefundPaymentResult } from "../dtos/RefundPaymentDTO";
import { IWalletRepository } from "../../../wallet/domain/repositories/IWalletRepository";
import { IWalletTransactionRepository } from "../../../wallet/domain/repositories/IWalletTransactionRepository";
import { ICommissionLedgerRepository } from "../../domain/interfaces/ICommissionLedgerRepository";
import { PlatformCommissionStatus } from "../../domain/entities/PlatformCommissionLedger";
import { WalletType } from "../../../wallet/domain/entities/Wallet";
import {
    WalletTransactionCategory,
    WalletTransactionReferenceType,
    WalletTransactionStatus,
    WalletTransactionType,
} from "../../../wallet/domain/entities/WalletTransaction";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export class ProcessRefundUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly razorpayGateway: IRazorpayGateway,
        private readonly walletRepository?: IWalletRepository,
        private readonly walletTransactionRepository?: IWalletTransactionRepository,
        private readonly commissionLedgerRepository?: ICommissionLedgerRepository
    ) { }

    async execute(
        userId: string,
        paymentId: string,
        dto: RefundPaymentDTO,
        isAdmin: boolean = false
    ): Promise<RefundPaymentResult> {
        if (!paymentId) {
            throw new BadRequestError("Payment ID is required");
        }

        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment || !payment.id) {
            throw new NotFoundError("Payment record not found");
        }

        const isOwner = payment.userId.toString() === userId.toString();
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedError("Unauthorized to request refund for this payment");
        }

        if (payment.status !== PaymentStatus.COMPLETED && payment.status !== PaymentStatus.PARTIALLY_REFUNDED) {
            throw new BadRequestError(`Cannot refund payment in '${payment.status}' status`);
        }

        const alreadyRefunded = (payment.refunds || []).reduce((sum, r) => sum + r.amount, 0);
        const remainingRefundable = Math.round((payment.amount - alreadyRefunded) * 100) / 100;

        if (remainingRefundable <= 0) {
            throw new BadRequestError("Payment has already been fully refunded");
        }

        const refundAmount = dto.amount !== undefined ? dto.amount : remainingRefundable;
        if (refundAmount <= 0) {
            throw new BadRequestError("Refund amount must be greater than zero");
        }

        if (refundAmount > remainingRefundable) {
            throw new BadRequestError(
                `Requested refund (₹${refundAmount}) exceeds remaining refundable amount (₹${remainingRefundable})`
            );
        }

        let refundId: string;
        let refundStatus = "processed";

        if (payment.gateway === "WALLET") {
            // Refund directly to customer wallet
            refundId = `WREF-${Date.now().toString().slice(-8)}`;
            if (this.walletRepository && this.walletTransactionRepository) {
                const customerWallet = await this.walletRepository.findByUserAndType(
                    payment.userId.toString(),
                    WalletType.CUSTOMER
                );
                if (customerWallet && customerWallet.id) {
                    const newBal = Math.round((customerWallet.balance + refundAmount) * 100) / 100;
                    await this.walletRepository.update(customerWallet.id, { balance: newBal });
                    await this.walletTransactionRepository.create({
                        walletId: customerWallet.id,
                        type: WalletTransactionType.CREDIT,
                        category: WalletTransactionCategory.REFUND,
                        amount: refundAmount,
                        balanceAfter: newBal,
                        status: WalletTransactionStatus.COMPLETED,
                        referenceType: WalletTransactionReferenceType.REFUND,
                        referenceId: payment.id,
                        description: `Refund for Order payment #${payment.referenceId} (${dto.reason || "Customer refund"})`,
                    });
                }
            }
        } else {
            // Razorpay Refund
            if (!payment.razorpayPaymentId) {
                throw new BadRequestError("Missing Razorpay payment ID for refund processing");
            }

            const refundAmountInPaise = Math.round(refundAmount * 100);
            const rzpRefund = await this.razorpayGateway.createRefund(
                payment.razorpayPaymentId,
                refundAmountInPaise,
                {
                    reason: dto.reason || "Customer refund request",
                    paymentId: payment.id,
                }
            );
            refundId = rzpRefund.id;
            refundStatus = rzpRefund.status;
        }

        // Reverse provider wallet and commission ledger if this was an order payment
        if (
            payment.purpose === PaymentPurpose.ORDER_PAYMENT &&
            this.commissionLedgerRepository &&
            this.walletRepository &&
            this.walletTransactionRepository
        ) {
            const ledger = await this.commissionLedgerRepository.findByOrderId(payment.referenceId);
            if (ledger && ledger.id) {
                const refundRatio = refundAmount / payment.amount;
                const grossPaise = Math.round(ledger.grossAmount * 100);
                const commissionPaise = Math.round(ledger.commissionAmount * 100);
                const providerEarningsPaise = Math.round(ledger.providerEarnings * 100);

                const commissionReversalPaise = Math.round(commissionPaise * refundRatio);
                const providerDebitPaise = Math.round(providerEarningsPaise * refundRatio);
                const providerDebit = providerDebitPaise / 100;

                // Adjust provider wallet
                const providerWallet = await this.walletRepository.findByUserAndType(
                    ledger.providerUserId,
                    WalletType.PROVIDER
                );

                if (providerWallet && providerWallet.id && providerDebit > 0) {
                    const newProvBal = Math.max(0, Math.round((providerWallet.balance - providerDebit) * 100) / 100);
                    await this.walletRepository.update(providerWallet.id, { balance: newProvBal });
                    await this.walletTransactionRepository.create({
                        walletId: providerWallet.id,
                        type: WalletTransactionType.DEBIT,
                        category: WalletTransactionCategory.REFUND,
                        amount: providerDebit,
                        balanceAfter: newProvBal,
                        status: WalletTransactionStatus.COMPLETED,
                        referenceType: WalletTransactionReferenceType.REFUND,
                        referenceId: payment.id,
                        description: `Adjustment debit for refunded Order #${ledger.orderNumber || ledger.orderId} (${dto.reason || "Order refund"})`,
                    });
                }

                // Update ledger
                const totalRefundedAfter = alreadyRefunded + refundAmount;
                const newLedgerStatus = totalRefundedAfter >= payment.amount
                    ? PlatformCommissionStatus.REFUNDED
                    : PlatformCommissionStatus.PARTIALLY_REFUNDED;

                await this.commissionLedgerRepository.update(ledger.id, {
                    status: newLedgerStatus,
                    refundedAmount: (ledger.refundedAmount || 0) + refundAmount,
                });
            }
        }

        const newRefunds = [
            ...(payment.refunds || []),
            {
                refundId,
                amount: refundAmount,
                status: refundStatus,
                reason: dto.reason,
                createdAt: new Date(),
            },
        ];

        const totalRefundedAfter = alreadyRefunded + refundAmount;
        const newStatus = totalRefundedAfter >= payment.amount
            ? PaymentStatus.REFUNDED
            : PaymentStatus.PARTIALLY_REFUNDED;

        await this.paymentRepository.update(payment.id, {
            status: newStatus,
            refunds: newRefunds,
        });

        return {
            success: true,
            refundId,
            paymentId: payment.id,
            amount: refundAmount,
            status: newStatus,
        };
    }
}
