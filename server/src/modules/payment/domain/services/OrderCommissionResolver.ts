import { IOrder } from "../../../order/domain/entities/OrderEntity";
import { ICategoryRepository } from "../../../category/domain/repositories/ICategoryRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { IQuoteRepository } from "../../../quote/domain/interfaces/IQuoteRepository";
import { CommissionCalculator, PaymentBreakdown } from "./CommissionCalculator";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";

export interface ResolvedOrderCommission {
    breakdown: PaymentBreakdown;
    categoryId: string;
    categoryName: string;
    providerId: string;
    providerUserId: string;
}

export class OrderCommissionResolver {
    public static async resolve(
        order: IOrder,
        categoryRepository: ICategoryRepository,
        serviceRequestRepository: IServiceRequestRepository,
        providerRepository: IProviderRepository,
        quoteRepository?: IQuoteRepository
    ): Promise<ResolvedOrderCommission> {
        // 1. Resolve Provider
        const providerId = (order.providerId as any)?._id?.toString() || order.providerId?.toString();
        if (!providerId) {
            throw new BadRequestError("Order is missing provider reference");
        }

        const provider = await providerRepository.findById(providerId);
        if (!provider) {
            throw new NotFoundError("Provider not found");
        }

        const providerUserId = provider.userId?.toString();
        if (!providerUserId) {
            throw new NotFoundError("Provider user account not found");
        }

        // 2. Resolve Category & Trusted Commission Percentage
        let categoryId: string | undefined;
        let categoryName = "Service";
        let commissionPercentage = 10; // Default fallback if unconfigured

        const requestId = (order.requestId as any)?._id?.toString() || order.requestId?.toString();
        if (requestId) {
            const serviceRequest = await serviceRequestRepository.findById(requestId);
            if (serviceRequest?.categoryId) {
                categoryId = (serviceRequest.categoryId as any)?._id?.toString() || serviceRequest.categoryId.toString();
            }
        }

        if (!categoryId && provider.serviceCategory) {
            categoryId = (provider.serviceCategory as any)?._id?.toString() || provider.serviceCategory.toString();
        }

        if (categoryId) {
            const category = await categoryRepository.findById(categoryId);
            if (category) {
                categoryName = category.name;
                if (typeof category.commissionPercentage === "number" && category.commissionPercentage >= 0) {
                    commissionPercentage = category.commissionPercentage;
                }
            }
        }

        // 3. Resolve Parts Amount & Labour Amount
        let partsAmount: number | undefined;
        let labourAmount: number | undefined;

        // Check if order already has an approved or submitted repair estimate with parts and labor costs
        if (
            order.repairEstimate &&
            (typeof order.repairEstimate.partsCost === "number" || typeof order.repairEstimate.laborCost === "number")
        ) {
            const parts = typeof order.repairEstimate.partsCost === "number" ? order.repairEstimate.partsCost : 0;
            const labor = typeof order.repairEstimate.laborCost === "number" ? order.repairEstimate.laborCost : 0;
            const other = typeof order.repairEstimate.otherCharges === "number" ? order.repairEstimate.otherCharges : 0;
            partsAmount = parts;
            labourAmount = labor + other;
        }

        // If not found in repairEstimate, look up the original quote
        if (
            (partsAmount === undefined || labourAmount === undefined || (partsAmount === 0 && labourAmount === 0)) &&
            order.quoteId &&
            quoteRepository
        ) {
            const quoteId = (order.quoteId as any)?._id?.toString() || order.quoteId?.toString();
            if (quoteId) {
                const quote = await quoteRepository.findById(quoteId);
                if (quote && (typeof quote.partsCost === "number" || typeof quote.laborCost === "number")) {
                    partsAmount = typeof quote.partsCost === "number" ? quote.partsCost : 0;
                    labourAmount = typeof quote.laborCost === "number" ? quote.laborCost : 0;
                }
            }
        }

        // Backward compatibility requirement:
        // Do not silently assume old payment amounts represent either parts or labour.
        // If neither parts nor labour breakdown is present, reject with a clear error.
        const payableAmount = order.finalAmount || order.initialQuoteAmount || 0;
        if (
            partsAmount === undefined ||
            labourAmount === undefined ||
            (partsAmount === 0 && labourAmount === 0 && payableAmount > 0)
        ) {
            throw new BadRequestError(
                "Cannot calculate commission: Order is missing parts and labour breakdown"
            );
        }

        // Calculate breakdown using trusted business formula
        const breakdown = CommissionCalculator.calculate({
            partsAmount,
            labourAmount,
            categoryCommissionPercentage: commissionPercentage,
        });

        return {
            breakdown,
            categoryId: categoryId || providerId,
            categoryName,
            providerId,
            providerUserId,
        };
    }
}
