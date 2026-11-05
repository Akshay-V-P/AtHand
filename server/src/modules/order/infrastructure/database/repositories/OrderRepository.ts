import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { IOrder } from "../../../domain/entities/OrderEntity";
import { OrderModel, IOrderDocument } from "../models/OrderModel";

export class OrderRepository {
    async create(orderData: Partial<IOrder>): Promise<IOrder> {
        const order = new OrderModel(orderData);
        const savedOrder = await order.save();
        return this.mapToEntity(savedOrder);
    }

    async findById(id: string): Promise<IOrder | null> {
        const order = await OrderModel.findById(id)
            .populate('requestId')
            .populate('providerId')
            .populate('customerId')
            .exec();
        return order ? this.mapToEntity(order) : null;
    }

    async findByRequestId(requestId: string): Promise<IOrder | null> {
        const order = await OrderModel.findOne({ requestId })
            .populate('requestId')
            .populate('providerId')
            .populate('customerId')
            .exec();
        return order ? this.mapToEntity(order) : null;
    }

    async findByCustomerId(customerId: string, page: number = 1, limit: number = 20): Promise<{ data: IOrder[], total: number }> {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            OrderModel.find({ customerId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('requestId')
                .populate('providerId')
                .exec(),
            OrderModel.countDocuments({ customerId })
        ]);

        return {
            data: orders.map(o => this.mapToEntity(o)),
            total
        };
    }

    async findByProviderId(providerId: string, page: number = 1, limit: number = 20, status?: string): Promise<PaginatedResult<IOrder>> {
        const query: any = { providerId };
        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            OrderModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('requestId')
                .populate('customerId')
                .exec(),
            OrderModel.countDocuments(query)
        ]);

        return {
            items: orders.map(o => this.mapToEntity(o)),
            totalItems: total,
            page,
            limit,
            totalPages:page
        };
    }

    async update(id: string, updates: Partial<IOrder>): Promise<IOrder | null> {
        const updated = await OrderModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        )
            .populate('requestId')
            .populate('providerId')
            .populate('customerId')
            .exec();

        return updated ? this.mapToEntity(updated) : null;
    }

    private mapToEntity(doc: any): IOrder {
        return {
            id: doc._id.toString(),
            orderNumber: doc.orderNumber || `REP-${doc._id.toString().slice(-4).toUpperCase()}`,
            requestId: doc.requestId?._id ? doc.requestId : doc.requestId?.toString(),
            quoteId: doc.quoteId?._id ? doc.quoteId : doc.quoteId?.toString(),
            providerId: doc.providerId?._id ? doc.providerId : doc.providerId?.toString(),
            customerId: doc.customerId?._id ? doc.customerId : doc.customerId?.toString(),
            serviceMode: doc.serviceMode,
            initialQuoteAmount: doc.initialQuoteAmount,
            finalAmount: doc.finalAmount,
            isAmountRevised: doc.isAmountRevised,
            revisionNotes: doc.revisionNotes,
            status: doc.status,
            appointment: doc.appointment,
            diagnosis: doc.diagnosis,
            repairEstimate: doc.repairEstimate,
            completionDetails: doc.completionDetails,
            payment: doc.payment,
            review: doc.review,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}
