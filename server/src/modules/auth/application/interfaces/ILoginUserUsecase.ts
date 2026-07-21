import { LoginDto } from "../dto/LoginDto";
import { LoginResponseDto } from "../dto/LoginResponseDto";

export interface ILoginUserUsecase{
    execute(dto: LoginDto): Promise<LoginResponseDto>;
}