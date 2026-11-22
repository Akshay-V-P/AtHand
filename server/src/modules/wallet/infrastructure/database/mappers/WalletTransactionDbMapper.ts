import { WalletTransaction } from "../../../domain/entities/WalletTransaction";

export class WalletTransactionDbMapper {
  static toDomain(record: any): WalletTransaction {
    return {
      id: String(record._id || record.id),
      walletId: record.walletId?.toString ? record.walletId.toString() : String(record.walletId),
      type: record.type,
      category: record.category,
      amount: record.amount,
      balanceAfter: record.balanceAfter,
      status: record.status,
      referenceType: record.referenceType,
      referenceId: record.referenceId?.toString ? record.referenceId.toString() : String(record.referenceId),
      description: record.description,
      createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : (record.createdAt ? String(record.createdAt) : undefined),
      updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : (record.updatedAt ? String(record.updatedAt) : undefined),
    };
  }

  static toPersistence(entity: Partial<WalletTransaction>) {
    return { ...entity };
  }
}
