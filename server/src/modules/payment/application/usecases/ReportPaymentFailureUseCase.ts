import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { PaymentStatus } from "../../domain/enums/PaymentStatus";
import { ReportPaymentFailureDTO } from "../dtos/ReportPaymentFailureDTO";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export class ReportPaymentFailureUseCase {
    constructor(private readonly paymentRepository: IPaymentRepository) { }

    async execute(userId: string, dto: ReportPaymentFailureDTO) {
        let payment = null;
        if (dto.razorpayOrderId) {
            payment = await this.paymentRepository.findByRazorpayOrderId(dto.razorpayOrderId);
        }
        if (!payment && dto.internalPaymentId) {
            payment = await this.paymentRepository.findById(dto.internalPaymentId);
        }
        if (!payment && dto.razorpayPaymentId) {
            payment = await this.paymentRepository.findByRazorpayPaymentId(dto.razorpayPaymentId);
        }

        if (!payment || !payment.id) {
            throw new NotFoundError("Payment record not found");
        }

        if (payment.userId.toString() !== userId.toString()) {
            throw new UnauthorizedError("Unauthorized access to payment attempt");
        }

        
        if (payment.status !== PaymentStatus.COMPLETED) {
            const failureReason = dto.reason || (dto.code ? `Failed with code: ${dto.code}` : "Payment declined or failed at checkout");
            const updated = await this.paymentRepository.update(payment.id, {
                status: PaymentStatus.FAILED,
                failureReason,
                razorpayPaymentId: dto.razorpayPaymentId || payment.razorpayPaymentId,
            });
            return updated;
        }

        return payment;
    }
}
