import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { BlockWalletUsecase } from "../../application/usecases/BlockWalletUsecase";

export class BlockWalletController{
    constructor(
        private readonly useCase:BlockWalletUsecase
    ) { }

    readonly handler = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const { id } = req.params as {id:string}
            if (!id) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Id is not provided")
                return
            }
            const wallet = await this.useCase.execute(id)
            ResponseHandler.success(res, HttpStatus.OK, "Wallet blocked", wallet)
        } catch (error) {
            next(error)
        }
    }
}