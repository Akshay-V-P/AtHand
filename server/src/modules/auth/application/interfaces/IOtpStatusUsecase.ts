export interface IOtpStatusUsecase{
    execute(email:string):Promise<object>
}