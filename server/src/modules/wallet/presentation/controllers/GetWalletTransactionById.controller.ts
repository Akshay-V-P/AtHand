import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { GetWalletTransactionByIdUseCase } from "../../application/usecases/GetWalletTransactionByIdUseCase";

export class GetWalletTransactionByIdController {
  constructor(private readonly getWalletTransactionByIdUseCase: GetWalletTransactionByIdUseCase) {}

  readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const { id } = req.params as { id: string };
      if (!id) {
        ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Transaction ID is required");
        return;
      }

      const result = await this.getWalletTransactionByIdUseCase.execute({
        id,
        userId,
        roles: req.user?.role,
      });

      ResponseHandler.success(res, HttpStatus.OK, "Transaction fetched", result);
    } catch (error) {
      next(error);
    }
  };
}
