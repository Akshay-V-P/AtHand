import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { Address } from "../../domain/entities/Address";
import { AddressResponseDTO } from "../dtos/AddressDTO";

export class AddressMapper {
    static toDTO(address: Address): AddressResponseDTO {
        if (!address.id) {
            throw new BadRequestError("Address ID is missing");
        }

        return {
            id: address.id,
            userId: address.userId,
            label: address.label,
            houseName: address.houseName,
            area: address.area,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            coordinates: address.coordinates,
            isPrimary: address.isPrimary
        };
    }
}
