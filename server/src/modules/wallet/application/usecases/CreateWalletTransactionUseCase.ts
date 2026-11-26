import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { UserRole } from "../../../auth/domain/enum/UserRole";
import { WalletStatus } from "../../domain/entities/Wallet";
import {
  WalletTransaction,
  WalletTransactionCategory,
  WalletTransactionReferenceType,
  WalletTransactionStatus,
  WalletTransactionType,
} from "../../domain/entities/WalletTransaction";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { IWalletTransactionRepository } from "../../domain/repositories/IWalletTransactionRepository";
import { CreateWalletTransactionDto } from "../dtos/CreateWalletTransactionDto";
import { WalletCreditedEvent } from "../../../../shared/events/EventPayloads";
import { EVENT_TYPES } from "../../../../shared/events/EventTypes";
import { IEventBus } from "../../../../shared/events/IEventBus";

export interface CreateWalletTransactionInput extends CreateWalletTransactionDto {
  userId: string;
  roles?: UserRole[];
}

export class CreateWalletTransactionUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: IWalletTransactionRepository,
    private readonly eventBus:IEventBus,
  ) {}

  async execute(input: CreateWalletTransactionInput): Promise<WalletTransaction> {
    if (!input.walletId || !isValidObjectId(input.walletId)) {
      throw new BadRequestError("Valid walletId is required");
    }

    if (!input.referenceId || !isValidObjectId(input.referenceId)) {
      throw new BadRequestError("Valid referenceId is required");
    }

    if (input.amount === undefined || typeof input.amount !== "number" || input.amount <= 0 || isNaN(input.amount)) {
      throw new BadRequestError("Amount must be a positive number");
    }

    if (!Object.values(WalletTransactionType).includes(input.type)) {
      throw new BadRequestError("Invalid transaction type");
    }

    if (!Object.values(WalletTransactionCategory).includes(input.category)) {
      throw new BadRequestError("Invalid transaction category");
    }

    if (!Object.values(WalletTransactionReferenceType).includes(input.referenceType)) {
      throw new BadRequestError("Invalid reference type");
    }

    if (input.status && !Object.values(WalletTransactionStatus).includes(input.status)) {
      throw new BadRequestError("Invalid transaction status");
    }

    if (!input.description || !input.description.trim()) {
      throw new BadRequestError("Transaction description is required");
    }

    const wallet = await this.walletRepository.findById(input.walletId);
    if (!wallet) {
      throw new NotFoundError("Wallet not found");
    }

    if (wallet.status === WalletStatus.BLOCKED) {
      throw new BadRequestError("Wallet is blocked");
    }

    const isOwner = wallet.userId.toString() === input.userId;
    const isAdmin = input.roles?.includes(UserRole.ADMIN);
    if (!isOwner && !isAdmin) {
      throw new UnauthorizedError("Unauthorized access to wallet");
    }

    let newBalance: number;
    if (input.type === WalletTransactionType.CREDIT) {
      newBalance = wallet.balance + input.amount;
    } else if (input.type === WalletTransactionType.DEBIT) {
      if (wallet.balance < input.amount) {
        throw new BadRequestError("Insufficient wallet balance");
      }
      newBalance = wallet.balance - input.amount;
    } else {
      throw new BadRequestError("Unsupported transaction type");
    }

    const updatedWallet = await this.walletRepository.update(wallet.id!, { balance: newBalance });
    if (!updatedWallet) {
      throw new BadRequestError("Failed to update wallet balance");
    }
    const status = input.status || WalletTransactionStatus.COMPLETED;
    let transaction:WalletTransaction

    try {
      transaction = await this.transactionRepository.create({
        walletId: wallet.id!,
        type: input.type,
        category: input.category,
        amount: input.amount,
        balanceAfter: newBalance,
        status,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        description: input.description.trim(),
      });
    } catch (error) {
      // Revert wallet balance to maintain financial integrity
      await this.walletRepository.update(wallet.id!, { balance: wallet.balance });
      throw error;
    }

    if (transaction.type === WalletTransactionType.CREDIT && 
      transaction.status === WalletTransactionStatus.COMPLETED
    ) {
      this.eventBus.publish<WalletCreditedEvent>(
        EVENT_TYPES.WALLET_CREDITED,
        {
          userId: input.userId,
          amount: transaction.amount,
          transactionId: transaction.id!,
          balanceAfter:transaction.balanceAfter
        }
      )
    }


    return transaction
  }
}
