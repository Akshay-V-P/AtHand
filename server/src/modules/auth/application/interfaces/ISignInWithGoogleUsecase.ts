import { AuthServiceResponse } from "../../domain/services/IAuthService";
import { LoginResponseDto } from "../dto/LoginResponseDto";

export interface ISignInWithGoogleUsecase{
    execute(token:string): Promise<LoginResponseDto>;
}