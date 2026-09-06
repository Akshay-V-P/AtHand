import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { UpdateAddressDTO, AddressResponseDTO } from "../dtos/AddressDTO";
import { AddressMapper } from "../mappers/AddressMapper";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Address } from "../../domain/entities/Address";

export class UpdateAddressUsecase {
    constructor(private readonly addressRepository: IAddressRepository) { }

    async execute(data: UpdateAddressDTO): Promise<AddressResponseDTO> {
        const existing = await this.addressRepository.findById(data.id);
        if (!existing || existing.userId !== data.userId) {
            throw new NotFoundError("Address not found");
        }

        if (data.isPrimary && !existing.isPrimary) {
            await this.addressRepository.removePrimaryFlag(data.userId);
        }

        const updatedAddress = new Address(
            data.userId,
            data.label || existing.label,
            data.houseName || existing.houseName,
            data.area || existing.area,
            data.city || existing.city,
            data.state || existing.state,
            data.pincode || existing.pincode,
            data.coordinates || existing.coordinates,
            data.isPrimary !== undefined ? data.isPrimary : existing.isPrimary,
            data.id
        );

        const saved = await this.addressRepository.update(updatedAddress);
        if (!saved) throw new NotFoundError("Address could not be updated");

        return AddressMapper.toDTO(saved);
    }
}
