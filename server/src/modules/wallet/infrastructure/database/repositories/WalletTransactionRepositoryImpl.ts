import { isValidObjectId } from "mongoose";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { PaginatedResult } from "../../../../../shared/application/dtos/PaginatedResultDTO";
import { GetWalletTransactionsDto } from "../../../application/dtos/GetWalletTransactionsDto";
import { WalletTransaction } from "../../../domain/entities/WalletTransaction";
import { IWalletTransactionRepository } from "../../../domain/repositories/IWalletTransactionRepository";
import { WalletTransactionDbMapper } from "../mappers/WalletTransactionDbMapper";
import { WalletTransactionModel, WalletTransactionSchemaType } from "../models/WalletTransactionModel";

export class WalletTransactionRepositoryImpl
  extends BaseRepository<WalletTransactionSchemaType>
  implements IWalletTransactionRepository
{
  constructor() {
    super(WalletTransactionModel as any);
  }

  async create(input: WalletTransaction): Promise<WalletTransaction> {
    const doc = new WalletTransactionModel({
      walletId: input.walletId,
      type: input.type,
      category: input.category,
      amount: input.amount,
      balanceAfter: input.balanceAfter,
      status: input.status,
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      description: input.description,
    });
    const saved = await doc.save();
    return WalletTransactionDbMapper.toDomain(saved);
  }

  async findById(id: string): Promise<WalletTransaction | null> {
    if (!isValidObjectId(id)) return null;
    const doc = await this.findDocumentById(id);
    if (!doc) return null;
    return WalletTransactionDbMapper.toDomain(doc);
  }

  async findByWalletId(walletId: string): Promise<WalletTransaction[]> {
    if (!isValidObjectId(walletId)) return [];
    const docs = await WalletTransactionModel.find({ walletId }).sort({ createdAt: -1 });
    return docs.map((doc) => WalletTransactionDbMapper.toDomain(doc));
  }

  async findPaginatedByWalletId(
    options: GetWalletTransactionsDto
  ): Promise<PaginatedResult<WalletTransaction>> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      walletId: options.walletId,
    };

    if (options.type) {
      filter.type = options.type;
    }

    if (options.category) {
      filter.category = options.category;
    }

    if (options.status) {
      filter.status = options.status;
    }

    if (options.startDate || options.endDate) {
      filter.createdAt = {};
      if (options.startDate) {
        filter.createdAt.$gte = new Date(options.startDate);
      }
      if (options.endDate) {
        filter.createdAt.$lte = new Date(options.endDate);
      }
    }

    const [docs, totalItems] = await Promise.all([
      WalletTransactionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      WalletTransactionModel.countDocuments(filter),
    ]);

    return {
      items: docs.map((doc) => WalletTransactionDbMapper.toDomain(doc)),
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit) || 1,
    };
  }
}
