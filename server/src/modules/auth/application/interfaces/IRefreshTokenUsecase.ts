export interface IRefreshTokenUsecase{
    execute(refreshToken: string): Promise<string>;
}