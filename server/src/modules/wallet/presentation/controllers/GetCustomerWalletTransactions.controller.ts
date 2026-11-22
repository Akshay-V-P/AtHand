import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { WalletType } from "../../domain/entities/Wallet";
import {
  WalletTransactionCategory,
  WalletTransactionStatus,
  WalletTransactionType,
} from "../../domain/entities/WalletTransaction";
import { GetWalletTransactionsUseCase } from "../../application/usecases/GetWalletTransactionsUseCase";

export class GetCustomerWalletTransactionsController {
  constructor(private readonly getWalletTransactionsUseCase: GetWalletTransactionsUseCase) {}

  readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const type = req.query.type as WalletTransactionType | undefined;
      const category = req.query.category as WalletTransactionCategory | undefined;
      const status = req.query.status as WalletTransactionStatus | undefined;
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;

      const result = await this.getWalletTransactionsUseCase.execute({
        userId,
        walletType: WalletType.CUSTOMER,
        roles: req.user?.role,
        page,
        limit,
        type,
        category,
        status,
        startDate,
        endDate,
      });

      ResponseHandler.success(res, HttpStatus.OK, "Customer wallet transactions fetched", result);
    } catch (error) {
      next(error);
    }
  };
}
