import { Wallet, WalletType } from "../entities/Wallet";

export interface IWalletRepository {
  create(input: Wallet): Promise<{ wallet: Wallet; created: boolean }>;
  findById(id: string): Promise<Wallet | null>;
  findByUserId(userId: string, type?: WalletType): Promise<Wallet | null>;
  findByUserAndType(userId: string, type: WalletType): Promise<Wallet | null>;
  update(id: string, input: Partial<Wallet>): Promise<Wallet | null>;
  delete(id: string): Promise<boolean>;
}


