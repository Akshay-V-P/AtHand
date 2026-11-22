import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { UserRole } from "../../../auth/domain/enum/UserRole";
import { WalletType } from "../../domain/entities/Wallet";
import { WalletTransaction } from "../../domain/entities/WalletTransaction";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { IWalletTransactionRepository } from "../../domain/repositories/IWalletTransactionRepository";
import { GetWalletTransactionsDto } from "../dtos/GetWalletTransactionsDto";

export interface GetWalletTransactionsInput extends Partial<GetWalletTransactionsDto> {
  userId: string;
  roles?: UserRole[];
  walletType?: WalletType;
}

export class GetWalletTransactionsUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: IWalletTransactionRepository
  ) {}

  async execute(input: GetWalletTransactionsInput): Promise<PaginatedResult<WalletTransaction>> {
    let wallet;

    if (input.walletId) {
      if (!isValidObjectId(input.walletId)) {
        throw new BadRequestError("Valid wallet ID is required");
      }
      wallet = await this.walletRepository.findById(input.walletId);
    } else {
      const targetType = input.walletType || WalletType.CUSTOMER;
      wallet = await this.walletRepository.findByUserAndType(input.userId, targetType);
    }

    if (!wallet) {
      return {
        items: [],
        totalItems: 0,
        page: Math.max(1, Number(input.page) || 1),
        limit: Math.max(1, Number(input.limit) || 10),
        totalPages: 0,
      };
    }

    const isOwner = wallet.userId.toString() === input.userId;
    const isAdmin = input.roles?.includes(UserRole.ADMIN);
    if (!isOwner && !isAdmin) {
      throw new UnauthorizedError("Unauthorized access to wallet");
    }

    return this.transactionRepository.findPaginatedByWalletId({
      walletId: wallet.id!,
      page: input.page,
      limit: input.limit,
      type: input.type,
      category: input.category,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
    });
  }
}

