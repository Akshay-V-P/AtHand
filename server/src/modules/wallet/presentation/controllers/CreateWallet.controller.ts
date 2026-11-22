import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { CreateWalletUseCase } from "../../application/usecases/CreateWalletUseCase";

export class CreateWalletController{
    constructor(
        private readonly createWalletUsecase:CreateWalletUseCase
    ) { }
    
    readonly handler = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            
            const { userId } = req.body
            if (!userId) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Provide a valid userId")
                return
            }

            const result = await this.createWalletUsecase.execute({ userId })

            ResponseHandler.success(res, HttpStatus.OK, "Wallet created", result)

        } catch (error) {
            next(error)
        }
    }
}