import { OrderRepository } from "../../infrastructure/database/repositories/OrderRepository";
import { IOrder } from "../../domain/entities/OrderEntity";
import { OrderStatus } from "../../domain/enums/OrderStatus";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import ProviderModel from "../../../provider/infrastructure/database/models/ProviderModel";

export class SubmitDiagnosisUseCase {
    constructor(private orderRepository: OrderRepository) { }

    async execute(data: {
        orderId: string;
        providerUserId: string;
        summary: string;
        identifiedIssues: string[];
    }): Promise<IOrder> {
        const order = await this.orderRepository.findById(data.orderId);
        if (!order) throw new AppError("Order not found", HttpStatus.NOT_FOUND);

        const providerUserId = (order.providerId as any)?.userId?.toString() ||
            (order.providerId as any)?._id?.toString() ||
            order.providerId?.toString();

        const rawProvId = (order.providerId as any)?._id?.toString() || order.providerId?.toString();
        const isProvider = rawProvId ? await ProviderModel.exists({ _id: rawProvId, userId: data.providerUserId }) : false;

        if (providerUserId !== data.providerUserId && !isProvider) {
            throw new AppError("Unauthorized: Only the assigned technician can record diagnosis", HttpStatus.FORBIDDEN);
        }

        const updated = await this.orderRepository.update(data.orderId, {
            status: OrderStatus.DIAGNOSIS_IN_PROGRESS,
            diagnosis: {
                summary: data.summary,
                identifiedIssues: data.identifiedIssues,
                completedAt: new Date()
            }
        });

        if (!updated) throw new AppError("Failed to update diagnosis", HttpStatus.INTERNAL_SERVER_ERROR);
        return updated;
    }
}
