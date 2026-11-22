import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { UserRole } from "../../../auth/domain/enum/UserRole";
import { WalletTransaction } from "../../domain/entities/WalletTransaction";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { IWalletTransactionRepository } from "../../domain/repositories/IWalletTransactionRepository";

export interface GetWalletTransactionByIdInput {
  id: string;
  userId: string;
  roles?: UserRole[];
}

export class GetWalletTransactionByIdUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: IWalletTransactionRepository
  ) {}

  async execute(input: GetWalletTransactionByIdInput): Promise<WalletTransaction> {
    if (!input.id || !isValidObjectId(input.id)) {
      throw new BadRequestError("Valid transaction ID is required");
    }

    const transaction = await this.transactionRepository.findById(input.id);
    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    const wallet = await this.walletRepository.findById(transaction.walletId);
    if (wallet) {
      const isOwner = wallet.userId.toString() === input.userId;
      const isAdmin = input.roles?.includes(UserRole.ADMIN);
      if (!isOwner && !isAdmin) {
        throw new UnauthorizedError("Unauthorized access to transaction");
      }
    }

    return transaction;
  }
}
