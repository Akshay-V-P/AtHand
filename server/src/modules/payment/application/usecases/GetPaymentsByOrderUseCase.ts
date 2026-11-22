import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { Payment } from "../../domain/entities/Payment";
import { OrderRepository } from "../../../order/infrastructure/database/repositories/OrderRepository";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export class GetPaymentsByOrderUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly orderRepository: OrderRepository
    ) { }

    async execute(userId: string, orderId: string, isAdmin: boolean = false): Promise<Payment[]> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }

        const customerId = (order.customerId as any)?._id?.toString() ||
            (order.customerId as any)?.id?.toString() ||
            order.customerId?.toString();

        const providerUserId = (order.providerId as any)?.userId?.toString() ||
            (order.providerId as any)?._id?.toString() ||
            order.providerId?.toString();

        if (customerId !== userId && providerUserId !== userId && !isAdmin) {
            throw new UnauthorizedError("Unauthorized access to order payment history");
        }

        return this.paymentRepository.findByReferenceId(orderId);
    }
}
