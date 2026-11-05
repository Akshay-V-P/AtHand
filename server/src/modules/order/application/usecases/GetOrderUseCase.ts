import { OrderRepository } from "../../infrastructure/database/repositories/OrderRepository";
import { IOrder } from "../../domain/entities/OrderEntity";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";

export class GetOrderUseCase {
    constructor(private orderRepository: OrderRepository) { }

    async getById(orderId: string, userId: string): Promise<IOrder> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new AppError("Order not found", HttpStatus.NOT_FOUND);
        }

        const customerId = (order.customerId as any)?._id?.toString() || order.customerId?.toString();
        const providerUserId = (order.providerId as any)?.userId?.toString() || (order.providerId as any)?._id?.toString() || order.providerId?.toString();

        if (customerId !== userId && providerUserId !== userId) {
            throw new AppError("Unauthorized to view this order", HttpStatus.FORBIDDEN);
        }

        return order;
    }

    async getByRequestId(requestId: string, userId: string): Promise<IOrder | null> {
        const order = await this.orderRepository.findByRequestId(requestId);
        if (!order) return null;

        const customerId = (order.customerId as any)?._id?.toString() || order.customerId?.toString();
        const providerUserId = (order.providerId as any)?.userId?.toString() || (order.providerId as any)?._id?.toString() || order.providerId?.toString();

        if (customerId !== userId && providerUserId !== userId) {
            throw new AppError("Unauthorized to view this order", HttpStatus.FORBIDDEN);
        }

        return order;
    }

    async getCustomerOrders(customerId: string, page: number = 1, limit: number = 20): Promise<{ data: IOrder[], total: number }> {
        return await this.orderRepository.findByCustomerId(customerId, page, limit);
    }

    async getProviderOrders(providerId: string, page: number = 1, limit: number = 20, status?: string): Promise<PaginatedResult<IOrder>> {
        return await this.orderRepository.findByProviderId(providerId, page, limit, status);
    }
}
