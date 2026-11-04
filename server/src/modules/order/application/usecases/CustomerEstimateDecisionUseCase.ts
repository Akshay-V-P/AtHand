import { OrderRepository } from "../../infrastructure/database/repositories/OrderRepository";
import { IOrder } from "../../domain/entities/OrderEntity";
import { OrderStatus } from "../../domain/enums/OrderStatus";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class CustomerEstimateDecisionUseCase {
    constructor(private orderRepository: OrderRepository) { }

    async execute(data: {
        orderId: string;
        customerId: string;
        action: 'APPROVE' | 'DECLINE';
        rejectionReason?: string;
    }): Promise<IOrder> {
        const order = await this.orderRepository.findById(data.orderId);
        if (!order) throw new AppError("Order not found", HttpStatus.NOT_FOUND);

        const orderCustomerId = (order.customerId as any)?._id?.toString() || order.customerId?.toString();
        if (orderCustomerId !== data.customerId) {
            throw new AppError("Unauthorized: Only the customer who placed the order can approve or decline the estimate", HttpStatus.FORBIDDEN);
        }

        if (order.status !== OrderStatus.ESTIMATE_PENDING_APPROVAL) {
            throw new AppError("Order is not awaiting estimate approval", HttpStatus.BAD_REQUEST);
        }

        if (!order.repairEstimate) {
            throw new AppError("No repair estimate found for this order", HttpStatus.BAD_REQUEST);
        }

        const now = new Date();

        if (data.action === 'APPROVE') {
            const updated = await this.orderRepository.update(data.orderId, {
                status: OrderStatus.REPAIR_IN_PROGRESS,
                repairEstimate: {
                    ...order.repairEstimate,
                    status: 'APPROVED',
                    decidedAt: now
                }
            });
            if (!updated) throw new AppError("Failed to approve estimate", HttpStatus.INTERNAL_SERVER_ERROR);
            return updated;
        } else {
            // Customer declined repair estimate
            const updated = await this.orderRepository.update(data.orderId, {
                status: OrderStatus.CLOSED_WITHOUT_REPAIR,
                repairEstimate: {
                    ...order.repairEstimate,
                    status: 'REJECTED',
                    rejectionReason: data.rejectionReason || "Customer declined estimate",
                    decidedAt: now
                }
            });
            if (!updated) throw new AppError("Failed to decline estimate", HttpStatus.INTERNAL_SERVER_ERROR);
            return updated;
        }
    }
}
