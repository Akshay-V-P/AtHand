import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { IProviderUpdateData } from "../../../application/dtos/UpdateProviderDto";
import { Provider } from "../../../domain/entities/Provider";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { ProviderFilter } from "../../../domain/types/ProviderFilter";
import ProviderMapper from "../mappers/ProviderMapper";
import ProviderModel, { ProviderSchemaType } from "../models/ProviderModel";

export class ProviderRepository extends BaseRepository<ProviderSchemaType> implements IProviderRepository{
    constructor() {
        super(ProviderModel)
    }

    async findByEmail(email: string): Promise<Provider | null> {
        const provider = await this.findDocumentByEmail(email)
        if (!provider) return null
        return ProviderMapper.toDomain(provider)
    }

    async findById(id: string): Promise<Provider | null> {
        const provider = await this.findDocumentById(id)
        if (!provider) return null
        return ProviderMapper.toDomain(provider)
    }

    async findByUserId(userId: string): Promise<Provider | null> {
        const provider = await ProviderModel.findOne({ userId })
        if (!provider) return null
        return ProviderMapper.toDomain(provider)
    }

    async findMany(filter: ProviderFilter): Promise<Provider[]> {
        const query: any = {};

        
        const skip = (filter.page-1)*filter.limit

        if (filter?.status) {
            query.status = filter.status;
        }

        if (filter?.categoryId) {
            query.serviceCategory = filter.categoryId
        }

        if (filter?.minRating) {
            query.averageRating = {
                $gte:filter.minRating
            }
        }

        const providers = await ProviderModel.find(query).populate("serviceCategory").skip(skip).limit(filter.limit)


        return providers.map(ProviderMapper.toDomain)
    }

    async findCount(): Promise<number>{
        const count = await ProviderModel.countDocuments()
        console.log(count)
        return count
    }
    
    async create(provider: Provider): Promise<Provider> {
        const providerMongoType = ProviderMapper.toMongoose(provider) 
        const newProvider = await this.createDocument(providerMongoType)
        return ProviderMapper.toDomain(newProvider)
    }

    async update(id: string, updateData: IProviderUpdateData): Promise<Provider | null> {
        const updatedProvider = await this.updateDocument(id, updateData)
        if (!updatedProvider) return null
        return ProviderMapper.toDomain(updatedProvider)
    }
}