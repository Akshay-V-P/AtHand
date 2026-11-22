import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { GetProviderWalletUseCase } from "../../application/usecases/GetProviderWalletUseCase";

export class GetProviderWalletController {
  constructor(private readonly getProviderWalletUseCase: GetProviderWalletUseCase) {}

  readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ResponseHandler.error(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
        return;
      }

      const wallet = await this.getProviderWalletUseCase.execute({
        userId,
        roles: req.user?.role,
      });

      ResponseHandler.success(res, HttpStatus.OK, "Provider wallet fetched", wallet);
    } catch (error) {
      next(error);
    }
  };
}
