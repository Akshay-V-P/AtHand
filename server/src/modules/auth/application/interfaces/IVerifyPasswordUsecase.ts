export interface IVerifyPasswordUsecase{
    execute(email:string, password:string):Promise<void>
}