export interface IVerifyResetTokenUsecase{
    execute(token: string): Promise<void>;
}