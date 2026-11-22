import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { GetWalletTransactionsDto } from "../../application/dtos/GetWalletTransactionsDto";
import { WalletTransaction } from "../entities/WalletTransaction";

export interface IWalletTransactionRepository {
  create(transaction: WalletTransaction): Promise<WalletTransaction>;
  findById(id: string): Promise<WalletTransaction | null>;
  findByWalletId(walletId: string): Promise<WalletTransaction[]>;
  findPaginatedByWalletId(options: GetWalletTransactionsDto): Promise<PaginatedResult<WalletTransaction>>;
}
