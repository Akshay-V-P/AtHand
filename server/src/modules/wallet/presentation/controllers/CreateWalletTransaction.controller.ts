import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { CreateWalletTransactionUseCase } from "../../application/usecases/CreateWalletTransactionUseCase";

export class CreateWalletTransactionController {
  constructor(private readonly createWalletTransactionUseCase: CreateWalletTransactionUseCase) {}

  readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const params = req.params as Record<string, string | undefined>;
      const walletId = params.id || params.walletId || req.body.walletId;
      const {
        type,
        category,
        amount,
        referenceType,
        referenceId,
        description,
        status,
      } = req.body;

      if (!walletId) {
        ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Wallet ID is required");
        return;
      }

      if (amount === undefined || typeof amount !== "number" || amount <= 0) {
        ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Valid positive amount is required");
        return;
      }

      const result = await this.createWalletTransactionUseCase.execute({
        walletId,
        userId,
        roles: req.user?.role,
        type,
        category,
        amount,
        referenceType,
        referenceId,
        description,
        status,
      });

      ResponseHandler.success(res, HttpStatus.CREATED, "Transaction created", result);
    } catch (error) {
      next(error);
    }
  };
}
