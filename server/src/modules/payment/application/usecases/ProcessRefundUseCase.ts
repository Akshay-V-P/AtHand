import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { IRazorpayGateway } from "../../domain/interfaces/IRazorpayGateway";
import { PaymentStatus } from "../../domain/enums/PaymentStatus";
import { RefundPaymentDTO, RefundPaymentResult } from "../dtos/RefundPaymentDTO";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export class ProcessRefundUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly razorpayGateway: IRazorpayGateway
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

        if (!payment.razorpayPaymentId) {
            throw new BadRequestError("Missing Razorpay payment ID for refund processing");
        }

        
        const alreadyRefunded = (payment.refunds || []).reduce((sum, r) => sum + r.amount, 0);
        const remainingRefundable = payment.amount - alreadyRefunded;

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

        
        const refundAmountInPaise = Math.round(refundAmount * 100);
        const rzpRefund = await this.razorpayGateway.createRefund(
            payment.razorpayPaymentId,
            refundAmountInPaise,
            {
                reason: dto.reason || "Customer refund request",
                paymentId: payment.id,
            }
        );

        
        const newRefunds = [
            ...(payment.refunds || []),
            {
                refundId: rzpRefund.id,
                amount: refundAmount,
                status: rzpRefund.status,
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
            refundId: rzpRefund.id,
            paymentId: payment.id,
            amount: refundAmount,
            status: newStatus,
        };
    }
}
