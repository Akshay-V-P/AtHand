import { OrderRepository } from "../../infrastructure/database/repositories/OrderRepository";
import ProviderModel from "../../../provider/infrastructure/database/models/ProviderModel";
import { IOrder } from "../../domain/entities/OrderEntity";
import { OrderStatus } from "../../domain/enums/OrderStatus";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class SubmitOrderReviewUseCase {
    constructor(private orderRepository: OrderRepository) { }

    async execute(data: {
        orderId: string;
        customerId: string;
        rating: number;
        comment?: string;
    }): Promise<IOrder> {
        const order = await this.orderRepository.findById(data.orderId);
        if (!order) throw new AppError("Order not found", HttpStatus.NOT_FOUND);

        const orderCustomerId = (order.customerId as any)?._id?.toString() || order.customerId?.toString();
        if (orderCustomerId !== data.customerId) {
            throw new AppError("Unauthorized: Only the customer can submit a review", HttpStatus.FORBIDDEN);
        }

        if (order.status !== OrderStatus.COMPLETED) {
            throw new AppError("Can only review completed orders", HttpStatus.BAD_REQUEST);
        }

        if (data.rating < 1 || data.rating > 5) {
            throw new AppError("Rating must be between 1 and 5", HttpStatus.BAD_REQUEST);
        }

        const updated = await this.orderRepository.update(data.orderId, {
            review: {
                rating: data.rating,
                comment: data.comment || "",
                reviewedAt: new Date()
            }
        });

        if (!updated) throw new AppError("Failed to submit review", HttpStatus.INTERNAL_SERVER_ERROR);

       
        const providerId = (order.providerId as any)?._id?.toString() || order.providerId?.toString();
        if (providerId) {
            const provider = await ProviderModel.findById(providerId);
            if (provider) {
                const currentTotal = provider.totalReviews || 0;
                const currentRating = provider.averageRating || 5;
                const newTotal = currentTotal + 1;
                const newAverage = ((currentRating * currentTotal) + data.rating) / newTotal;

                await ProviderModel.findByIdAndUpdate(providerId, {
                    averageRating: Math.round(newAverage * 10) / 10,
                    totalReviews: newTotal
                });
            }
        }

        return updated;
    }
}
