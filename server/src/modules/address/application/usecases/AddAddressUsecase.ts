import { Address } from "../../domain/entities/Address";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { CreateAddressDTO, AddressResponseDTO } from "../dtos/AddressDTO";
import { AddressMapper } from "../mappers/AddressMapper";

export class AddAddressUsecase {
    constructor(private readonly addressRepository: IAddressRepository) { }

    async execute(data: CreateAddressDTO): Promise<AddressResponseDTO> {
        if (data.isPrimary) {
            await this.addressRepository.removePrimaryFlag(data.userId);
        }

        const address = new Address(
            data.userId,
            data.label,
            data.houseName,
            data.area,
            data.city,
            data.state,
            data.pincode,
            data.coordinates,
            data.isPrimary || false
        );

        const newAddress = await this.addressRepository.create(address);
        return AddressMapper.toDTO(newAddress);
    }
}
