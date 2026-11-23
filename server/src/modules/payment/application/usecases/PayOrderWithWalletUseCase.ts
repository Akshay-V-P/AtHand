import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { PaymentPurpose } from "../../domain/enums/PaymentPurpose";
import { PaymentStatus } from "../../domain/enums/PaymentStatus";
import { DistributeOrderPaymentUseCase } from "./DistributeOrderPaymentUseCase";
import { ProcessOrderPaymentUseCase } from "../../../order/application/usecases/ProcessOrderPaymentUseCase";
import { OrderRepository } from "../../../order/infrastructure/database/repositories/OrderRepository";
import { IWalletRepository } from "../../../wallet/domain/repositories/IWalletRepository";
import { IWalletTransactionRepository } from "../../../wallet/domain/repositories/IWalletTransactionRepository";
import { ICategoryRepository } from "../../../category/domain/repositories/ICategoryRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { IQuoteRepository } from "../../../quote/domain/interfaces/IQuoteRepository";
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
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export interface PayOrderWithWalletInput {
    orderId: string;
    userId: string;
}

export interface PayOrderWithWalletResult {
    success: boolean;
    orderId: string;
    orderNumber?: string;
    paymentId: string;
    amountPaid: number;
    customerBalanceAfter: number;
    providerEarnings: number;
    commissionAmount: number;
    message: string;
}

export class PayOrderWithWalletUseCase {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly walletRepository: IWalletRepository,
        private readonly walletTransactionRepository: IWalletTransactionRepository,
        private readonly paymentRepository: IPaymentRepository,
        private readonly distributeOrderPaymentUseCase: DistributeOrderPaymentUseCase,
        private readonly processOrderPaymentUseCase: ProcessOrderPaymentUseCase,
        private readonly categoryRepository?: ICategoryRepository,
        private readonly serviceRequestRepository?: IServiceRequestRepository,
        private readonly providerRepository?: IProviderRepository,
        private readonly quoteRepository?: IQuoteRepository
    ) { }

    async execute(input: PayOrderWithWalletInput): Promise<PayOrderWithWalletResult> {
        if (!input.orderId) {
            throw new BadRequestError("Order ID is required");
        }
        if (!input.userId) {
            throw new UnauthorizedError("User must be authenticated");
        }

        // 1. Fetch and validate order
        const order = await this.orderRepository.findById(input.orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }

        const customerId = (order.customerId as any)?._id?.toString() || order.customerId?.toString();
        if (customerId !== input.userId.toString()) {
            throw new UnauthorizedError("Unauthorized: You do not own this order");
        }

        if (order.payment?.status === "PAID") {
            throw new BadRequestError("Order has already been paid");
        }

        let totalToPay = order.finalAmount || order.initialQuoteAmount;
        let breakdown: PaymentBreakdown | undefined;

        if (this.categoryRepository && this.serviceRequestRepository && this.providerRepository) {
            const resolved = await OrderCommissionResolver.resolve(
                order,
                this.categoryRepository,
                this.serviceRequestRepository,
                this.providerRepository,
                this.quoteRepository
            );
            breakdown = resolved.breakdown;
            totalToPay = breakdown.totalAmount;
        }

        if (!totalToPay || totalToPay <= 0) {
            throw new BadRequestError("Invalid order amount");
        }

        // 2. Fetch and validate Customer Wallet
        const customerWallet = await this.walletRepository.findByUserAndType(
            input.userId,
            WalletType.CUSTOMER
        );

        if (!customerWallet || !customerWallet.id) {
            throw new NotFoundError("Customer wallet not found. Please contact support.");
        }

        if (customerWallet.status === WalletStatus.BLOCKED) {
            throw new BadRequestError("Your customer wallet is currently blocked");
        }

        if (customerWallet.balance < totalToPay) {
            const shortfall = Math.round((totalToPay - customerWallet.balance) * 100) / 100;
            throw new BadRequestError(
                `Insufficient wallet balance. Available: ₹${customerWallet.balance.toFixed(2)}, Required: ₹${totalToPay.toFixed(2)}. Shortfall: ₹${shortfall.toFixed(2)}.`
            );
        }

        // 3. Atomically debit customer wallet
        const newCustomerBalance = Math.round((customerWallet.balance - totalToPay) * 100) / 100;
        const updatedWallet = await this.walletRepository.update(customerWallet.id, {
            balance: newCustomerBalance,
        });

        if (!updatedWallet) {
            throw new BadRequestError("Failed to update wallet balance");
        }

        await this.walletTransactionRepository.create({
            walletId: customerWallet.id,
            type: WalletTransactionType.DEBIT,
            category: WalletTransactionCategory.PAYMENT,
            amount: totalToPay,
            balanceAfter: newCustomerBalance,
            status: WalletTransactionStatus.COMPLETED,
            referenceType: WalletTransactionReferenceType.ORDER,
            referenceId: order.id || input.orderId,
            description: `Payment for Order #${order.orderNumber || order.id} using AtHand Wallet`,
        });

        // 4. Create Payment record for audit
        const payment = await this.paymentRepository.create({
            userId: input.userId,
            amount: totalToPay,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: input.orderId,
            gateway: "WALLET",
            status: PaymentStatus.COMPLETED,
            metadata: {
                paidVia: "CUSTOMER_WALLET",
                walletId: customerWallet.id,
                paidAt: new Date(),
            },
            breakdown,
        });

        // 5. Distribute platform commission and credit provider wallet
        const distribution = await this.distributeOrderPaymentUseCase.execute({
            orderId: input.orderId,
            paymentId: payment.id,
            paymentMethod: "WALLET",
        });

        // 6. Complete Order & Service Request
        await this.processOrderPaymentUseCase.execute({
            orderId: input.orderId,
            customerId: input.userId,
            paymentMethod: "WALLET",
        });

        return {
            success: true,
            orderId: input.orderId,
            orderNumber: order.orderNumber,
            paymentId: payment.id!,
            amountPaid: totalToPay,
            customerBalanceAfter: newCustomerBalance,
            providerEarnings: distribution.providerEarnings,
            commissionAmount: distribution.commissionAmount,
            message: "Order successfully paid using AtHand Wallet",
        };
    }
}
