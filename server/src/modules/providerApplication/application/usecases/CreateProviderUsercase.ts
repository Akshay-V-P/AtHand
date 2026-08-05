import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { Provider } from "../../domain/entities/Provider";
import { ProviderStatus } from "../../domain/enums/ProviderStatus";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { CreateProviderDto} from "../dtos/CreateProviderDto";
import { IUsecase } from "../interfaces/IUsecase";

export class CreateProviderUsecase implements IUsecase<CreateProviderDto, Provider>{
    constructor(
        private readonly providerRepo: IProviderRepository,
    ) { }
    
    async execute(data: CreateProviderDto): Promise<Provider> {

        const isProviderExists = await this.providerRepo.findByUserId(data.userId)
        if (isProviderExists) throw new ConflictError("Provider already exists")

        const isEmailExists = await this.providerRepo.findByEmail(data.email)
        if (isEmailExists) throw new ConflictError("Email is already in use")
        
        //TODO: Validate service category once service category module is completed
        
        const [longitude, latitude] = data.location.coordinates.coordinates
        if (
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180 
        ) {
            throw new BadRequestError("Invalid location coordinates")
        }
        
        if (data.serviceRadius < 0 || data.serviceRadius > 30) throw new BadRequestError("Service radius must be between 0 and 30 km.")
        
        const newProvider = new Provider(
            data.userId,
            data.businessName,
            data.contactPerson,
            data.phone,
            data.email,
            data.serviceCategory,
            data.location,
            data.serviceRadius,
            0,
            0,
            ProviderStatus.PENDING,
            0,
            0,
        )
        
        return this.providerRepo.create(newProvider)

    }
}