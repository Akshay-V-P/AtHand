export interface ILogoutUserUsecase{
    execute(id: string, sessionId: string): Promise<void>;
}