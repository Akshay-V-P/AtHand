import { NextFunction, Request, Response } from "express";
import { UnblockWalletUsecase } from "../../application/usecases/UnblockWalletUsecase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class UnblockWalletController {
  constructor(
    private readonly useCase:UnblockWalletUsecase
  ) {}

  readonly handler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const { id } = req.params as { id: string }
      
      if (!id) {
        ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Id is not prvided")
        return
      }

      await this.useCase.execute(id)
      ResponseHandler.success(res, HttpStatus.OK, "Wallet unblocked")

    } catch (error) {
      next(error);
    }
  };
}

