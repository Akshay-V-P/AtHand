import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { AddressResponseDTO } from "../dtos/AddressDTO";
import { AddressMapper } from "../mappers/AddressMapper";

export class GetAddressesUsecase {
    constructor(private readonly addressRepository: IAddressRepository) { }

    async execute(userId: string): Promise<AddressResponseDTO[]> {
        const addresses = await this.addressRepository.findByUserId(userId);
        return addresses.map(addr => AddressMapper.toDTO(addr));
    }
}
