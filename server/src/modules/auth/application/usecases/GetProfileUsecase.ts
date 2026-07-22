import { UserMapper } from "../../domain/mappers/UserMapper";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { GetProfileDto } from "../dto/GetProfileDto";
import { IGetProfileUsecase } from "../interfaces/IGetProfileUsecase";

export class GetProfileUsecase implements IGetProfileUsecase{
    constructor(
        private readonly userRepository:IUserRepository
    ) { }
    
    async execute(id: string): Promise<GetProfileDto | null>{
        const user = await this.userRepository.findById(id) 
        if(!user) return null
        return UserMapper.toGetProfileDTO(user!)
    }
}