import { isValidObjectId } from "mongoose";
import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { UpdateWalletDto } from "../../../application/dtos/UpdateWalletDto";
import { Wallet, WalletType } from "../../../domain/entities/Wallet";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { WalletDbMapper } from "../mappers/WalletDbMapper";
import { WalletModel, WalletSchemaType } from "../models/WalletModel";

export class WalletRepositoryImpl extends BaseRepository<WalletSchemaType> implements IWalletRepository {
  constructor() {
    super(WalletModel);
  }

  async create(input: Wallet): Promise<{ wallet: Wallet; created: boolean }> {
    const type = input.type || WalletType.CUSTOMER;
    const wallet = await WalletModel.findOneAndUpdate(
      { userId: input.userId, type },
      {
        $setOnInsert: {
          userId: input.userId,
          type,
          balance: input.balance ?? 0,
          status: input.status,
          currency: input.currency || "INR",
        },
      },
      {
        upsert: true,
        new: true,
        includeResultMetadata: true,
        setDefaultsOnInsert: true,
      }
    );
    return {
      wallet: WalletDbMapper.toDomain(wallet.value),
      created: Boolean(wallet.lastErrorObject?.upserted),
    };
  }

  async findById(id: string): Promise<Wallet | null> {
    if (!isValidObjectId(id)) return null;
    const wallet = await this.findDocumentById(id);
    if (!wallet) return null;
    return WalletDbMapper.toDomain(wallet);
  }

  async findByUserId(userId: string, type?: WalletType): Promise<Wallet | null> {
    if (!isValidObjectId(userId)) return null;
    const targetType = type || WalletType.CUSTOMER;
    const wallet = await WalletModel.findOne({ userId, type: targetType });
    if (!wallet) return null;
    return WalletDbMapper.toDomain(wallet);
  }

  async findByUserAndType(userId: string, type: WalletType): Promise<Wallet | null> {
    if (!isValidObjectId(userId)) return null;
    const wallet = await WalletModel.findOne({ userId, type });
    if (!wallet) return null;
    return WalletDbMapper.toDomain(wallet);
  }

  async update(id: string, input: UpdateWalletDto): Promise<Wallet | null> {
    if (!isValidObjectId(id)) return null;
    const updatedWallet = await this.updateDocument(id, input);
    if (!updatedWallet) return null;
    return WalletDbMapper.toDomain(updatedWallet);
  }

  async delete(id: string): Promise<boolean> {
    throw new Error("Not implemented");
  }
}


