import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { RegisterDto } from "../../../application/dto/RegisterDto";
import { RegisterResponseDto } from "../../../application/dto/RegisterResponseDto";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { AUTH_MESSAGES } from "../../constants/authMessage";

export class SignupController{
    constructor(
        private readonly registerUseCase: IUsecase<RegisterDto, RegisterResponseDto>,
    ) { }
    
    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const dto:RegisterDto = req.body
            const registered = await this.registerUseCase.execute(dto)
            
            res.cookie('registrationToken', registered.registrationToken, {
                httpOnly: true,
                secure:false,
                sameSite: 'lax',
                maxAge:15*60*60*1000
            })
            if (!registered.newRegister) {
                ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.USER_ALREADY_EXISTS_VERIFY)
                return
            }
            ResponseHandler.success(res, HttpStatus.OK, AUTH_MESSAGES.OTP_SENT)
        } catch (error) {
            next(error)
        }
    }
}