import { OrderRepository } from "../../infrastructure/database/repositories/OrderRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IOrder } from "../../domain/entities/OrderEntity";
import { OrderStatus } from "../../domain/enums/OrderStatus";
import { ServiceRequestStatus } from "../../../service-request/domain/enums/ServiceRequestStatus";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class ProcessOrderPaymentUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private serviceRequestRepository: IServiceRequestRepository
    ) { }

    async execute(data: {
        orderId: string;
        customerId: string;
        paymentMethod: string;
    }): Promise<IOrder> {
        const order = await this.orderRepository.findById(data.orderId);
        if (!order) throw new AppError("Order not found", HttpStatus.NOT_FOUND);

        const orderCustomerId = (order.customerId as any)?._id?.toString() || order.customerId?.toString();
        if (orderCustomerId !== data.customerId) {
            throw new AppError("Unauthorized: Only the customer can process payment", HttpStatus.FORBIDDEN);
        }

        const totalToPay = order.finalAmount || order.initialQuoteAmount;

        const updated = await this.orderRepository.update(data.orderId, {
            status: OrderStatus.COMPLETED,
            payment: {
                ...(order.payment || {}),
                totalAmount: totalToPay,
                status: 'PAID',
                paymentMethod: data.paymentMethod || 'ONLINE',
                paidAt: new Date(),
                transactionReference: `TXN-${Date.now().toString().slice(-8)}`
            }
        });

        if (!updated) throw new AppError("Failed to update payment", HttpStatus.INTERNAL_SERVER_ERROR);

        // Update underlying ServiceRequest to COMPLETED
        const requestId = (order.requestId as any)?._id?.toString() || order.requestId?.toString();
        if (requestId) {
            await this.serviceRequestRepository.update(requestId, {
                status: ServiceRequestStatus.COMPLETED
            });
        }

        return updated;
    }
}
