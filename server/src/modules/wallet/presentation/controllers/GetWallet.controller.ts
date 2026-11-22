import { NextFunction, Request, Response } from "express";
import { GetWalletUseCase } from "../../application/usecases/GetWalletUseCase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class GetWalletController{
    constructor(
        private readonly getWalletUsecase:GetWalletUseCase
    ) { }
    
    readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as {id:string}
            if (!id) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Wallet id required")
                return
            }

            const wallet = await this.getWalletUsecase.execute(id)

            ResponseHandler.success(res, HttpStatus.OK, "Wallet fetched", wallet)
        } catch (error) {
            next(error)
        }
    }
}