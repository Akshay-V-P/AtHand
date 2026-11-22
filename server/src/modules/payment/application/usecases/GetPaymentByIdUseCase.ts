import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { Payment } from "../../domain/entities/Payment";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export class GetPaymentByIdUseCase {
    constructor(private readonly paymentRepository: IPaymentRepository) { }

    async execute(userId: string, paymentId: string, isAdmin: boolean = false): Promise<Payment> {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new NotFoundError("Payment not found");
        }

        if (payment.userId.toString() !== userId.toString() && !isAdmin) {
            throw new UnauthorizedError("Unauthorized access to payment details");
        }

        return payment;
    }
}
