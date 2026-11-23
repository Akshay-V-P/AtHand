import { ICommissionLedgerRepository } from "../../domain/interfaces/ICommissionLedgerRepository";
import { PlatformCommissionLedger, PlatformCommissionStatus } from "../../domain/entities/PlatformCommissionLedger";
import { OrderRepository } from "../../../order/infrastructure/database/repositories/OrderRepository";
import { IWalletRepository } from "../../../wallet/domain/repositories/IWalletRepository";
import { IWalletTransactionRepository } from "../../../wallet/domain/repositories/IWalletTransactionRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { ICategoryRepository } from "../../../category/domain/repositories/ICategoryRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { IQuoteRepository } from "../../../quote/domain/interfaces/IQuoteRepository";
import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { OrderCommissionResolver } from "../../domain/services/OrderCommissionResolver";
import { PaymentBreakdown } from "../../domain/services/CommissionCalculator";
import { WalletStatus, WalletType } from "../../../wallet/domain/entities/Wallet";
import {
    WalletTransactionCategory,
    WalletTransactionReferenceType,
    WalletTransactionStatus,
    WalletTransactionType,
} from "../../../wallet/domain/entities/WalletTransaction";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";

export interface DistributeOrderPaymentInput {
    orderId: string;
    paymentId?: string;
    paymentMethod: string;
}

export interface DistributeOrderPaymentResult {
    ledger: PlatformCommissionLedger;
    providerEarnings: number;
    commissionAmount: number;
    alreadyDistributed: boolean;
}

export class DistributeOrderPaymentUseCase {
    constructor(
        private readonly commissionLedgerRepository: ICommissionLedgerRepository,
        private readonly orderRepository: OrderRepository,
        private readonly walletRepository: IWalletRepository,
        private readonly walletTransactionRepository: IWalletTransactionRepository,
        private readonly serviceRequestRepository: IServiceRequestRepository,
        private readonly categoryRepository: ICategoryRepository,
        private readonly providerRepository: IProviderRepository,
        private readonly quoteRepository?: IQuoteRepository,
        private readonly paymentRepository?: IPaymentRepository
    ) { }

