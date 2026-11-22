import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { UpdateWalletBalanceUseCase } from "../../application/usecases/UpdateWalletBalanceUseCase";

export class UpdateWalletBalanceController {
  constructor(private readonly updateWalletBalanceUseCase: UpdateWalletBalanceUseCase) {}

  readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      if (!id) {
        ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Wallet id is required");
        return;
      }

      const { balance } = req.body;
      if (balance === undefined || typeof balance !== "number" || balance < 0 || isNaN(balance)) {
        ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Valid balance is required and must be non-negative");
        return;
      }

      const updatedWallet = await this.updateWalletBalanceUseCase.execute(id, { balance });
      ResponseHandler.success(res, HttpStatus.OK, "Wallet balance updated", updatedWallet);
    } catch (error) {
      next(error);
    }
  };
}
