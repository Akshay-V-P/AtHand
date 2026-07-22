import { GetProfileDto } from "../dto/GetProfileDto";

export interface IGetProfileUsecase{
    execute(id:string):Promise<GetProfileDto | null>
}