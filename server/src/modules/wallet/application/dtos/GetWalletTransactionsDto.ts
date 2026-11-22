import {
  WalletTransactionCategory,
  WalletTransactionStatus,
  WalletTransactionType,
} from "../../domain/entities/WalletTransaction";

export interface GetWalletTransactionsDto {
  walletId: string;
  page?: number;
  limit?: number;
  type?: WalletTransactionType;
  category?: WalletTransactionCategory;
  status?: WalletTransactionStatus;
  startDate?: Date | string;
  endDate?: Date | string;
}
