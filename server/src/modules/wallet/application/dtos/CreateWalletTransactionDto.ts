import {
  WalletTransactionCategory,
  WalletTransactionReferenceType,
  WalletTransactionStatus,
  WalletTransactionType,
} from "../../domain/entities/WalletTransaction";

export interface CreateWalletTransactionDto {
  walletId: string;
  type: WalletTransactionType;
  category: WalletTransactionCategory;
  amount: number;
  referenceType: WalletTransactionReferenceType;
  referenceId: string;
  description: string;
  status?: WalletTransactionStatus;
}
