import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { IRazorpayGateway } from "../../domain/interfaces/IRazorpayGateway";
import { PaymentStatus } from "../../domain/enums/PaymentStatus";
import { PaymentPurpose } from "../../domain/enums/PaymentPurpose";
import { VerifyPaymentDTO, VerifyPaymentResult } from "../dtos/VerifyPaymentDTO";
import { ProcessOrderPaymentUseCase } from "../../../order/application/usecases/ProcessOrderPaymentUseCase";
import { CreateWalletTransactionUseCase } from "../../../wallet/application/usecases/CreateWalletTransactionUseCase";
import { DistributeOrderPaymentUseCase } from "./DistributeOrderPaymentUseCase";
import {
    WalletTransactionCategory,
    WalletTransactionReferenceType,
    WalletTransactionType,
} from "../../../wallet/domain/entities/WalletTransaction";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export class VerifyPaymentUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly razorpayGateway: IRazorpayGateway,
        private readonly processOrderPaymentUseCase: ProcessOrderPaymentUseCase,
        private readonly createWalletTransactionUseCase: CreateWalletTransactionUseCase,
        private readonly distributeOrderPaymentUseCase: DistributeOrderPaymentUseCase
    ) { }

    async execute(userId: string, dto: VerifyPaymentDTO): Promise<VerifyPaymentResult> {
        if (!dto.razorpayOrderId || !dto.razorpayPaymentId || !dto.razorpaySignature) {
            throw new BadRequestError("Razorpay order ID, payment ID, and signature are required");
        }

        
        const isSignatureValid = this.razorpayGateway.verifyPaymentSignature(
            dto.razorpayOrderId,
            dto.razorpayPaymentId,
            dto.razorpaySignature
        );

        
        const payment = await this.paymentRepository.findByRazorpayOrderId(dto.razorpayOrderId);
        if (!payment || !payment.id) {
            throw new NotFoundError("Payment record not found for this order ID");
        }

        
        if (payment.userId.toString() !== userId.toString()) {
            throw new UnauthorizedError("Unauthorized: Payment does not belong to you");
        }

        if (!isSignatureValid) {
            await this.paymentRepository.update(payment.id, {
                status: PaymentStatus.FAILED,
                failureReason: "Invalid Razorpay payment signature",
                razorpayPaymentId: dto.razorpayPaymentId,
                razorpaySignature: dto.razorpaySignature,
            });
            throw new BadRequestError("Invalid payment signature");
        }

        
        if (payment.status === PaymentStatus.COMPLETED) {
            return {
                success: true,
                paymentId: payment.id,
                orderId: payment.purpose === PaymentPurpose.ORDER_PAYMENT ? payment.referenceId : undefined,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
                message: "Payment has already been verified and processed",
            };
        }

        
        const rzpPayment = await this.razorpayGateway.fetchPayment(dto.razorpayPaymentId);

        
        if (rzpPayment.order_id !== dto.razorpayOrderId) {
            await this.paymentRepository.update(payment.id, {
                status: PaymentStatus.FAILED,
                failureReason: `Order ID mismatch: expected ${dto.razorpayOrderId}, got ${rzpPayment.order_id}`,
            });
            throw new BadRequestError("Payment order ID does not match expected order");
        }

        
        if (!rzpPayment.captured) {
            await this.paymentRepository.update(payment.id, {
                status: PaymentStatus.PENDING,
                failureReason: `Payment status is ${rzpPayment.status}, not yet captured`,
                razorpayPaymentId: dto.razorpayPaymentId,
            });
            throw new BadRequestError(
                `Payment is not captured (Current status: ${rzpPayment.status}). Please try again or wait.`
            );
        }

        
        const expectedPaise = Math.round(payment.amount * 100);
        if (rzpPayment.amount !== expectedPaise) {
            await this.paymentRepository.update(payment.id, {
                status: PaymentStatus.FAILED,
                failureReason: `Amount mismatch: expected ${expectedPaise} paise, received ${rzpPayment.amount} paise`,
                razorpayPaymentId: dto.razorpayPaymentId,
            });
            throw new BadRequestError("Payment amount mismatch");
        }

        
        if (rzpPayment.currency.toUpperCase() !== payment.currency.toUpperCase()) {
            await this.paymentRepository.update(payment.id, {
                status: PaymentStatus.FAILED,
                failureReason: `Currency mismatch: expected ${payment.currency}, received ${rzpPayment.currency}`,
                razorpayPaymentId: dto.razorpayPaymentId,
            });
            throw new BadRequestError("Payment currency mismatch");
        }

        
        await this.paymentRepository.update(payment.id, {
            status: PaymentStatus.COMPLETED,
            razorpayPaymentId: dto.razorpayPaymentId,
            razorpaySignature: dto.razorpaySignature,
            metadata: {
                ...(payment.metadata || {}),
                paymentMethod: rzpPayment.method,
                capturedAt: new Date(),
                email: rzpPayment.email,
                contact: rzpPayment.contact,
            },
        });

        
        if (payment.purpose === PaymentPurpose.ORDER_PAYMENT) {
            const paymentMethodStr = `RAZORPAY_${rzpPayment.method?.toUpperCase() || "ONLINE"}`;
            await this.distributeOrderPaymentUseCase.execute({
                orderId: payment.referenceId,
                paymentId: payment.id,
                paymentMethod: paymentMethodStr,
            });
            await this.processOrderPaymentUseCase.execute({
                orderId: payment.referenceId,
                customerId: payment.userId,
                paymentMethod: paymentMethodStr,
            });
        } else if (payment.purpose === PaymentPurpose.WALLET_TOPUP) {
            await this.createWalletTransactionUseCase.execute({
                userId: payment.userId,
                walletId: payment.referenceId,
                amount: payment.amount,
                type: WalletTransactionType.CREDIT,
                category: WalletTransactionCategory.PAYMENT,
                referenceType: WalletTransactionReferenceType.PAYMENT,
                referenceId: payment.id,
                description: `Wallet top-up via Razorpay (${dto.razorpayPaymentId})`,
            });
        }

        return {
            success: true,
            paymentId: payment.id,
            orderId: payment.purpose === PaymentPurpose.ORDER_PAYMENT ? payment.referenceId : undefined,
            status: PaymentStatus.COMPLETED,
            amount: payment.amount,
            currency: payment.currency,
            message: "Payment verified and order updated successfully",
        };
    }
}
