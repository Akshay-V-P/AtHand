import { WalletType } from "../../domain/entities/Wallet";

export interface CreateWalletDto {
  userId: string;
  type?: WalletType;
}


