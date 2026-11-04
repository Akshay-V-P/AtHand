import { IOrder } from "../../domain/entities/OrderEntity";
import { OrderRepository } from "../../infrastructure/database/repositories/OrderRepository";
import { IQuoteRepository } from "../../../quote/domain/interfaces/IQuoteRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { QuoteStatus } from "../../../quote/domain/enums/QuoteStatus";
import { ServiceRequestStatus } from "../../../service-request/domain/enums/ServiceRequestStatus";
import { OrderStatus } from "../../domain/enums/OrderStatus";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ServiceMode } from "../../../../shared/enums/ServiceMode";

export class CreateOrderUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private quoteRepository: IQuoteRepository,
        private serviceRequestRepository: IServiceRequestRepository
    ) { }

    async execute(data: {
        customerId: string;
        quoteId: string;
        appointmentDate?: Date;
        timeSlot?: string;
        accessInstructions?: string;
    }): Promise<IOrder> {
        // 1. Find the quote
        const quote = await this.quoteRepository.findById(data.quoteId);
        if (!quote) throw new AppError('Quote not found', HttpStatus.NOT_FOUND);

        // Check if an order already exists for this request
        const existingOrder = await this.orderRepository.findByRequestId(quote.requestId);
        if (existingOrder) {
            throw new AppError('An order has already been created for this service request', HttpStatus.BAD_REQUEST);
        }

        // 2. Find the service request to verify ownership
        const serviceRequest = await this.serviceRequestRepository.findById(quote.requestId);
        if (!serviceRequest) throw new AppError('Service request not found', HttpStatus.NOT_FOUND);

        if (serviceRequest.userId.toString() !== data.customerId.toString()) {
            throw new AppError('Unauthorized to accept this quote', HttpStatus.FORBIDDEN);
        }

        if (serviceRequest.status !== ServiceRequestStatus.QUOTING && serviceRequest.status !== ServiceRequestStatus.OPEN) {
            throw new AppError('Service request is not open for quoting', HttpStatus.BAD_REQUEST);
        }

        // 3. Mark all quotes for this request as REJECTED, except the accepted one
        const allQuotes = await this.quoteRepository.findByRequestId(quote.requestId);
        const updatePromises = allQuotes.map(q => {
            if (q.id === data.quoteId) {
                return this.quoteRepository.update(q.id!, { status: QuoteStatus.ACCEPTED });
            } else {
                return this.quoteRepository.update(q.id!, { status: QuoteStatus.REJECTED });
            }
        });
        await Promise.all(updatePromises);

        // 4. Update the service request status
        await this.serviceRequestRepository.update(quote.requestId, { status: ServiceRequestStatus.QUOTE_ACCEPTED });

        // Determine service mode
        const mode = (serviceRequest as any).serviceMode ||
            ((quote as any).serviceMode) ||
            (serviceRequest.onSite ? ServiceMode.ONSITE : ServiceMode.WORKSHOP);

        const scheduledDate = data.appointmentDate || serviceRequest.preferredDate || new Date();
        const timeSlot = data.timeSlot || serviceRequest.preferredTimeSlot || "Morning (10:00 AM - 1:00 PM)";

        const orderNumber = `REP-${Math.floor(1000 + Math.random() * 9000)}`;

        // 5. Create the Order
        const newOrder = await this.orderRepository.create({
            orderNumber,
            requestId: quote.requestId,
            quoteId: quote.id,
            providerId: (quote.providerId as any)?._id?.toString() || quote.providerId.toString(),
            customerId: data.customerId,
            serviceMode: mode,
            initialQuoteAmount: quote.estimatedTotal,
            finalAmount: quote.estimatedTotal,
            isAmountRevised: false,
            status: OrderStatus.SCHEDULED,
            appointment: {
                scheduledDate,
                timeSlot,
                serviceAddress: serviceRequest.address,
                accessInstructions: data.accessInstructions || "",
                confirmedAt: new Date()
            },
            payment: {
                diagnosisFee: (quote as any).diagnosisFee || 0,
                totalAmount: quote.estimatedTotal,
                status: 'PENDING',
                paymentMethod: 'ONLINE'
            }
        });

        return newOrder;
    }
}
