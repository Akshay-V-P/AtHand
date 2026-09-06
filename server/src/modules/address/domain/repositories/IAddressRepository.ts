import { Address } from "../entities/Address";

export interface IAddressRepository {
    create(address: Address): Promise<Address>;
    findByUserId(userId: string): Promise<Address[]>;
    findById(id: string): Promise<Address | null>;
    update(address: Address): Promise<Address | null>;
    delete(id: string): Promise<void>;
    removePrimaryFlag(userId: string): Promise<void>;
}
