import { Wallet, WalletType } from "../../../domain/entities/Wallet";

export class WalletDbMapper {
  static toDomain(record: any): Wallet {
    return {
      id: String(record._id || record.id),
      userId: record.userId?.toString ? record.userId.toString() : String(record.userId),
      balance: record.balance,
      status: record.status,
      type: (record.type as WalletType) || WalletType.CUSTOMER,
      currency: record.currency,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  static toPersistence(entity: Partial<Wallet>) {
    return { ...entity };
  }
}


