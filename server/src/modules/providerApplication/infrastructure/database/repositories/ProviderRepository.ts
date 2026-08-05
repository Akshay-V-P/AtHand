import { BaseRepository } from "../../../../../shared/infrastructure/database/BaseRepository";
import { Provider } from "../../../domain/entities/Provider";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
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
    
    async create(provider: Provider): Promise<Provider> {
        const providerMongoType = ProviderMapper.toMongoose(provider) 
        const newProvider = await this.createDocument(providerMongoType)
        return ProviderMapper.toDomain(newProvider)
    }

    async update(id: string, updateData: Partial<Provider>): Promise<Provider | null> {
        const updatedProvider = await this.updateDocument(id, updateData)
        if (!updatedProvider) return null
        return ProviderMapper.toDomain(updatedProvider)
    }
}