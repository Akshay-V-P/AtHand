import { Provider } from "../entities/Provider";

export interface IProviderRepository{
    findByEmail(email: string): Promise<Provider | null>;
    findById(id: string): Promise<Provider | null>;
    findByUserId(userId: string): Promise<Provider | null>;
    create(provider: Provider): Promise<Provider>;
    update(id:string, updateData:Partial<Provider>):Promise<Provider | null>
}