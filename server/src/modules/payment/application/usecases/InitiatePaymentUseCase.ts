import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { IRazorpayGateway } from "../../domain/interfaces/IRazorpayGateway";
import { PaymentPurpose } from "../../domain/enums/PaymentPurpose";
import { PaymentStatus } from "../../domain/enums/PaymentStatus";
import { InitiatePaymentDTO, InitiatePaymentResult } from "../dtos/InitiatePaymentDTO";
import { OrderRepository } from "../../../order/infrastructure/database/repositories/OrderRepository";
import { IWalletRepository } from "../../../wallet/domain/repositories/IWalletRepository";
import { OrderStatus } from "../../../order/domain/enums/OrderStatus";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { WalletStatus } from "../../../wallet/domain/entities/Wallet";

export class InitiatePaymentUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly razorpayGateway: IRazorpayGateway,
        private readonly orderRepository: OrderRepository,
        private readonly walletRepository: IWalletRepository
    ) { }

    async execute(userId: string, dto: InitiatePaymentDTO): Promise<InitiatePaymentResult> {
        if (!userId) {
            throw new UnauthorizedError("Authentication required to initiate payment");
        }

        if (!dto.referenceId || !dto.referenceId.trim()) {
            throw new BadRequestError("Reference ID is required");
        }

        if (dto.purpose === PaymentPurpose.ORDER_PAYMENT) {
            return this.initiateOrderPayment(userId, dto.referenceId.trim());
        } else if (dto.purpose === PaymentPurpose.WALLET_TOPUP) {
            return this.initiateWalletTopup(userId, dto.referenceId.trim(), dto.amount);
        } else {
            throw new BadRequestError("Unsupported payment purpose");
        }
    }

    private async initiateOrderPayment(userId: string, orderId: string): Promise<InitiatePaymentResult> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }

        const customerId = (order.customerId as any)?._id?.toString() ||
            (order.customerId as any)?.id?.toString() ||
            order.customerId?.toString();

        if (customerId !== userId) {
            throw new UnauthorizedError("Unauthorized: You do not own this order");
        }

        if (order.payment?.status === "PAID" || order.status === OrderStatus.COMPLETED) {
            throw new BadRequestError("Order has already been paid and completed");
        }

        if (order.status !== OrderStatus.WAITING_FOR_PAYMENT && order.status !== OrderStatus.ACCEPTED && order.status !== OrderStatus.REPAIR_IN_PROGRESS) {
            throw new BadRequestError(
                `Order is not currently eligible for payment (Current status: ${order.status})`
            );
        }

        // Calculate payable amount exclusively from trusted backend data
        const payableAmount = order.finalAmount || order.initialQuoteAmount;
        if (!payableAmount || payableAmount <= 0 || isNaN(payableAmount)) {
            throw new BadRequestError("Invalid order amount for payment");
        }

        // Currency is standard INR
        const currency = "INR";
        const amountInPaise = Math.round(payableAmount * 100);

        // Create traceable internal payment record
        const payment = await this.paymentRepository.create({
            userId,
            amount: payableAmount,
            currency,
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: orderId,
            gateway: "RAZORPAY",
            status: PaymentStatus.CREATED,
            metadata: {
                orderNumber: order.orderNumber,
                serviceMode: order.serviceMode,
            },
        });

        // Create Razorpay order
        const rzpOrder = await this.razorpayGateway.createOrder(
            amountInPaise,
            currency,
            payment.id || order.orderNumber,
            {
                paymentId: payment.id || "",
                orderId,
                orderNumber: order.orderNumber,
                userId,
            }
        );

        // Update payment with razorpayOrderId and PENDING status
        await this.paymentRepository.update(payment.id!, {
            razorpayOrderId: rzpOrder.id,
            status: PaymentStatus.PENDING,
        });

        return {
            paymentId: payment.id!,
            razorpayOrderId: rzpOrder.id,
            amount: payableAmount,
            amountInPaise,
            currency,
            keyId: process.env.RAZORPAY_KEY_ID || "",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: orderId,
        };
    }

    private async initiateWalletTopup(userId: string, walletId: string, amount?: number): Promise<InitiatePaymentResult> {
        if (!amount || typeof amount !== "number" || amount <= 0 || isNaN(amount)) {
            throw new BadRequestError("Valid top-up amount is required");
        }

        if (amount < 10) {
            throw new BadRequestError("Minimum wallet top-up amount is ₹10");
        }

        const wallet = await this.walletRepository.findById(walletId);
        if (!wallet) {
            throw new NotFoundError("Wallet not found");
        }

        const walletOwnerId = wallet.userId.toString();
        if (walletOwnerId !== userId) {
            throw new UnauthorizedError("Unauthorized: You do not own this wallet");
        }

        if (wallet.status === WalletStatus.BLOCKED) {
            throw new BadRequestError("Wallet is blocked and cannot accept top-ups");
        }

        const currency = wallet.currency || "INR";
        const amountInPaise = Math.round(amount * 100);

        const payment = await this.paymentRepository.create({
            userId,
            amount,
            currency,
            purpose: PaymentPurpose.WALLET_TOPUP,
            referenceId: walletId,
            gateway: "RAZORPAY",
            status: PaymentStatus.CREATED,
            metadata: {
                walletId,
            },
        });

        const rzpOrder = await this.razorpayGateway.createOrder(
            amountInPaise,
            currency,
            payment.id || `W-${walletId.slice(-6)}`,
            {
                paymentId: payment.id || "",
                walletId,
                userId,
            }
        );

        await this.paymentRepository.update(payment.id!, {
            razorpayOrderId: rzpOrder.id,
            status: PaymentStatus.PENDING,
        });

        return {
            paymentId: payment.id!,
            razorpayOrderId: rzpOrder.id,
            amount,
            amountInPaise,
            currency,
            keyId: process.env.RAZORPAY_KEY_ID || "",
            purpose: PaymentPurpose.WALLET_TOPUP,
            referenceId: walletId,
        };
    }
}