    async execute(input: DistributeOrderPaymentInput): Promise<DistributeOrderPaymentResult> {
        if (!input.orderId) {
            throw new BadRequestError("Order ID is required for financial distribution");
        }

        // 1. Idempotency Check: Commission already allocated?
        const existingLedger = await this.commissionLedgerRepository.findByOrderId(input.orderId);
        if (existingLedger) {
            return {
                ledger: existingLedger,
                providerEarnings: existingLedger.providerEarnings,
                commissionAmount: existingLedger.commissionAmount,
                alreadyDistributed: true,
            };
        }

        // 2. Fetch the order
        const order = await this.orderRepository.findById(input.orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }

        // 3. Resolve Provider
        const providerId = (order.providerId as any)?._id?.toString() || order.providerId?.toString();
        if (!providerId) {
            throw new BadRequestError("Order is missing provider reference");
        }

        const provider = await this.providerRepository.findById(providerId);
        if (!provider) {
            throw new NotFoundError("Provider not found");
        }

        const providerUserId = provider.userId?.toString();
        if (!providerUserId) {
            throw new NotFoundError("Provider user account not found");
        }

        // 4. Resolve Commission Breakdown
        // If paymentId is passed and payment already carries an immutable breakdown snapshot, use it.
        // Otherwise, resolve dynamically using OrderCommissionResolver.
        let breakdown: PaymentBreakdown;
        let categoryId: string = providerId;
        let categoryName: string = "Service";

        let existingPayment = null;
        if (input.paymentId && this.paymentRepository) {
            existingPayment = await this.paymentRepository.findById(input.paymentId);
        }

        if (existingPayment?.breakdown) {
            breakdown = existingPayment.breakdown;
            // Resolve category name for audit record
            const requestId = (order.requestId as any)?._id?.toString() || order.requestId?.toString();
            if (requestId) {
                const sr = await this.serviceRequestRepository.findById(requestId);
                if (sr?.categoryId) {
                    categoryId = (sr.categoryId as any)?._id?.toString() || sr.categoryId.toString();
                    const cat = await this.categoryRepository.findById(categoryId);
                    if (cat) categoryName = cat.name;
                }
            }
        } else {
            const resolved = await OrderCommissionResolver.resolve(
                order,
                this.categoryRepository,
                this.serviceRequestRepository,
                this.providerRepository,
                this.quoteRepository
            );
            breakdown = resolved.breakdown;
            categoryId = resolved.categoryId;
            categoryName = resolved.categoryName;

            // Persist the computed breakdown on payment for future retries/auditing
            if (existingPayment?.id && this.paymentRepository) {
                await this.paymentRepository.update(existingPayment.id, {
                    breakdown,
                });
            }
        }

        const grossAmount = breakdown.totalAmount;
        const commissionAmount = breakdown.totalCommissionAmount;
        const providerEarnings = breakdown.providerEarning;

        // 5. Resolve or create Provider's PROVIDER wallet
        let providerWallet = await this.walletRepository.findByUserAndType(
            providerUserId,
            WalletType.PROVIDER
        );

        if (!providerWallet) {
            const createResult = await this.walletRepository.create({
                userId: providerUserId,
                type: WalletType.PROVIDER,
                balance: 0,
                status: WalletStatus.ACTIVE,
                currency: "INR",
            });
            providerWallet = createResult.wallet;
        }

        if (providerWallet.status === WalletStatus.BLOCKED) {
            throw new BadRequestError("Provider wallet is blocked; cannot credit earnings");
        }

        // 6. Credit Provider Wallet only with net earnings
        const newBalance = Math.round((providerWallet.balance + providerEarnings) * 100) / 100;
        const updatedWallet = await this.walletRepository.update(providerWallet.id!, {
            balance: newBalance,
        });

        if (!updatedWallet) {
            throw new BadRequestError("Failed to update provider wallet balance");
        }

        const description = `Earnings for Order #${order.orderNumber || order.id} (Gross: ₹${grossAmount.toFixed(2)}, Parts: ₹${breakdown.partsAmount.toFixed(2)} @ ${breakdown.partsCommissionPercentage}%, Labour: ₹${breakdown.labourAmount.toFixed(2)} @ ${breakdown.labourCommissionPercentage}%, Platform Commission: -₹${commissionAmount.toFixed(2)})`;

        await this.walletTransactionRepository.create({
            walletId: providerWallet.id!,
            type: WalletTransactionType.CREDIT,
            category: WalletTransactionCategory.EARNING,
            amount: providerEarnings,
            balanceAfter: newBalance,
            status: WalletTransactionStatus.COMPLETED,
            referenceType: WalletTransactionReferenceType.ORDER,
            referenceId: order.id || input.orderId,
            description,
        });

        // 7. Record Platform Commission Ledger Entry (Immutable snapshot)
        let ledger: PlatformCommissionLedger;
        try {
            ledger = await this.commissionLedgerRepository.create({
                orderId: input.orderId,
                paymentId: input.paymentId,
                providerId,
                providerUserId,
                categoryId: categoryId || providerId,
                categoryName,
                orderNumber: order.orderNumber,
                paymentMethod: input.paymentMethod,
                grossAmount,
                commissionPercentage: breakdown.categoryCommissionPercentage,
                commissionAmount,
                providerEarnings,
                currency: "INR",
                status: PlatformCommissionStatus.ALLOCATED,
                refundedAmount: 0,
                partsAmount: breakdown.partsAmount,
                labourAmount: breakdown.labourAmount,
                partsCommissionPercentage: breakdown.partsCommissionPercentage,
                labourCommissionPercentage: breakdown.labourCommissionPercentage,
                partsCommissionAmount: breakdown.partsCommissionAmount,
                labourCommissionAmount: breakdown.labourCommissionAmount,
            });
        } catch (err: any) {
            // Concurrent race safety: if another thread created ledger simultaneously
            const concurrentLedger = await this.commissionLedgerRepository.findByOrderId(input.orderId);
            if (concurrentLedger) {
                return {
                    ledger: concurrentLedger,
                    providerEarnings: concurrentLedger.providerEarnings,
                    commissionAmount: concurrentLedger.commissionAmount,
                    alreadyDistributed: true,
                };
            }
            throw err;
        }

        return {
            ledger,
            providerEarnings,
            commissionAmount,
            alreadyDistributed: false,
        };
    }
}
