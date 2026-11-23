import {
    CommissionLedgerFilter,
    ICommissionLedgerRepository,
    PaginatedCommissionLedgerResult,
    PlatformFinancialSummary,
} from "../../../domain/interfaces/ICommissionLedgerRepository";
import { PlatformCommissionLedger } from "../../../domain/entities/PlatformCommissionLedger";
import { PlatformCommissionLedgerModel } from "../models/PlatformCommissionLedgerModel";

export class CommissionLedgerRepository implements ICommissionLedgerRepository {
    private mapToEntity(doc: any): PlatformCommissionLedger {
        return {
            id: doc._id.toString(),
            orderId: doc.orderId?.toString() || doc.orderId,
            paymentId: doc.paymentId?.toString() || doc.paymentId,
            providerId: doc.providerId?.toString() || doc.providerId,
            providerUserId: doc.providerUserId?.toString() || doc.providerUserId,
            categoryId: doc.categoryId?.toString() || doc.categoryId,
            categoryName: doc.categoryName,
            orderNumber: doc.orderNumber,
            paymentMethod: doc.paymentMethod,
            grossAmount: doc.grossAmount,
            commissionPercentage: doc.commissionPercentage,
            commissionAmount: doc.commissionAmount,
            providerEarnings: doc.providerEarnings,
            currency: doc.currency,
            status: doc.status,
            refundedAmount: doc.refundedAmount || 0,
            partsAmount: doc.partsAmount,
            labourAmount: doc.labourAmount,
            partsCommissionPercentage: doc.partsCommissionPercentage,
            labourCommissionPercentage: doc.labourCommissionPercentage,
            partsCommissionAmount: doc.partsCommissionAmount,
            labourCommissionAmount: doc.labourCommissionAmount,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    async create(data: Omit<PlatformCommissionLedger, "id">): Promise<PlatformCommissionLedger> {
        const doc = new PlatformCommissionLedgerModel(data);
        const saved = await doc.save();
        return this.mapToEntity(saved);
    }

    async findById(id: string): Promise<PlatformCommissionLedger | null> {
        const doc = await PlatformCommissionLedgerModel.findById(id).exec();
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByOrderId(orderId: string): Promise<PlatformCommissionLedger | null> {
        const doc = await PlatformCommissionLedgerModel.findOne({ orderId }).exec();
        return doc ? this.mapToEntity(doc) : null;
    }

    async findByPaymentId(paymentId: string): Promise<PlatformCommissionLedger | null> {
        const doc = await PlatformCommissionLedgerModel.findOne({ paymentId }).exec();
        return doc ? this.mapToEntity(doc) : null;
    }

    async update(id: string, data: Partial<PlatformCommissionLedger>): Promise<PlatformCommissionLedger | null> {
        const updated = await PlatformCommissionLedgerModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        ).exec();
        return updated ? this.mapToEntity(updated) : null;
    }

    async findAll(filter: CommissionLedgerFilter): Promise<PaginatedCommissionLedgerResult> {
        const query: any = {};

        if (filter.categoryId) {
            query.categoryId = filter.categoryId;
        }

        if (filter.providerId) {
            query.providerId = filter.providerId;
        }

        if (filter.status) {
            query.status = filter.status;
        }

        if (filter.startDate || filter.endDate) {
            query.createdAt = {};
            if (filter.startDate) {
                query.createdAt.$gte = filter.startDate;
            }
            if (filter.endDate) {
                query.createdAt.$lte = filter.endDate;
            }
        }

        if (filter.search) {
            query.$or = [
                { orderNumber: { $regex: filter.search, $options: "i" } },
                { categoryName: { $regex: filter.search, $options: "i" } },
            ];
        }

        const page = Math.max(1, filter.page || 1);
        const limit = Math.max(1, Math.min(100, filter.limit || 10));
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            PlatformCommissionLedgerModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            PlatformCommissionLedgerModel.countDocuments(query).exec(),
        ]);

        return {
            items: docs.map((d) => this.mapToEntity(d)),
            total,
            page,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    async getFinancialSummary(startDate?: Date, endDate?: Date): Promise<PlatformFinancialSummary> {
        const match: any = {};
        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = startDate;
            if (endDate) match.createdAt.$lte = endDate;
        }

        const result = await PlatformCommissionLedgerModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalGrossAmount: { $sum: "$grossAmount" },
                    totalCommissionAmount: { $sum: "$commissionAmount" },
                    totalProviderEarnings: { $sum: "$providerEarnings" },
                    totalRefundedAmount: { $sum: "$refundedAmount" },
                    totalPartsAmount: { $sum: { $ifNull: ["$partsAmount", 0] } },
                    totalLabourAmount: { $sum: { $ifNull: ["$labourAmount", 0] } },
                    totalPartsCommissionAmount: { $sum: { $ifNull: ["$partsCommissionAmount", 0] } },
                    totalLabourCommissionAmount: { $sum: { $ifNull: ["$labourCommissionAmount", 0] } },
                    totalAllocations: { $sum: 1 },
                },
            },
        ]).exec();

        if (result.length === 0) {
            return {
                totalGrossAmount: 0,
                totalCommissionAmount: 0,
                totalProviderEarnings: 0,
                totalAllocations: 0,
                totalRefundedAmount: 0,
                totalPartsAmount: 0,
                totalLabourAmount: 0,
                totalPartsCommissionAmount: 0,
                totalLabourCommissionAmount: 0,
            };
        }

        const r = result[0];
        return {
            totalGrossAmount: Math.round(r.totalGrossAmount * 100) / 100,
            totalCommissionAmount: Math.round(r.totalCommissionAmount * 100) / 100,
            totalProviderEarnings: Math.round(r.totalProviderEarnings * 100) / 100,
            totalRefundedAmount: Math.round((r.totalRefundedAmount || 0) * 100) / 100,
            totalPartsAmount: Math.round((r.totalPartsAmount || 0) * 100) / 100,
            totalLabourAmount: Math.round((r.totalLabourAmount || 0) * 100) / 100,
            totalPartsCommissionAmount: Math.round((r.totalPartsCommissionAmount || 0) * 100) / 100,
            totalLabourCommissionAmount: Math.round((r.totalLabourCommissionAmount || 0) * 100) / 100,
            totalAllocations: r.totalAllocations || 0,
        };
    }
}
