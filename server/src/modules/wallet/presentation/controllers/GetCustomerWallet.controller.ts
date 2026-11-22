import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { GetCustomerWalletUseCase } from "../../application/usecases/GetCustomerWalletUseCase";

export class GetCustomerWalletController {
  constructor(private readonly getCustomerWalletUseCase: GetCustomerWalletUseCase) {}

  readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const wallet = await this.getCustomerWalletUseCase.execute(userId);
      ResponseHandler.success(res, HttpStatus.OK, "Customer wallet fetched", wallet);
    } catch (error) {
      next(error);
    }
  };
}
