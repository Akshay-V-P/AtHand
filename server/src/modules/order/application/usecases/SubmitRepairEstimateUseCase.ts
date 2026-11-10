import { OrderRepository } from "../../infrastructure/database/repositories/OrderRepository";
import { IOrder, IEstimateItem } from "../../domain/entities/OrderEntity";
import { OrderStatus } from "../../domain/enums/OrderStatus";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import ProviderModel from "../../../provider/infrastructure/database/models/ProviderModel";

export class SubmitRepairEstimateUseCase {
    constructor(private orderRepository: OrderRepository) { }

    async execute(data: {
        orderId: string;
        providerUserId: string;
        items: IEstimateItem[];
        laborCost: number;
        partsCost: number;
        otherCharges?: number;
        totalAmount: number;
        estimatedRepairTime?: string;
        warranty?: string;
        notes?: string;
        updatedIssues?: string[];
    }): Promise<IOrder> {
        const order = await this.orderRepository.findById(data.orderId);
        if (!order) throw new AppError("Order not found", HttpStatus.NOT_FOUND);

        const providerUserId = (order.providerId as any)?.userId?.toString() ||
            (order.providerId as any)?._id?.toString() ||
            order.providerId?.toString();

        const rawProvId = (order.providerId as any)?._id?.toString() || order.providerId?.toString();
        const isProvider = rawProvId ? await ProviderModel.exists({ _id: rawProvId, userId: data.providerUserId }) : false;

        if (providerUserId !== data.providerUserId && !isProvider) {
            throw new AppError("Unauthorized: Only the assigned technician can submit an estimate", HttpStatus.FORBIDDEN);
        }

        const updates: Partial<IOrder> = {
            status: OrderStatus.ESTIMATE_PENDING_APPROVAL,
            finalAmount: data.totalAmount,
            isAmountRevised: true,
            revisionNotes: data.notes || "Post-diagnosis itemized repair estimate",
            repairEstimate: {
                items: data.items,
                laborCost: data.laborCost,
                partsCost: data.partsCost,
                otherCharges: data.otherCharges || 0,
                totalAmount: data.totalAmount,
                estimatedRepairTime: data.estimatedRepairTime || "1 - 2 hours",
                warranty: data.warranty || "90-day parts and labor warranty",
                notes: data.notes || "",
                status: 'PENDING',
                submittedAt: new Date()
            }
        };

        if (data.updatedIssues && data.updatedIssues.length > 0) {
            updates.diagnosis = {
                ...(order.diagnosis || {}),
                identifiedIssues: data.updatedIssues,
                completedAt: order.diagnosis?.completedAt || new Date()
            };
        }

        const updated = await this.orderRepository.update(data.orderId, updates);
        if (!updated) throw new AppError("Failed to submit estimate", HttpStatus.INTERNAL_SERVER_ERROR);
        return updated;
    }
}
