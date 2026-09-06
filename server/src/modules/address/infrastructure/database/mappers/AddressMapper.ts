import { Address } from "../../../domain/entities/Address";


export class AddressMapper {
    static toDomainMultiple(data: any): Address[] | [] {
        if (!data || !Array.isArray(data)) return [];
        return data.map((doc: any) => this.toDomain(doc));
    }

    static toDomain(data: any): Address {
        return new Address(
            data.userId.toString(),
            data.label,
            data.houseName,
            data.area,
            data.city,
            data.state,
            data.pincode,
            data.coordinates,
            data.isPrimary,
            data._id.toString()
        );
    }
}
