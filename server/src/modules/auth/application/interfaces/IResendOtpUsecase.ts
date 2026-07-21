import { ResendOtpDto } from "../dto/ResendOtpDto";

export interface IResendOtpUsecase{
    execute(dto: ResendOtpDto): Promise<void>;
}