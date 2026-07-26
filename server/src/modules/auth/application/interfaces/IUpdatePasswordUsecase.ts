export interface IUpdatePasswordUsecase{
    execute(token:string, newPassword: string): Promise<void>;
}