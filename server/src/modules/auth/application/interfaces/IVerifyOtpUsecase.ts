import { OtpVerifyDto } from "../dto/OtpVerifyDto";

export interface IVerifyOtpUsecase{
    execute(dto: OtpVerifyDto): Promise<void>;
}