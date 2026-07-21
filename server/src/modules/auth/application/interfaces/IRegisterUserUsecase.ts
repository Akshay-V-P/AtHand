import { RegisterDto } from "../dto/RegisterDto";
import { RegisterResponseDto } from "../dto/RegisterResponseDto";

export interface IRegisterUserUsecase{
    execute(dto: RegisterDto): Promise<RegisterResponseDto>;
}