import { OrderRepository } from "../../infrastructure/database/repositories/OrderRepository";
import { IOrder, IWorkProofPhoto } from "../../domain/entities/OrderEntity";
import { OrderStatus } from "../../domain/enums/OrderStatus";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class CompleteRepairUseCase {
    constructor(private orderRepository: OrderRepository) { }

    async execute(data: {
        orderId: string;
        providerUserId: string;
        notes?: string;
        workProofPhotos?: IWorkProofPhoto[];
    }): Promise<IOrder> {
        const order = await this.orderRepository.findById(data.orderId);
        if (!order) throw new AppError("Order not found", HttpStatus.NOT_FOUND);

        const providerUserId = (order.providerId as any)?.userId?.toString() ||
            (order.providerId as any)?._id?.toString() ||
            order.providerId?.toString();

        if (providerUserId !== data.providerUserId) {
            throw new AppError("Unauthorized: Only the assigned technician can mark repair completed", HttpStatus.FORBIDDEN);
        }

        if (order.status !== OrderStatus.REPAIR_IN_PROGRESS) {
            throw new AppError("Cannot complete repair: Order is not currently in progress", HttpStatus.BAD_REQUEST);
        }

        const updated = await this.orderRepository.update(data.orderId, {
            status: OrderStatus.WAITING_FOR_PAYMENT,
            completionDetails: {
                notes: data.notes || "Repair completed successfully",
                workProofPhotos: data.workProofPhotos || [],
                completedAt: new Date()
            }
        });

        if (!updated) throw new AppError("Failed to update repair completion", HttpStatus.INTERNAL_SERVER_ERROR);
        return updated;
    }
}
